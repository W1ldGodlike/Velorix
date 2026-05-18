import { basename, join } from 'path'

import type {
  FfmpegFramesExtractProgressPayload,
  FfmpegFramesExtractRequestPayload,
  FfmpegFramesExtractResult
} from '../shared/ffmpeg-frames-extract-contract'
import type { FfmpegSnapshotFormatId } from '../shared/ffmpeg-snapshot-contract'
import { buildFfmpegFrameExtractTimestamps } from '../shared/ffmpeg-frames-extract-schedule'
import { runFfmpegSnapshotFrame } from './ffmpeg-frame-snapshot-service'

function snapshotFileExtension(format: FfmpegSnapshotFormatId): string {
  if (format === 'jpg') {
    return 'jpg'
  }
  if (format === 'webp') {
    return 'webp'
  }
  return 'png'
}

function formatExtractOutputPath(
  outputDir: string,
  stem: string,
  index: number,
  timeSec: number,
  ext: string
): string {
  const pad = String(index + 1).padStart(4, '0')
  const tMs = Math.round(timeSec * 1000)
  return join(outputDir, `${stem}_frame_${pad}_${tMs}ms.${ext}`)
}

export async function runFfmpegFramesExtract(params: {
  ffmpegPath: string
  outputDir: string
  request: FfmpegFramesExtractRequestPayload
  signal: AbortSignal
  onProgress: (p: FfmpegFramesExtractProgressPayload) => void
  mapScheduleError: (code: string) => string
}): Promise<FfmpegFramesExtractResult> {
  const schedule = buildFfmpegFrameExtractTimestamps({
    durationSec: params.request.durationSec,
    mode: params.request.mode,
    intervalSec: params.request.intervalSec,
    frameCount: params.request.frameCount,
    manualTimesSec: params.request.manualTimesSec
  })
  if (!schedule.ok) {
    return { ok: false, error: params.mapScheduleError(schedule.error) }
  }

  const stem = basename(params.request.inputPath).replace(/\.[^.]+$/, '')
  const ext = snapshotFileExtension(params.request.format)
  const times = schedule.times
  const savedPaths: string[] = []
  let failed = 0

  for (let index = 0; index < times.length; index += 1) {
    if (params.signal.aborted) {
      return { ok: false, cancelled: true }
    }
    const timeSec = times[index]!
    const outputPath = formatExtractOutputPath(params.outputDir, stem, index, timeSec, ext)
    params.onProgress({
      index: index + 1,
      total: times.length,
      timeSec,
      outputPath: null
    })
    const result = await runFfmpegSnapshotFrame({
      ffmpegPath: params.ffmpegPath,
      inputPath: params.request.inputPath,
      outputPath,
      timeSec
    })
    if (params.signal.aborted) {
      return { ok: false, cancelled: true }
    }
    if (result.ok) {
      savedPaths.push(outputPath)
      params.onProgress({
        index: index + 1,
        total: times.length,
        timeSec,
        outputPath
      })
    } else {
      failed += 1
    }
  }

  if (savedPaths.length === 0) {
    return { ok: false, error: 'all_frames_failed' }
  }

  return {
    ok: true,
    outputDir: params.outputDir,
    saved: savedPaths.length,
    failed,
    paths: savedPaths
  }
}
