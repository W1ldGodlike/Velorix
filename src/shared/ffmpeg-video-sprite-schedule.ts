import {
  FFMPEG_VIDEO_SPRITE_MAX_CELLS,
  FFMPEG_VIDEO_SPRITE_MAX_COLUMNS,
  FFMPEG_VIDEO_SPRITE_MAX_ROWS
} from './ffmpeg-video-sprite-contract'

export type FfmpegVideoSpriteSchedule =
  | {
      ok: true
      columns: number
      rows: number
      cellCount: number
      sampleFps: number
    }
  | { ok: false; error: 'duration_too_short' | 'invalid_grid' | 'too_many_cells' }

export function resolveFfmpegVideoSpriteSchedule(params: {
  durationSec: number
  columns: number
  rows: number
}): FfmpegVideoSpriteSchedule {
  const duration = Number.isFinite(params.durationSec) ? Math.max(0, params.durationSec) : 0
  if (duration < 0.05) {
    return { ok: false, error: 'duration_too_short' }
  }

  const columns = Math.floor(params.columns)
  const rows = Math.floor(params.rows)
  if (
    columns < 1 ||
    rows < 1 ||
    columns > FFMPEG_VIDEO_SPRITE_MAX_COLUMNS ||
    rows > FFMPEG_VIDEO_SPRITE_MAX_ROWS
  ) {
    return { ok: false, error: 'invalid_grid' }
  }

  const cellCount = columns * rows
  if (cellCount > FFMPEG_VIDEO_SPRITE_MAX_CELLS) {
    return { ok: false, error: 'too_many_cells' }
  }

  const sampleFps = cellCount / duration
  return { ok: true, columns, rows, cellCount, sampleFps }
}
