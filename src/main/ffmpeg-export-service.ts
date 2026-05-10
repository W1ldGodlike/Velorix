import { spawn } from 'child_process'

import type { AppSettings } from '../shared/settings-contract'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportContainerId,
  FfmpegExportEncodePresetId,
  FfmpegExportProgressPayload,
  FfmpegExportScalePresetId,
  FfmpegExportUserPreset,
  FfmpegExportUserPresetSnapshot,
  MediaExportTrimPayload
} from '../shared/ffmpeg-export-contract'
import { buildFfmpegExportArgv, shouldApplyFfmpegExportTrim } from '../shared/ffmpeg-export-argv'

import { logExternalProcessLine } from './external-process-log'

export type {
  FfmpegExportAudioModeId,
  FfmpegExportContainerId,
  FfmpegExportEncodePresetId,
  FfmpegExportProgressPayload,
  FfmpegExportScalePresetId,
  FfmpegExportUserPreset,
  FfmpegExportUserPresetSnapshot,
  MediaExportRequestPayload,
  MediaExportStartResult,
  MediaExportTrimPayload
} from '../shared/ffmpeg-export-contract'

export {
  buildFfmpegExportArgv,
  buildFfmpegExportPreviewCommand,
  formatFfmpegArgvForPreview,
  resolveFfmpegExportEncodeParams as resolveExportEncodeParams,
  resolveFfmpegExportScaleFilter,
  shouldApplyFfmpegExportTrim
} from '../shared/ffmpeg-export-argv'

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

/** §7.2 — разбор снимка пользовательского пресета из IPC/renderer (белые списки). */
export function parseFfmpegExportUserPresetSnapshot(
  raw: unknown
): FfmpegExportUserPresetSnapshot | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const o = raw as Record<string, unknown>
  const encodePreset = parseFfmpegExportEncodePreset(o['encodePreset'])
  const container = parseFfmpegExportContainer(o['container'])
  const crf = parseFfmpegExportCrf(o['crf'])
  const videoBitrate = parseFfmpegExportVideoBitrate(o['videoBitrate'])
  const audioMode = parseFfmpegExportAudioMode(o['audioMode'])
  const audioBitrate = parseFfmpegExportAudioBitrate(o['audioBitrate']) ?? '192k'
  const fps = parseFfmpegExportFps(o['fps'])
  const scalePreset = parseFfmpegExportScalePreset(o['scalePreset'])
  return {
    encodePreset,
    container,
    crf,
    videoBitrate,
    audioMode,
    audioBitrate,
    fps,
    scalePreset
  }
}

/**
 * §7.2 — список пользовательских пресетов для `settings.json` (не более 8 записей).
 */
export function parseFfmpegExportUserPresetsList(raw: unknown): FfmpegExportUserPreset[] {
  if (!Array.isArray(raw)) {
    return []
  }
  const out: FfmpegExportUserPreset[] = []
  for (const item of raw.slice(0, 8)) {
    if (!item || typeof item !== 'object') {
      continue
    }
    const o = item as Record<string, unknown>
    const idRaw = o['id']
    const id =
      typeof idRaw === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(idRaw.trim()) ? idRaw.trim() : null
    const labelRaw = o['label']
    const label =
      typeof labelRaw === 'string' && labelRaw.trim().length > 0
        ? labelRaw.trim().slice(0, 64)
        : null
    const snap = parseFfmpegExportUserPresetSnapshot(o['snapshot'])
    if (!id || !label || !snap) {
      continue
    }
    out.push({ id, label, snapshot: snap })
  }
  return out
}

/**
 * §7.2 — записать снимок в сериализуемые поля `AppSettings` (те же правила delete при «по умолчанию», что и точечные IPC).
 */
export function mergeFfmpegExportSnapshotIntoAppSettings(
  base: AppSettings,
  snapshot: FfmpegExportUserPresetSnapshot
): AppSettings {
  const next: AppSettings = { ...base }
  next.ffmpegExportEncodePreset = snapshot.encodePreset
  next.ffmpegExportContainer = snapshot.container
  if (snapshot.crf === null) {
    delete next.ffmpegExportCrf
  } else {
    next.ffmpegExportCrf = snapshot.crf
  }
  if (snapshot.videoBitrate === null) {
    delete next.ffmpegExportVideoBitrate
  } else {
    next.ffmpegExportVideoBitrate = snapshot.videoBitrate
  }
  next.ffmpegExportAudioBitrate = snapshot.audioBitrate
  if (snapshot.audioMode === 'aac') {
    delete next.ffmpegExportAudioMode
  } else {
    next.ffmpegExportAudioMode = 'none'
  }
  if (snapshot.fps === null) {
    delete next.ffmpegExportFps
  } else {
    next.ffmpegExportFps = snapshot.fps
  }
  if (snapshot.scalePreset === 'source') {
    delete next.ffmpegExportScalePreset
  } else {
    next.ffmpegExportScalePreset = snapshot.scalePreset
  }
  return next
}

/** Поле `speed=` в строках прогресса ffmpeg (`-stats`). */
export function parseFfmpegSpeedToken(line: string): string | null {
  const m = line.match(/\bspeed=\s*(\S+)/)
  const token = m?.[1]
  return token !== undefined ? token : null
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
  /** Контейнер сохранения §7.2 — влияет на хвост argv (MKV без `-movflags`). */
  container?: FfmpegExportContainerId | null
  crf?: number | null
  videoBitrate?: string | null
  audioMode?: FfmpegExportAudioModeId | null
  audioBitrate?: string | null
  fps?: number | null
  scalePreset?: FfmpegExportScalePresetId | null
  signal: AbortSignal
  onProgress?: (p: FfmpegExportProgressPayload) => void
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const applyTrim = shouldApplyFfmpegExportTrim(params.trim ?? null, params.probeDurationSec)
  const encodePreset = params.encodePreset ?? 'balance'
  const crf = parseFfmpegExportCrf(params.crf)
  const videoBitrate = parseFfmpegExportVideoBitrate(params.videoBitrate)
  const audioMode = parseFfmpegExportAudioMode(params.audioMode)
  const audioBitrate = parseFfmpegExportAudioBitrate(params.audioBitrate) ?? '192k'
  const fps = parseFfmpegExportFps(params.fps)
  const scalePreset = parseFfmpegExportScalePreset(params.scalePreset)
  const container = parseFfmpegExportContainer(params.container ?? 'mp4')
  const segmentDur = resolveExportSegmentDurationSec(
    params.trim,
    applyTrim,
    params.probeDurationSec
  )
  const args = buildFfmpegExportArgv({
    inputPath: params.inputPath,
    outputPath: params.outputPath,
    container,
    ...(params.trim !== undefined ? { trim: params.trim } : {}),
    applyTrim,
    encodePreset,
    crf,
    videoBitrate,
    audioMode,
    audioBitrate,
    fps,
    scalePreset
  })

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
