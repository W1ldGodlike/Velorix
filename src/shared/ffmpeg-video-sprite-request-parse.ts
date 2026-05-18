import { parseAppUiLocale } from './app-ui-locale'
import type { FfmpegVideoSpriteRequestPayload } from './ffmpeg-video-sprite-contract'
import { parseFfmpegSnapshotFormatId } from './ffmpeg-snapshot-format-parse'

export function parseFfmpegVideoSpriteRequest(
  raw: unknown
): { ok: true; payload: FfmpegVideoSpriteRequestPayload } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'invalid_request' }
  }
  const o = raw as {
    inputPath?: unknown
    durationSec?: unknown
    columns?: unknown
    rows?: unknown
    format?: unknown
    uiLocale?: unknown
  }
  const inputPath = typeof o.inputPath === 'string' ? o.inputPath.trim() : ''
  if (inputPath.length === 0) {
    return { ok: false, error: 'input_missing' }
  }
  const durationSec =
    typeof o.durationSec === 'number' && Number.isFinite(o.durationSec) ? o.durationSec : 0
  const columns =
    typeof o.columns === 'number' && Number.isFinite(o.columns) ? Math.floor(o.columns) : 0
  const rows = typeof o.rows === 'number' && Number.isFinite(o.rows) ? Math.floor(o.rows) : 0
  if (columns < 1 || rows < 1) {
    return { ok: false, error: 'invalid_grid' }
  }
  const uiLoc = parseAppUiLocale(o.uiLocale)
  const payload: FfmpegVideoSpriteRequestPayload = {
    inputPath,
    durationSec,
    columns,
    rows,
    format: parseFfmpegSnapshotFormatId(o.format),
    ...(uiLoc !== undefined ? { uiLocale: uiLoc } : {})
  }
  return { ok: true, payload }
}
