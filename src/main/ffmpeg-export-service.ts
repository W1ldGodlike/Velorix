import { spawn } from 'child_process'

import type {
  FfmpegExportAudioModeId,
  FfmpegExportContainerId,
  FfmpegExportEncodePresetId,
  FfmpegExportProgressPayload,
  FfmpegExportScalePresetId,
  MediaExportTrimPayload
} from '../shared/ffmpeg-export-contract'

import { logExternalProcessLine } from './external-process-log'

export type {
  FfmpegExportAudioModeId,
  FfmpegExportContainerId,
  FfmpegExportEncodePresetId,
  FfmpegExportProgressPayload,
  FfmpegExportScalePresetId,
  MediaExportRequestPayload,
  MediaExportStartResult,
  MediaExportTrimPayload
} from '../shared/ffmpeg-export-contract'

export function parseFfmpegExportEncodePreset(raw: unknown): FfmpegExportEncodePresetId {
  if (raw === 'balance' || raw === 'smaller' || raw === 'quality') {
    return raw
  }
  return 'balance'
}

export function parseFfmpegExportContainer(raw: unknown): FfmpegExportContainerId {
  if (raw === 'mkv' || raw === 'mov' || raw === 'mp4') {
    return raw
  }
  return 'mp4'
}

export function inferFfmpegExportContainerFromPath(path: string): FfmpegExportContainerId {
  const lower = path.trim().toLowerCase()
  if (lower.endsWith('.mkv')) {
    return 'mkv'
  }
  if (lower.endsWith('.mov')) {
    return 'mov'
  }
  return 'mp4'
}

export function ensureFfmpegExportExtension(
  path: string,
  fallback: FfmpegExportContainerId
): string {
  const trimmed = path.trim()
  if (/\.(mp4|mkv|mov)$/i.test(trimmed)) {
    return trimmed
  }
  return `${trimmed}.${parseFfmpegExportContainer(fallback)}`
}

export function parseFfmpegExportCrf(raw: unknown): number | null {
  const n =
    typeof raw === 'number'
      ? raw
      : typeof raw === 'string' && raw.trim() !== ''
        ? Number(raw.trim())
        : NaN
  if (!Number.isInteger(n) || n < 0 || n > 51) {
    return null
  }
  return n
}

export function parseFfmpegExportAudioBitrate(raw: unknown): string | null {
  if (typeof raw !== 'string') {
    return null
  }
  const t = raw.trim().toLowerCase()
  if (!/^\d{2,3}k$/.test(t)) {
    return null
  }
  const kbps = Number(t.slice(0, -1))
  if (!Number.isInteger(kbps) || kbps < 32 || kbps > 512) {
    return null
  }
  return `${kbps}k`
}

export function parseFfmpegExportAudioMode(raw: unknown): FfmpegExportAudioModeId {
  if (raw === 'none') {
    return 'none'
  }
  return 'aac'
}

export function parseFfmpegExportVideoBitrate(raw: unknown): string | null {
  if (typeof raw !== 'string') {
    return null
  }
  const t = raw.trim().toLowerCase()
  if (!/^\d{3,5}k$/.test(t)) {
    return null
  }
  const kbps = Number(t.slice(0, -1))
  if (!Number.isInteger(kbps) || kbps < 300 || kbps > 50000) {
    return null
  }
  return `${kbps}k`
}

export function parseFfmpegExportFps(raw: unknown): number | null {
  const n =
    typeof raw === 'number'
      ? raw
      : typeof raw === 'string' && raw.trim() !== ''
        ? Number(raw.trim())
        : NaN
  if (![24, 25, 30, 50, 60].includes(n)) {
    return null
  }
  return n
}

export function parseFfmpegExportScalePreset(raw: unknown): FfmpegExportScalePresetId {
  if (raw === '480p' || raw === '720p' || raw === '1080p') {
    return raw
  }
  return 'source'
}

function scaleFilterForPreset(preset: FfmpegExportScalePresetId): string | null {
  switch (preset) {
    case '480p':
      return 'scale=-2:480'
    case '720p':
      return 'scale=-2:720'
    case '1080p':
      return 'scale=-2:1080'
    default:
      return null
  }
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
  encodePreset: FfmpegExportEncodePresetId,
  crfOverride: number | null,
  videoBitrate: string | null,
  audioMode: FfmpegExportAudioModeId,
  audioBitrate: string,
  fps: number | null,
  scalePreset: FfmpegExportScalePresetId
): string[] {
  const enc = resolveExportEncodeParams(encodePreset)
  const crf = crfOverride === null ? enc.crf : String(crfOverride)
  const filters: string[] = []
  const scale = scaleFilterForPreset(scalePreset)
  if (scale !== null) {
    filters.push(scale)
  }
  if (fps !== null) {
    filters.push(`fps=${fps}`)
  }
  const args = ['-y', '-hide_banner', '-loglevel', 'info', '-stats']
  if (applyTrim && trim) {
    args.push('-ss', String(trim.inSec), '-i', inputPath, '-t', String(trim.outSec - trim.inSec))
  } else {
    args.push('-i', inputPath)
  }
  args.push('-c:v', 'libx264', '-preset', enc.x264preset)
  if (videoBitrate === null) {
    args.push('-crf', crf)
  } else {
    args.push('-b:v', videoBitrate)
  }
  args.push('-pix_fmt', 'yuv420p')
  if (filters.length > 0) {
    args.push('-vf', filters.join(','))
  }
  if (audioMode === 'none') {
    args.push('-an')
  } else {
    args.push('-c:a', 'aac', '-b:a', audioBitrate)
  }
  args.push('-movflags', '+faststart', outputPath)
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
  crf?: number | null
  videoBitrate?: string | null
  audioMode?: FfmpegExportAudioModeId | null
  audioBitrate?: string | null
  fps?: number | null
  scalePreset?: FfmpegExportScalePresetId | null
  signal: AbortSignal
  onProgress?: (p: FfmpegExportProgressPayload) => void
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const applyTrim = shouldApplyTrim(params.trim, params.probeDurationSec)
  const encodePreset = params.encodePreset ?? 'balance'
  const crf = parseFfmpegExportCrf(params.crf)
  const videoBitrate = parseFfmpegExportVideoBitrate(params.videoBitrate)
  const audioMode = parseFfmpegExportAudioMode(params.audioMode)
  const audioBitrate = parseFfmpegExportAudioBitrate(params.audioBitrate) ?? '192k'
  const fps = parseFfmpegExportFps(params.fps)
  const scalePreset = parseFfmpegExportScalePreset(params.scalePreset)
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
    encodePreset,
    crf,
    videoBitrate,
    audioMode,
    audioBitrate,
    fps,
    scalePreset
  )

  return new Promise((resolve) => {
    const child = spawn(params.ffmpegPath, args, {
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe'],
      signal: params.signal
    })
    logExternalProcessLine('ffmpeg-export', 'lifecycle', 'started')

    let stderrTail = ''
    let lastSpeed: string | null = null

    function emitLine(line: string): void {
      const trimmed = line.trimEnd()
      if (trimmed.length === 0) {
        return
      }
      logExternalProcessLine('ffmpeg-export', 'stderr', trimmed)
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
      logExternalProcessLine('ffmpeg-export', 'lifecycle', `error ${err.message}`)
      if (params.signal.aborted || err.name === 'AbortError') {
        resolve({ ok: false, error: 'Экспорт отменён' })
        return
      }
      resolve({ ok: false, error: err.message })
    })

    child.on('close', (code) => {
      logExternalProcessLine('ffmpeg-export', 'lifecycle', `closed exitCode=${code ?? '?'}`)
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
