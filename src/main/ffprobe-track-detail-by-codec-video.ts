import type { AppUiLocale } from '../shared/app-ui-locale'
import { formatFfprobeVideoFpsDetail } from '../shared/ffprobe-video-fps'
import {
  extractFfprobeDisplayMatrixRotation,
  summarizeFfprobeSideDataList
} from '../shared/ffprobe-side-data'
import { formatFfprobeStreamStereoModeDetail } from '../shared/ffprobe-stream-stereo-mode'
import { formatFfprobeStreamStartTime } from '../shared/ffprobe-stream-start-time'
import {
  formatFfprobeVideoFullRangeBrief,
  formatFfprobeVideoHdrColorBrief,
  formatFfprobeVideoSdGamutBrief,
  formatFfprobeVideoSdrTransferBrief
} from '../shared/ffprobe-video-color-brief'
import { formatFfprobeCreationTimeBrief } from '../shared/ffprobe-creation-time-brief'
import {
  appendFfprobeNbFramesDetail,
  appendMaxBitrateDetailIfNotable,
  appendTrackTagsLangTitleHandler,
  ffprobeContainerFourccDisplay,
  ffprobeScalarDisplay,
  formatFfprobeCodecTagHexDetail,
  formatFfprobeStartPtsDetail,
  formatFfprobeTagEncoderBrief,
  isSquarePixelSar,
  parseFfprobeOptionalInt,
  parseTagRotateDegrees,
  tagString
} from './ffprobe-track-detail-helpers'
import type { FfprobeStream } from './ffprobe-track-detail-by-codec-types'

