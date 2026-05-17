/**
 * §7.2 — чистая сборка argv ffmpeg-экспорта без shell-строк и Node-зависимостей.
 */

export type { FfmpegExportArgvParams } from './ffmpeg-export-argv-build-types'
export {
  appendFfmpegHwEncoderRateArgs,
  resolveFfmpegExportEncodeParams
} from './ffmpeg-export-argv-build-encode'

import { appendFfmpegHwaccelBeforeInput } from './ffmpeg-export-hw-decode'
import { appendFfmpegExportCodecAudioAndOutput } from './ffmpeg-export-argv-build-codec-audio'
import { resolveFfmpegExportEncodeParams } from './ffmpeg-export-argv-build-encode'
import { buildFfmpegExportVideoFilterChain } from './ffmpeg-export-argv-build-vf-chain'
import type { FfmpegExportArgvParams } from './ffmpeg-export-argv-build-types'
import type { FfmpegExportContainerId } from './ffmpeg-export-contract'

export function buildFfmpegExportArgv(params: FfmpegExportArgvParams): string[] {
  const container: FfmpegExportContainerId = params.container ?? 'mp4'
  const enc = resolveFfmpegExportEncodeParams(params.encodePreset)
  const crf = params.crf === null ? enc.crf : String(params.crf)
  const filters = buildFfmpegExportVideoFilterChain(params)
  const args = ['-y', '-hide_banner', '-loglevel', 'info', '-stats']
  if (params.economyMode === true) {
    args.push('-threads', '1')
  }
  appendFfmpegHwaccelBeforeInput(args, params.hwaccelDecode ?? null)
  if (params.applyTrim && params.trim) {
    args.push(
      '-ss',
      String(params.trim.inSec),
      '-i',
      params.inputPath,
      '-t',
      String(params.trim.outSec - params.trim.inSec)
    )
  } else {
    args.push('-i', params.inputPath)
  }
  if (params.stripMetadata === true) {
    args.push('-map_metadata', '-1')
  }
  if (params.stripChapters === true) {
    args.push('-map_chapters', '-1')
  }
  return appendFfmpegExportCodecAudioAndOutput(args, params, filters, enc, crf, container)
}
