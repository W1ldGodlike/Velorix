import { spawn } from 'child_process'

/** Диапазон экспорта по маркерам §7.1 (секунды на шкале исходника). */
export interface MediaExportTrimPayload {
  inSec: number
  outSec: number
}

/** Первые системные пресеты libx264 §7.2 — только белый список, без произвольных аргументов. */
export type FfmpegExportEncodePresetId = 'balance' | 'smaller' | 'quality'

export interface MediaExportRequestPayload {
  inputPath: string
  trim?: MediaExportTrimPayload
  probeDurationSec?: number | null
  /** Если не задан — в main берётся из `settings.json`. */
  encodePreset?: FfmpegExportEncodePresetId
}

/** Разбор сохранённой строки или поля IPC; мусор → безопасный `balance`. */
export function parseFfmpegExportEncodePreset(raw: unknown): FfmpegExportEncodePresetId {
  if (raw === 'balance' || raw === 'smaller' || raw === 'quality') {
    return raw
  }
  return 'balance'
}

/** CRF и `-preset` x264 для выбранного пресета (аудио пока фиксированное AAC §7.1). */
export function resolveExportEncodeParams(preset: FfmpegExportEncodePresetId): {
  crf: string
  x264preset: string
} {
  switch (preset) {
    case 'smaller':
      return { crf: '28', x264preset: 'fast' }
    case 'quality':
      return { crf: '18', x264preset: 'medium' }
    default:
      return { crf: '23', x264preset: 'fast' }
  }
}

export type MediaExportStartResult =
  | { ok: true }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }

export interface FfmpegExportProgressPayload {
  /** 0..100 или −1, если по stderr ещё не удалось оценить прогресс. */
  percent: number
  message: string
  /** Множитель относительно реального времени (`1.04x`, `N/A`), из последней строки статистики со `speed=`. */
  speed?: string
}

/** Поле `speed=` в строках прогресса ffmpeg (`-stats`). */
export function parseFfmpegSpeedToken(line: string): string | null {
  const m = line.match(/\bspeed=\s*(\S+)/)
  return m ? m[1] : null
}

export function parseFfmpegTimeSeconds(line: string): number | null {
  const m = line.match(/time=(\d+):(\d+):(\d+(?:\.\d+)?)/)
  if (!m) {
    return null
  }
  const h = Number(m[1])
  const min = Number(m[2])
  const sec = Number(m[3])
  if (!Number.isFinite(h + min + sec)) {
    return null
  }
  return h * 3600 + min * 60 + sec
}

function shouldApplyTrim(
  trim: MediaExportTrimPayload | undefined,
  probeDurationSec: number | null | undefined
): trim is MediaExportTrimPayload {
  if (!trim || !Number.isFinite(trim.inSec) || !Number.isFinite(trim.outSec)) {
    return false
  }
  const span = trim.outSec - trim.inSec
  if (span <= 0.05) {
    return false
  }
  if (
    probeDurationSec !== null &&
    probeDurationSec !== undefined &&
    Number.isFinite(probeDurationSec) &&
    probeDurationSec > 0.5
  ) {
    // Почти весь файл — кодируем без -ss/-t, чтобы не резать по ключевым кадрам отдельно.
    if (trim.inSec < 0.08 && Math.abs(span - probeDurationSec) < 0.35) {
      return false
    }
  }
  return true
}

export function resolveExportSegmentDurationSec(
  trim: MediaExportTrimPayload | undefined,
  applyTrim: boolean,
  probeDurationSec: number | null | undefined
): number {
  if (applyTrim && trim) {
    return Math.max(0.01, trim.outSec - trim.inSec)
  }
  if (
    probeDurationSec !== null &&
    probeDurationSec !== undefined &&
    Number.isFinite(probeDurationSec) &&
    probeDurationSec > 0
  ) {
    return probeDurationSec
  }
  return 0
}

function buildEncodeArgs(
  inputPath: string,
  outputPath: string,
  trim: MediaExportTrimPayload | undefined,
  applyTrim: boolean,
  encodePreset: FfmpegExportEncodePresetId
): string[] {
  const enc = resolveExportEncodeParams(encodePreset)
  const args = ['-y', '-hide_banner', '-loglevel', 'info', '-stats']
  if (applyTrim && trim) {
    args.push('-ss', String(trim.inSec), '-i', inputPath, '-t', String(trim.outSec - trim.inSec))
  } else {
    args.push('-i', inputPath)
  }
  args.push(
    '-c:v',
    'libx264',
    '-preset',
    enc.x264preset,
    '-crf',
    enc.crf,
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-b:a',
    '192k',
    '-movflags',
    '+faststart',
    outputPath
  )
  return args
}

/**
 * Один проход ffmpeg без shell: только массив аргументов §7 / §21.
 * Прогресс — по полю `time=` в stderr относительно длительности сегмента
 * и множитель `speed=` для статусбара §7.1. Строки режутся по `\r` и `\n`: ffmpeg
 * переписывает кадр статистики через carriage return.
 */
export function runFfmpegExportJob(params: {
  ffmpegPath: string
  inputPath: string
  outputPath: string
  trim?: MediaExportTrimPayload
  probeDurationSec?: number | null
  encodePreset?: FfmpegExportEncodePresetId
  signal: AbortSignal
  onProgress?: (p: FfmpegExportProgressPayload) => void
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const applyTrim = shouldApplyTrim(params.trim, params.probeDurationSec)
  const encodePreset = params.encodePreset ?? 'balance'
  const segmentDur = resolveExportSegmentDurationSec(
    params.trim,
    applyTrim,
    params.probeDurationSec
  )
  const args = buildEncodeArgs(
    params.inputPath,
    params.outputPath,
    params.trim,
    applyTrim,
    encodePreset
  )

  return new Promise((resolve) => {
    const child = spawn(params.ffmpegPath, args, {
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe'],
      signal: params.signal
    })

    let stderrTail = ''
    let lastSpeed: string | null = null

    function emitLine(line: string): void {
      const trimmed = line.trimEnd()
      if (trimmed.length === 0) {
        return
      }
      const spd = parseFfmpegSpeedToken(trimmed)
      if (spd !== null) {
        lastSpeed = spd
      }
      const t = parseFfmpegTimeSeconds(trimmed)
      let pct = -1
      if (t !== null && segmentDur > 0.05) {
        pct = Math.min(99.9, Math.max(0, (t / segmentDur) * 100))
      }
      const msg = trimmed.length > 140 ? `${trimmed.slice(0, 138)}…` : trimmed
      params.onProgress?.({
        percent: pct,
        message: msg,
        ...(lastSpeed !== null ? { speed: lastSpeed } : {})
      })
    }

    child.stderr?.setEncoding('utf8')
    child.stderr?.on('data', (chunk: string) => {
      stderrTail += chunk
      const parts = stderrTail.split(/\r|\n/)
      stderrTail = parts.pop() ?? ''
      for (const part of parts) {
        const t = part.trimEnd()
        if (t.length > 0) {
          emitLine(t)
        }
      }
    })

    child.on('error', (err) => {
      if (params.signal.aborted || err.name === 'AbortError') {
        resolve({ ok: false, error: 'Экспорт отменён' })
        return
      }
      resolve({ ok: false, error: err.message })
    })

    child.on('close', (code) => {
      if (params.signal.aborted) {
        resolve({ ok: false, error: 'Экспорт отменён' })
        return
      }
      if (code === 0) {
        resolve({ ok: true })
      } else {
        resolve({
          ok: false,
          error: `ffmpeg завершился с кодом ${code ?? '?'}`
        })
      }
    })
  })
}
