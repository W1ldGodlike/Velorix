/** §7.5 — превью-спрайт из видео (один файл, сетка кадров). */

import type { AppUiLocale } from './app-ui-locale'
import type { FfmpegSnapshotFormatId } from './ffmpeg-snapshot-contract'

export const FFMPEG_VIDEO_SPRITE_MAX_COLUMNS = 20
export const FFMPEG_VIDEO_SPRITE_MAX_ROWS = 20
export const FFMPEG_VIDEO_SPRITE_MAX_CELLS = 200
export const FFMPEG_VIDEO_SPRITE_CELL_WIDTH_PX = 320

export type FfmpegVideoSpriteRequestPayload = {
  inputPath: string
  durationSec: number
  columns: number
  rows: number
  format: FfmpegSnapshotFormatId
  /** Подпись PTS (hms) в углу каждого кадра до tile. */
  burnTimestamps?: boolean
  uiLocale?: AppUiLocale
}

export type FfmpegVideoSpriteResult =
  | { ok: true; outputPath: string }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }
