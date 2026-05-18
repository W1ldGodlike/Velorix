import { spawn } from 'child_process'

import type { AppUiLocale } from '../shared/app-ui-locale'
import {
  FFMPEG_EXPORT_CANCELLED_ERROR,
  type FfmpegExportProgressPayload,
  type MediaExportTrimPayload
} from '../shared/ffmpeg-export-contract'
import { getMainApplicationStrings } from '../shared/main-application-locale'
import {
  parseFfmpegSpeedToken,
  parseFfmpegTimeSeconds
} from '../shared/ffmpeg-export-progress-parse'
import { logExternalProcessLine } from './external-process-log'
import { appendProcessStreamBuffer } from './process-stream-buffer'

/**
 * §7.1 — показывать в статусбаре только строки статистики `-stats` или явные ошибки;
 * отфильтровываем баннер версии, конфиг-декларации и прочий шум без `time=`/`frame=`.
 */
export function isFfmpegExportProgressStatusLine(line: string): boolean {
  const t = line.trim()
  if (t.length === 0) {
    return false
  }
  if (/\[(?:error|fatal)\]/i.test(t)) {
    return true
  }
  if (/\berror while\b|\bfailed to\b|\binvalid\b|\bcannot\b/i.test(t)) {
    return true
  }
  return /\b(?:frame=\s*\d|fps=\s*[\d.]+|L?size=\s*|time=\s*\d|bitrate=\s*|speed=\s*[\d.N/A]+)/i.test(
    t
  )
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
 * Один запуск ffmpeg без shell: только массив аргументов §7 / §21.
 * Прогресс — по `time=` в stderr; `mapPercent` масштабирует процент для двухпроходного режима.
 */
export function runFfmpegExportOnce(params: {
  ffmpegPath: string
  args: string[]
  signal: AbortSignal
  segmentDur: number
  onProgress?: (p: FfmpegExportProgressPayload) => void
  mapPercent?: (rawPercent: number) => number
  uiLocale?: AppUiLocale
  /** §16 — режим экономии: снизить приоритет процесса ffmpeg. */
  lowProcessPriority?: boolean
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const locStrings = getMainApplicationStrings(params.uiLocale ?? 'ru')
  return new Promise((resolve) => {
    const child = spawn(params.ffmpegPath, params.args, {
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe'],
      signal: params.signal,
      ...(params.lowProcessPriority === true ? { priority: 'belowNormal' as const } : {})
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
      if (!isFfmpegExportProgressStatusLine(trimmed)) {
        return
      }
      const t = parseFfmpegTimeSeconds(trimmed)
      let pct = -1
      if (t !== null && params.segmentDur > 0.05) {
        pct = Math.min(99.9, Math.max(0, (t / params.segmentDur) * 100))
      }
      const msg = trimmed.length > 140 ? `${trimmed.slice(0, 138)}…` : trimmed
      const outPct = pct >= 0 && params.mapPercent !== undefined ? params.mapPercent(pct) : pct
      params.onProgress?.({
        percent: outPct,
        message: msg,
        ...(lastSpeed !== null ? { speed: lastSpeed } : {})
      })
    }

    child.stderr?.setEncoding('utf8')
    child.stderr?.on('data', (chunk: string) => {
      stderrTail = appendProcessStreamBuffer(stderrTail, chunk)
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
        resolve({ ok: false, error: FFMPEG_EXPORT_CANCELLED_ERROR })
        return
      }
      resolve({ ok: false, error: err.message })
    })

    child.on('close', (code) => {
      logExternalProcessLine('ffmpeg-export', 'lifecycle', `closed exitCode=${code ?? '?'}`)
      if (stderrTail.trim().length > 0) {
        emitLine(stderrTail)
        stderrTail = ''
      }
      if (params.signal.aborted) {
        resolve({ ok: false, error: FFMPEG_EXPORT_CANCELLED_ERROR })
        return
      }
      if (code === 0) {
        resolve({ ok: true })
      } else {
        resolve({
          ok: false,
          error: locStrings.exportFfmpegExitedWithCode.replace(
            '{code}',
            code === null || code === undefined ? '?' : String(code)
          )
        })
      }
    })
  })
}
