/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'fs'
import path from 'path'
import { REPO_ROOT } from './lib/repo-root.mjs'

const root = REPO_ROOT
const buildPath = path.join(root, 'src/main/ffprobe-track-detail-build.ts')
const lines = fs.readFileSync(buildPath, 'utf8').split(/\r?\n/)

const markers = [
  ["  if (ct === 'video') {", 'appendFfprobeVideoTrackDetailParts'],
  ["  } else if (ct === 'audio') {", 'appendFfprobeAudioTrackDetailParts'],
  ["  } else if (ct === 'subtitle') {", 'appendFfprobeSubtitleTrackDetailParts'],
  ['  } else {', 'appendFfprobeOtherTrackDetailParts']
]

const indices = markers.map(([m]) => lines.findIndex((l) => l === m))
if (indices.some((i) => i < 0)) {
  throw new Error(`marker not found: ${JSON.stringify(indices)}`)
}

const tailStart = lines.findIndex((l) => l.startsWith('  const ptsShowsTimeBase'))
if (tailStart < 0) {
  throw new Error('tail marker not found')
}

/** @param {number} start @param {number} end @returns {string} */
function dedentBlock(start, end) {
  return lines
    .slice(start + 1, end)
    .map((l) => (l.startsWith('    ') ? l.slice(4) : l))
    .join('\n')
}

const sharedImports = `import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { formatFfprobeVideoFpsDetail } from '../shared/ffprobe-video-fps'
import {
  extractFfprobeDisplayMatrixRotation,
  summarizeFfprobeSideDataList
} from '../shared/ffprobe-side-data'
import { formatFfprobeStreamDurationDetail } from '../shared/ffprobe-stream-duration-detail'
import { formatFfprobeStreamStereoModeDetail } from '../shared/ffprobe-stream-stereo-mode'
import { formatFfprobeStreamStartTime } from '../shared/ffprobe-stream-start-time'
import {
  formatFfprobeVideoFullRangeBrief,
  formatFfprobeVideoHdrColorBrief,
  formatFfprobeVideoSdGamutBrief,
  formatFfprobeVideoSdrTransferBrief
} from '../shared/ffprobe-video-color-brief'
import { formatFfprobeCreationTimeBrief } from '../shared/ffprobe-creation-time-brief'
import type { FfprobeJson } from './ffprobe-json-types'
import {
  appendFfprobeNbFramesDetail,
  appendFfprobeReplayGainAudioDetail,
  appendMaxBitrateDetailIfNotable,
  appendTrackTagsLangTitleHandler,
  ffprobeContainerFourccDisplay,
  ffprobeScalarDisplay,
  formatFfprobeCodecTagHexDetail,
  formatFfprobeStartPtsDetail,
  formatFfprobeTagEncoderBrief,
  isSquarePixelSar,
  parseFfprobeOptionalInt,
  parsePositiveNumber,
  parseTagRotateDegrees,
  tagString
} from './ffprobe-track-detail-helpers'

export type FfprobeStream = NonNullable<FfprobeJson['streams']>[number]

`

/** @param {string} name @returns {string} */
const funcHeader = (name) => `export function ${name}(
  parts: string[],
  stream: FfprobeStream,
  containerDurationSec: number | null,
  streamDur: string | null,
  audioChannelsSuffixTemplate: string,
  locale: DownloadsWindowUiLocale
): void {
`

const codecBlocks = []
for (let i = 0; i < markers.length; i++) {
  const [, fnName] = markers[i]
  const bodyStart = indices[i]
  const bodyEnd =
    i < markers.length - 1
      ? indices[i + 1]
      : (() => {
          const close = tailStart - 1
          if (lines[close] !== '  }') {
            throw new Error(`expected closing brace before tail at line ${close + 1}`)
          }
          return close
        })()
  codecBlocks.push(`${funcHeader(fnName)}${dedentBlock(bodyStart, bodyEnd)}
}
`)
}

fs.writeFileSync(
  path.join(root, 'src/main/ffprobe-track-detail-by-codec.ts'),
  `${sharedImports}${codecBlocks.join('\n')}`
)

const buildHeadEnd = lines.findIndex((l) => l.startsWith('function buildTrackDetail'))
const buildHead = lines.slice(0, buildHeadEnd).join('\n')

const orchestrator = `${buildHead}
import {
  appendFfprobeAudioTrackDetailParts,
  appendFfprobeOtherTrackDetailParts,
  appendFfprobeSubtitleTrackDetailParts,
  appendFfprobeVideoTrackDetailParts,
  type FfprobeStream
} from './ffprobe-track-detail-by-codec'

function buildTrackDetail(
  stream: FfprobeStream,
  containerDurationSec: number | null,
  audioChannelsSuffixTemplate: string,
  locale: DownloadsWindowUiLocale
): string {
  const parts: string[] = []
  const codecLong = formatFfprobeCodecLongNameDetail(
    typeof stream.codec_name === 'string' ? stream.codec_name : undefined,
    typeof stream.codec_long_name === 'string' ? stream.codec_long_name : undefined
  )
  if (codecLong) {
    parts.push(codecLong)
  }
  const ct = stream.codec_type
  const streamDur = formatFfprobeStreamDurationDetail(stream.duration, containerDurationSec)

  if (ct === 'video') {
    appendFfprobeVideoTrackDetailParts(
      parts,
      stream,
      containerDurationSec,
      streamDur,
      audioChannelsSuffixTemplate,
      locale
    )
  } else if (ct === 'audio') {
    appendFfprobeAudioTrackDetailParts(
      parts,
      stream,
      containerDurationSec,
      streamDur,
      audioChannelsSuffixTemplate,
      locale
    )
  } else if (ct === 'subtitle') {
    appendFfprobeSubtitleTrackDetailParts(
      parts,
      stream,
      containerDurationSec,
      streamDur,
      audioChannelsSuffixTemplate,
      locale
    )
  } else {
    appendFfprobeOtherTrackDetailParts(
      parts,
      stream,
      containerDurationSec,
      streamDur,
      audioChannelsSuffixTemplate,
      locale
    )
  }

${lines
  .slice(
    tailStart,
    lines.findIndex((l) => l.startsWith('export function buildTrackRows'))
  )
  .join('\n')}
`

fs.writeFileSync(
  buildPath,
  `${orchestrator}${lines.slice(lines.findIndex((l) => l.startsWith('export function buildTrackRows'))).join('\n')}\n`
)

console.log('codec split ok', {
  byCodec: codecBlocks.reduce((n, b) => n + b.split('\n').length, 0)
})
