import { parseAppUiLocale } from './app-ui-locale'
import type { FfmpegFramesExtractRequestPayload } from './ffmpeg-frames-extract-contract'
import { parseFfmpegSnapshotFormatId } from './ffmpeg-snapshot-format-parse'

export function parseFfmpegFramesExtractRequest(
  raw: unknown
): { ok: true; payload: FfmpegFramesExtractRequestPayload } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'invalid_request' }
  }
  const o = raw as {
    inputPath?: unknown
    durationSec?: unknown
    mode?: unknown
    intervalSec?: unknown
    frameCount?: unknown
    manualTimesSec?: unknown
    format?: unknown
    uiLocale?: unknown
  }
  const inputPath = typeof o.inputPath === 'string' ? o.inputPath.trim() : ''
  if (inputPath.length === 0) {
    return { ok: false, error: 'input_missing' }
  }
  const durationSec =
    typeof o.durationSec === 'number' && Number.isFinite(o.durationSec) ? o.durationSec : 0
  const mode =
    o.mode === 'interval' || o.mode === 'count' || o.mode === 'manual' ? o.mode : null
  if (mode === null) {
    return { ok: false, error: 'invalid_mode' }
  }
  const intervalSec =
    o.intervalSec === null || o.intervalSec === undefined
      ? null
      : typeof o.intervalSec === 'number' && Number.isFinite(o.intervalSec)
        ? o.intervalSec
        : null
  const frameCount =
    o.frameCount === null || o.frameCount === undefined
      ? null
      : typeof o.frameCount === 'number' && Number.isFinite(o.frameCount)
        ? o.frameCount
        : null
  let manualTimesSec: number[] | null = null
  if (mode === 'manual') {
    if (!Array.isArray(o.manualTimesSec) || o.manualTimesSec.length === 0) {
      return { ok: false, error: 'invalid_manual' }
    }
    const parsed: number[] = []
    for (const item of o.manualTimesSec) {
      if (typeof item === 'number' && Number.isFinite(item) && item >= 0) {
        parsed.push(item)
      }
    }
    if (parsed.length === 0) {
      return { ok: false, error: 'invalid_manual' }
    }
    manualTimesSec = parsed
  }
  const uiLoc = parseAppUiLocale(o.uiLocale)
  const payload: FfmpegFramesExtractRequestPayload = {
    inputPath,
    durationSec,
    mode,
    intervalSec,
    frameCount,
    manualTimesSec,
    format: parseFfmpegSnapshotFormatId(o.format),
    ...(uiLoc !== undefined ? { uiLocale: uiLoc } : {})
  }
  return { ok: true, payload }
}
