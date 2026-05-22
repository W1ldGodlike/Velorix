import type {
  FfmpegVideoSpriteRequestPayload,
  FfmpegVideoSpriteResult
} from '../../shared/ffmpeg-video-sprite-contract'
import { FFMPEG_VIDEO_SPRITE_MAX_CELLS } from '../../shared/ffmpeg-video-sprite-contract'
import type { FfmpegSnapshotFormatId } from '../../shared/ffmpeg-snapshot-contract'
import { getUiLocale, uiText, uiTextVars } from './locales/ui-text'

export function buildEditorVideoSpritePayload(params: {
  inputPath: string
  durationSec: number
  format: FfmpegSnapshotFormatId
  columnsText: string
  rowsText: string
  burnTimestamps: boolean
}): FfmpegVideoSpriteRequestPayload | null {
  const columns = Number.parseInt(params.columnsText, 10)
  const rows = Number.parseInt(params.rowsText, 10)
  if (!Number.isFinite(columns) || !Number.isFinite(rows) || columns < 1 || rows < 1) {
    return null
  }
  return {
    inputPath: params.inputPath,
    durationSec: params.durationSec,
    columns,
    rows,
    format: params.format,
    ...(params.burnTimestamps ? { burnTimestamps: true } : {}),
    uiLocale: getUiLocale()
  }
}

export function editorVideoSpriteScheduleErrorHint(code: string): string {
  switch (code) {
    case 'too_many_cells':
      return uiTextVars('editorVideoSpriteScheduleErrorTooManyCells', {
        max: String(FFMPEG_VIDEO_SPRITE_MAX_CELLS)
      })
    case 'invalid_grid':
      return uiText('editorVideoSpriteScheduleErrorInvalidGrid')
    case 'duration_too_short':
      return uiText('editorVideoSpriteScheduleErrorDuration')
    default:
      return uiTextVars('statusErrorWithDetail', { detail: code })
  }
}

export async function runEditorVideoSprite(params: {
  payload: FfmpegVideoSpriteRequestPayload
  setStatusHint: (hint: string | null) => void
}): Promise<{ ok: true } | { ok: false; cancelled?: boolean }> {
  const res: FfmpegVideoSpriteResult = await window.velorix.export.generateVideoSprite(
    params.payload
  )
  if (res.ok) {
    params.setStatusHint(
      uiTextVars('editorVideoSpriteDone', {
        path: res.outputPath
      })
    )
    return { ok: true }
  }
  if ('cancelled' in res && res.cancelled) {
    params.setStatusHint(null)
    return { ok: false, cancelled: true }
  }
  if ('error' in res) {
    params.setStatusHint(res.error)
  }
  return { ok: false }
}
