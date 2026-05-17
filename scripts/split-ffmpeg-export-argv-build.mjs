import fs from 'node:fs'
import path from 'node:path'

const outDir = path.join('src/shared')
const lines = fs
  .readFileSync(path.join(outDir, 'ffmpeg-export-argv-build.ts'), 'utf8')
  .split(/\r?\n/)

const header = lines.slice(0, 65).join('\n')
const typesBlock = lines.slice(82, 164).join('\n')
const encodeBlock = lines.slice(66, 228).join('\n')
const vfBlock = lines
  .slice(235, 299)
  .join('\n')
  .replace(/^ {2}const filters: string\[\] = \[\]\n/, '')
  .replace(/^ {2}const transform/, '  const transform')
fs.writeFileSync(
  path.join(outDir, 'ffmpeg-export-argv-build-types.ts'),
  `${header
    .split('\n')
    .slice(8)
    .join('\n')
    .replace(/from '\.\/ffmpeg-export-argv-filters'[\s\S]*$/, '')}
${typesBlock}
`
)

// Fix types file imports - rewrite cleanly
const typesImports = `import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportVideoCodecId,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDeinterlaceId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoVignetteId,
  FfmpegExportVideoTransformId,
  MediaExportTrimPayload
} from './ffmpeg-export-contract'

`

fs.writeFileSync(
  path.join(outDir, 'ffmpeg-export-argv-build-types.ts'),
  `${typesImports}${typesBlock}\n`
)

fs.writeFileSync(
  path.join(outDir, 'ffmpeg-export-argv-build-encode.ts'),
  `import type { FfmpegExportEncodePresetId } from './ffmpeg-export-contract'
import type { FfmpegHwVideoEncoderId } from './ffmpeg-hw-encoder-probe'

${encodeBlock.replace(/^export function resolve/, 'export function resolve').replace(/^function append/, 'export function append')}
`
)

const vfImports = `import { buildFfmpegExportLut3dFilter } from './ffmpeg-export-argv-filters'
import {
  resolveFfmpegExportCropFilter,
  resolveFfmpegExportScaleFilter,
  resolveFfmpegExportVideoDebandFilter,
  resolveFfmpegExportVideoDeinterlaceFilter,
  resolveFfmpegExportVideoHisteqFilter,
  resolveFfmpegExportVideoDenoiseFilter,
  resolveFfmpegExportVideoEqFilter,
  resolveFfmpegExportVideoGrainFilter,
  resolveFfmpegExportVideoHueFilter,
  resolveFfmpegExportVideoBlurFilter,
  resolveFfmpegExportVideoSharpenFilter,
  resolveFfmpegExportVideoVignetteFilter,
  resolveFfmpegExportVideoTransformFilters
} from './ffmpeg-export-argv-filters'
import type { FfmpegExportArgvParams } from './ffmpeg-export-argv-build-types'

export function buildFfmpegExportVideoFilterChain(params: FfmpegExportArgvParams): string[] {
  const filters: string[] = []
${vfBlock
  .split('\n')
  .map((l) => (l.startsWith('  ') ? l : `  ${l}`))
  .join('\n')}
  return filters
}
`

fs.writeFileSync(path.join(outDir, 'ffmpeg-export-argv-build-vf-chain.ts'), vfImports)

// codec-audio: from line 324 (const vcodec) through 541 - but need to be a function
const codecAudioBody = lines.slice(323, 541).join('\n')

fs.writeFileSync(
  path.join(outDir, 'ffmpeg-export-argv-build-codec-audio.ts'),
  `import type { FfmpegExportContainerId, FfmpegExportVideoCodecId } from './ffmpeg-export-contract'
import { appendFfmpegExportExtraArgsToArgv } from './ffmpeg-export-extra-args'
import { prependHwEncoderUploadToVideoFilters } from './ffmpeg-export-vaapi-vf'
import {
  exportAudioModeMkvOnlyErrorMessage,
  ffmpegExportAudioModeAllowsFilters,
  ffmpegExportAudioModeRequiresMkv
} from './ffmpeg-export-audio-mode'
import {
  cpuFfmpegVideoCodecRequiresMkv,
  exportCpuCodecMkvOnlyErrorMessage,
  exportMovOnlyCodecErrorMessage,
  ffmpegExportVideoCodecRequiresMov,
  isFfmpegHwExportVideoCodec
} from './ffmpeg-export-video-codec'
import {
  normalizeFfmpegExportAudioGainDb,
  resolveFfmpegExportAudioNormalizeFilter,
  resolveFfmpegExportSubtitleCopyCodec
} from './ffmpeg-export-argv-filters'
import { appendFfmpegHwEncoderRateArgs } from './ffmpeg-export-argv-build-encode'
import type { FfmpegExportArgvParams } from './ffmpeg-export-argv-build-types'

/** Кодек, vf, аудио, субтитры и путь выхода — после секции input в argv. */
export function appendFfmpegExportCodecAudioAndOutput(
  args: string[],
  params: FfmpegExportArgvParams,
  filters: string[],
  enc: { crf: string; x264preset: string },
  crf: string,
  container: FfmpegExportContainerId
): string[] {
${codecAudioBody}
}
`
)

const entry = `/**
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
`

fs.writeFileSync(path.join(outDir, 'ffmpeg-export-argv-build.ts'), entry)

// Deduplicate argv.ts encode — re-export from build-encode
const argvPath = path.join(outDir, 'ffmpeg-export-argv.ts')
let argvText = fs.readFileSync(argvPath, 'utf8')
argvText = argvText.replace(
  /\/\*\* CRF и `-preset` x264[\s\S]*?^}\n\n/m,
  "export { resolveFfmpegExportEncodeParams } from './ffmpeg-export-argv-build-encode'\n\n"
)
fs.writeFileSync(argvPath, argvText)

console.log('split ffmpeg-export-argv-build OK')
