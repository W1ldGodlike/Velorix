import {
  FFMPEG_VIDEO_SPRITE_CELL_WIDTH_PX,
  type FfmpegVideoSpriteRequestPayload
} from './ffmpeg-video-sprite-contract'
import type { FfmpegSnapshotFormatId } from './ffmpeg-snapshot-contract'
import {
  resolveFfmpegVideoSpriteSchedule,
  type FfmpegVideoSpriteSchedule
} from './ffmpeg-video-sprite-schedule'

function snapshotEncodeTail(format: FfmpegSnapshotFormatId, outputPath: string): string[] {
  if (format === 'jpg') {
    return ['-q:v', '2', '-y', outputPath]
  }
  if (format === 'webp') {
    return ['-c:v', 'libwebp', '-quality', '85', '-y', outputPath]
  }
  return ['-y', outputPath]
}

/** §7.5 — один выходной файл: fps + scale + tile (равномерная выборка по длительности). */
export function buildFfmpegVideoSpriteArgv(params: {
  inputPath: string
  outputPath: string
  request: Pick<FfmpegVideoSpriteRequestPayload, 'durationSec' | 'columns' | 'rows' | 'format'>
}):
  | { ok: true; argv: string[] }
  | { ok: false; error: Extract<FfmpegVideoSpriteSchedule, { ok: false }>['error'] } {
  const schedule = resolveFfmpegVideoSpriteSchedule({
    durationSec: params.request.durationSec,
    columns: params.request.columns,
    rows: params.request.rows
  })
  if (!schedule.ok) {
    return { ok: false, error: schedule.error }
  }

  const fps = schedule.sampleFps.toFixed(6).replace(/\.?0+$/, '')
  const vf = `fps=${fps},scale=${FFMPEG_VIDEO_SPRITE_CELL_WIDTH_PX}:-2:flags=lanczos,tile=${schedule.columns}x${schedule.rows}`
  const base = [
    '-hide_banner',
    '-loglevel',
    'error',
    '-i',
    params.inputPath,
    '-vf',
    vf,
    '-frames:v',
    '1',
    ...snapshotEncodeTail(params.request.format, params.outputPath)
  ]
  return { ok: true, argv: base }
}
