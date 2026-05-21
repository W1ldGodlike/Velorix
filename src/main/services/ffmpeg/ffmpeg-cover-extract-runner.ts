import { buildFfmpegCoverExtractArgv } from '../../../shared/ffmpeg-cover-extract-argv'
import type { FfmpegCoverExtractResult } from '../../../shared/ffmpeg-cover-extract-contract'
import { resolveFfprobeCoverStreamIndex } from '../../../shared/ffprobe-cover-stream-resolve'
import { runFfmpegCommand } from './ffmpeg-command-runner'
import { runFfprobeJson } from '../ffprobe/ffprobe-probe-json'

export async function runFfmpegCoverExtract(params: {
  ffprobePath: string
  ffmpegPath: string
  inputPath: string
  outputPath: string
}): Promise<FfmpegCoverExtractResult> {
  let rawJson: string
  try {
    rawJson = await runFfprobeJson(params.ffprobePath, params.inputPath)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
  let streams: unknown
  try {
    const parsed = JSON.parse(rawJson) as { streams?: unknown }
    streams = parsed.streams
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
  const streamIndex = resolveFfprobeCoverStreamIndex(streams)
  if (streamIndex === null) {
    return { ok: false, noCover: true }
  }
  const args = buildFfmpegCoverExtractArgv(params.inputPath, streamIndex, params.outputPath)
  const result = await runFfmpegCommand({
    ffmpegPath: params.ffmpegPath,
    args,
    logTag: 'ffmpeg-cover-extract'
  })
  if (result.ok) {
    return { ok: true, outputPath: params.outputPath }
  }
  return { ok: false, error: result.error }
}