export function appendFfprobeVideoTrackDetailParts(
  parts: string[],
  stream: FfprobeStream,
  _containerDurationSec: number | null,
  streamDur: string | null,
  _audioChannelsSuffixTemplate: string,
  locale: AppUiLocale
): void {
  const w = stream.width
  const h = stream.height
  const haveWh = typeof w === 'number' && typeof h === 'number'
  if (haveWh) {
    parts.push(`${w}×${h}`)
  }
  const sarShown = ffprobeScalarDisplay(stream.sample_aspect_ratio)
  if (sarShown !== null && !isSquarePixelSar(sarShown)) {
    parts.push(`SAR ${sarShown}`)
  }
  const darShown = ffprobeScalarDisplay(stream.display_aspect_ratio)
  if (darShown !== null) {
    parts.push(`DAR ${darShown}`)
  }
  const matrixDeg = extractFfprobeDisplayMatrixRotation(stream.side_data_list)
  const tagRotDeg = parseTagRotateDegrees(tagString(stream.tags, 'rotate'))
  if (matrixDeg !== null && matrixDeg !== 0) {
    const label = Number.isInteger(matrixDeg) ? String(matrixDeg) : matrixDeg.toFixed(2)
    parts.push(`matrix ${label}°`)
  } else if (tagRotDeg !== null) {
    parts.push(`rot ${tagRotDeg}°`)
  }
  const stereoMode = formatFfprobeStreamStereoModeDetail(stream.tags)
  if (stereoMode) {
    parts.push(stereoMode)
  }
  const fpsLine = formatFfprobeVideoFpsDetail(stream.avg_frame_rate, stream.r_frame_rate, locale)
  if (fpsLine !== null) {
    parts.push(fpsLine)
  }
  const tpf = parseFfprobeOptionalInt(stream.ticks_per_frame)
  if (tpf !== null && tpf > 1) {
    parts.push(`tpf ${tpf}`)
  }
  const vStart = formatFfprobeStreamStartTime(stream.start_time)
  if (vStart) {
    parts.push(vStart)
  }
  const vStartPts = formatFfprobeStartPtsDetail(stream.start_pts, stream.time_base)
  if (vStartPts) {
    parts.push(vStartPts)
  }
  if (streamDur) {
    parts.push(streamDur)
  }
  appendFfprobeNbFramesDetail(parts, stream.nb_frames)
  const sideData = summarizeFfprobeSideDataList(stream.side_data_list, locale)
  if (sideData !== null) {
    parts.push(sideData)
  }
  const profile = ffprobeScalarDisplay(
    typeof stream.profile === 'string' ? stream.profile : undefined
  )
  if (profile) {
    parts.push(profile)
  }
  const levelRaw = stream.level
  const levelStr =
    typeof levelRaw === 'number' && Number.isFinite(levelRaw)
      ? String(Math.trunc(levelRaw))
      : typeof levelRaw === 'string'
        ? levelRaw.trim()
        : ''
  if (levelStr !== '' && !/^n\/a$/i.test(levelStr)) {
    parts.push(`level ${levelStr}`)
  }
  const fieldOrder = ffprobeScalarDisplay(
    typeof stream.field_order === 'string' ? stream.field_order : undefined
  )
  if (fieldOrder) {
    parts.push(fieldOrder)
  }
  const chroma = ffprobeScalarDisplay(
    typeof stream.chroma_location === 'string' ? stream.chroma_location : undefined
  )
  if (chroma) {
    parts.push(`chroma ${chroma}`)
  }
  const hdrBrief = formatFfprobeVideoHdrColorBrief(stream)
  if (hdrBrief) {
    parts.push(hdrBrief)
  }
  const fullRangeBrief = formatFfprobeVideoFullRangeBrief(stream)
  if (fullRangeBrief) {
    parts.push(fullRangeBrief)
  }
  const sdGamutBrief = formatFfprobeVideoSdGamutBrief(stream)
  if (sdGamutBrief) {
    parts.push(sdGamutBrief)
  }
  const sdrTransferBrief = formatFfprobeVideoSdrTransferBrief(stream)
  if (sdrTransferBrief) {
    parts.push(sdrTransferBrief)
  }
  const pixFmt = ffprobeScalarDisplay(
    typeof stream.pix_fmt === 'string' ? stream.pix_fmt : undefined
  )
  if (pixFmt !== null) {
    const pixNorm = pixFmt.replace(/\s+/g, '').toLowerCase()
    if (pixNorm !== 'yuv420p' && pixNorm !== 'yuvj420p') {
      parts.push(pixFmt)
    }
  }
  const bitsRaw = stream.bits_per_raw_sample
  if (typeof bitsRaw === 'number' && Number.isFinite(bitsRaw) && bitsRaw > 0) {
    parts.push(`${Math.trunc(bitsRaw)}-bit`)
  } else {
    const bitsS = ffprobeScalarDisplay(typeof bitsRaw === 'string' ? bitsRaw : undefined)
    if (bitsS) {
      parts.push(`${bitsS}-bit`)
    }
  }
  const bitsCodedRaw = stream.bits_per_coded_sample
  if (typeof bitsCodedRaw === 'number' && Number.isFinite(bitsCodedRaw) && bitsCodedRaw > 0) {
    parts.push(`bpc ${Math.trunc(bitsCodedRaw)}-bit`)
  } else {
    const bitsCodedS = ffprobeScalarDisplay(
      typeof bitsCodedRaw === 'string' ? bitsCodedRaw : undefined
    )
    if (bitsCodedS) {
      parts.push(`bpc ${bitsCodedS}-bit`)
    }
  }
  const cw = stream.coded_width
  const ch = stream.coded_height
  if (
    haveWh &&
    typeof cw === 'number' &&
    typeof ch === 'number' &&
    Number.isFinite(cw) &&
    Number.isFinite(ch) &&
    cw > 0 &&
    ch > 0 &&
    (cw !== w || ch !== h)
  ) {
    parts.push(`coded ${cw}×${ch}`)
  }
  const refsN = stream.refs
  if (typeof refsN === 'number' && Number.isFinite(refsN) && refsN > 0) {
    parts.push(`${refsN} ref`)
  }
  const bFrames = stream.has_b_frames
  if (typeof bFrames === 'number' && Number.isFinite(bFrames) && bFrames > 0) {
    parts.push(`B${bFrames}`)
  }
  const ccVal = parseFfprobeOptionalInt(stream.closed_captions)
  if (ccVal !== null && ccVal !== 0) {
    parts.push('CEA-608/708')
  }
  const avcVal = parseFfprobeOptionalInt(stream.is_avc)
  const codecNameLower = (
    typeof stream.codec_name === 'string' ? stream.codec_name : ''
  ).toLowerCase()
  if (codecNameLower.includes('h264') && avcVal === 0) {
    parts.push('Annex-B')
  }
  const fourcc = ffprobeContainerFourccDisplay(
    typeof stream.codec_tag_string === 'string' ? stream.codec_tag_string : undefined
  )
  if (fourcc) {
    parts.push(fourcc)
  } else {
    const tagHex = formatFfprobeCodecTagHexDetail(stream.codec_tag)
    if (tagHex) {
      parts.push(tagHex)
    }
  }
  const vEx = parseFfprobeOptionalInt(stream.extradata_size)
  if (vEx !== null && vEx > 0) {
    parts.push(`exdata ${vEx} B`)
  }
  const vInitialPadding = parseFfprobeOptionalInt(stream.initial_padding)
  if (vInitialPadding !== null && vInitialPadding > 0) {
    parts.push(`pad ${vInitialPadding} smp`)
  }
  appendMaxBitrateDetailIfNotable(parts, stream.bit_rate, stream.max_bit_rate, locale)
  appendTrackTagsLangTitleHandler(parts, stream.tags)
  const vEnc = formatFfprobeTagEncoderBrief(stream.tags)
  if (vEnc) {
    parts.push(vEnc)
  }
  const timecode = tagString(stream.tags, 'timecode')
  if (timecode) {
    parts.push(`TC ${timecode}`)
  }
  const vCreated = formatFfprobeCreationTimeBrief(stream.tags)
  if (vCreated) {
    parts.push(vCreated)
  }
}
