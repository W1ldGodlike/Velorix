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
  if (format === 'bmp' || format === 'tiff') {
    return ['-y', outputPath]
  }
  return ['-y', outputPath]
}

/** Цепочка -vf: fps → optional drawtext → scale → tile. */
export function buildFfmpegVideoSpriteVideoFilter(params: {
  sampleFps: number
  columns: number
  rows: number
  burnTimestamps: boolean
}): string {
  const fps = params.sampleFps.toFixed(6).replace(/\.?0+$/, '')
  const parts = [`fps=${fps}`]
  if (params.burnTimestamps) {
    parts.push(
      "drawtext=text='%{pts\\:hms}':fontsize=14:fontcolor=white:box=1:boxcolor=black@0.5:x=4:y=h-th-6"
    )
  }
  parts.push(
    `scale=${FFMPEG_VIDEO_SPRITE_CELL_WIDTH_PX}:-2:flags=lanczos`,
    `tile=${params.columns}x${params.rows}`
  )
  return parts.join(',')
}

/** §7.5 — один выходной файл: fps + scale + tile (равномерная выборка по длительности). */
export function buildFfmpegVideoSpriteArgv(params: {
  inputPath: string
  outputPath: string
  request: Pick<
    FfmpegVideoSpriteRequestPayload,
    'durationSec' | 'columns' | 'rows' | 'format' | 'burnTimestamps'
  >
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

  const vf = buildFfmpegVideoSpriteVideoFilter({
    sampleFps: schedule.sampleFps,
    columns: schedule.columns,
    rows: schedule.rows,
    burnTimestamps: params.request.burnTimestamps === true
  })
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
