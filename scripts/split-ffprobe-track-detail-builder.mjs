/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcPath = path.join(root, 'src/main/ffprobe-track-detail-builder.ts')
const lines = fs.readFileSync(srcPath, 'utf8').split(/\r?\n/)

const importsEnd = lines.findIndex((l) => l.startsWith('export interface FfprobeJson'))
const helpersStart = lines.findIndex((l) => l.startsWith('function parsePositiveNumber'))
const buildStart = lines.findIndex((l) => l.startsWith('function buildTrackDetail'))
const rowsStart = lines.findIndex((l) => l.startsWith('export function buildTrackRows'))

const typesBlock = lines.slice(importsEnd, helpersStart).join('\n')
const helpersBlock = lines
  .slice(helpersStart, buildStart)
  .map((l) => l.replace(/^function /, 'export function '))
  .join('\n')
const buildBlock = lines.slice(buildStart, rowsStart).join('\n')
const rowsBlock = lines.slice(rowsStart).join('\n')

const helpersImports = `import type { MediaProbeTrackRow } from '../shared/ffprobe-contract'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { formatFfprobeBitrateLabelFromKbps } from '../shared/ffprobe-summary-export-locale'
`

const buildImports = `import type { MediaProbeTrackRow } from '../shared/ffprobe-contract'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { formatFfprobeDispositionSummary } from '../shared/ffprobe-disposition'
import { formatFfprobeVideoFpsDetail } from '../shared/ffprobe-video-fps'
import {
  extractFfprobeDisplayMatrixRotation,
  summarizeFfprobeSideDataList
} from '../shared/ffprobe-side-data'
import { formatFfprobeCodecLongNameDetail } from '../shared/ffprobe-codec-long-name'
import { formatFfprobeStreamDurationDetail } from '../shared/ffprobe-stream-duration-detail'
import { formatFfprobeStreamDurationTsDetail } from '../shared/ffprobe-stream-duration-ts'
import { formatFfprobeStreamStereoModeDetail } from '../shared/ffprobe-stream-stereo-mode'
import { formatFfprobeStreamCodecTimeBaseDetail } from '../shared/ffprobe-stream-codec-time-base'
import { formatFfprobeStreamTimeBaseDetail } from '../shared/ffprobe-stream-time-base'
import { formatFfprobeStreamStartTime } from '../shared/ffprobe-stream-start-time'
import {
  formatFfprobeVideoFullRangeBrief,
  formatFfprobeVideoHdrColorBrief,
  formatFfprobeVideoSdGamutBrief,
  formatFfprobeVideoSdrTransferBrief
} from '../shared/ffprobe-video-color-brief'
import { formatFfprobeCreationTimeBrief } from '../shared/ffprobe-creation-time-brief'
import { getMainApplicationStrings } from '../shared/main-application-locale'
import type { FfprobeJson } from './ffprobe-json-types'
import {
  appendFfprobeNbFramesDetail,
  appendFfprobeReplayGainAudioDetail,
  appendMaxBitrateDetailIfNotable,
  appendTrackTagsLangTitleHandler,
  ffprobeContainerFourccDisplay,
  ffprobeScalarDisplay,
  formatBitrateKbps,
  formatFfprobeCodecTagHexDetail,
  formatFfprobeStartPtsDetail,
  formatFfprobeTagEncoderBrief,
  isSquarePixelSar,
  mapCodecType,
  parseFfprobeOptionalInt,
  parsePositiveNumber,
  parseTagRotateDegrees,
  tagString
} from './ffprobe-track-detail-helpers'

`

fs.writeFileSync(path.join(root, 'src/main/ffprobe-json-types.ts'), `${typesBlock}\n`)
fs.writeFileSync(
  path.join(root, 'src/main/ffprobe-track-detail-helpers.ts'),
  `${helpersImports}${helpersBlock}\n`
)
fs.writeFileSync(
  path.join(root, 'src/main/ffprobe-track-detail-build.ts'),
  `${buildImports}${buildBlock.replace(/^function buildTrackDetail/, 'function buildTrackDetail')}\n\n${rowsBlock}\n`
)

const entry = `export type { FfprobeJson } from './ffprobe-json-types'
export { buildTrackRows } from './ffprobe-track-detail-build'
export type { MediaProbeTrackRow } from '../shared/ffprobe-contract'
`

fs.writeFileSync(path.join(root, 'src/main/ffprobe-track-detail-builder.ts'), entry)

console.log('split ok', {
  types: typesBlock.split('\n').length,
  helpers: helpersBlock.split('\n').length,
  build: buildBlock.split('\n').length
})
