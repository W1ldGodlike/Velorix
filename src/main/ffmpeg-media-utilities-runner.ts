import { buildFfmpegConvertImageArgv } from '../shared/ffmpeg-image-convert-argv'
import { buildFfmpegGenerateNoiseArgv } from '../shared/ffmpeg-noise-generate-argv'
import {
  buildFfmpegIntegrityCheckArgv,
  buildFfmpegRepairRemuxArgv,
  summarizeFfmpegIntegrityStderr
} from '../shared/ffmpeg-media-utilities-argv'
import type {
  MediaUtilitiesConvertImageResult,
  MediaUtilitiesGenerateNoiseResult,
  MediaUtilitiesImageFormatId,
  MediaUtilitiesIntegrityResult,
  MediaUtilitiesNoiseKind,
  MediaUtilitiesRepairResult
} from '../shared/media-utilities-contract'
import { runFfmpegCommand } from './ffmpeg-command-runner'

export async function runFfmpegRepairRemux(params: {
  ffmpegPath: string
  inputPath: string
  outputPath: string
}): Promise<MediaUtilitiesRepairResult> {
  const args = buildFfmpegRepairRemuxArgv(params.inputPath, params.outputPath)
  const result = await runFfmpegCommand({
    ffmpegPath: params.ffmpegPath,
    args,
    logTag: 'ffmpeg-repair-remux'
  })
  if (result.ok) {
    return { ok: true, outputPath: params.outputPath }
  }
  return { ok: false, error: result.error }
}

export async function runFfmpegIntegrityCheck(params: {
  ffmpegPath: string
  inputPath: string
}): Promise<MediaUtilitiesIntegrityResult> {
  const args = buildFfmpegIntegrityCheckArgv(params.inputPath)
  const result = await runFfmpegCommand({
    ffmpegPath: params.ffmpegPath,
    args,
    logTag: 'ffmpeg-integrity-check'
  })
  if (result.ok) {
    const summary = summarizeFfmpegIntegrityStderr(result.stderr)
    if (summary.clean) {
      return { ok: true, clean: true }
    }
    return { ok: true, clean: false, detail: summary.detail }
  }
  const summary = summarizeFfmpegIntegrityStderr(
    result.stderr.length > 0 ? result.stderr : result.error
  )
  if (summary.detail.length > 0) {
    return { ok: true, clean: false, detail: summary.detail }
  }
  return { ok: false, error: result.error }
}

export async function runFfmpegGenerateNoise(params: {
  ffmpegPath: string
  kind: MediaUtilitiesNoiseKind
  durationSec: number
  outputPath: string
}): Promise<MediaUtilitiesGenerateNoiseResult> {
  const args = buildFfmpegGenerateNoiseArgv(params.kind, params.durationSec, params.outputPath)
  const result = await runFfmpegCommand({
    ffmpegPath: params.ffmpegPath,
    args,
    logTag: 'ffmpeg-generate-noise'
  })
  if (result.ok) {
    return { ok: true, outputPath: params.outputPath }
  }
  return { ok: false, error: result.error }
}

export async function runFfmpegConvertImage(params: {
  ffmpegPath: string
  inputPath: string
  outputPath: string
  targetFormat: MediaUtilitiesImageFormatId
}): Promise<MediaUtilitiesConvertImageResult> {
  const args = buildFfmpegConvertImageArgv(params.inputPath, params.outputPath, params.targetFormat)
  const result = await runFfmpegCommand({
    ffmpegPath: params.ffmpegPath,
    args,
    logTag: 'ffmpeg-convert-image'
  })
  if (result.ok) {
    return { ok: true, outputPath: params.outputPath }
  }
  return { ok: false, error: result.error }
}
