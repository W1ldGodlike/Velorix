import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
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

export function appendFfprobeVideoTrackDetailParts(
  parts: string[],
  stream: FfprobeStream,
  _containerDurationSec: number | null,
  streamDur: string | null,
  _audioChannelsSuffixTemplate: string,
  locale: DownloadsWindowUiLocale
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

export function appendFfprobeAudioTrackDetailParts(
  parts: string[],
  stream: FfprobeStream,
  _containerDurationSec: number | null,
  streamDur: string | null,
  audioChannelsSuffixTemplate: string,
  locale: DownloadsWindowUiLocale
): void {
  const ch = stream.channels
  if (typeof ch === 'number') {
    parts.push(audioChannelsSuffixTemplate.replace('{n}', String(ch)))
  }
  const sr = parsePositiveNumber(stream.sample_rate)
  if (sr !== null) {
    if (sr >= 1000) {
      const k = sr / 1000
      parts.push(`${Number.isInteger(k) ? String(k) : k.toFixed(1)} kHz`)
    } else {
      parts.push(`${sr} Hz`)
    }
  }
  if (typeof stream.channel_layout === 'string' && stream.channel_layout.trim() !== '') {
    parts.push(stream.channel_layout.trim())
  }
  appendTrackTagsLangTitleHandler(parts, stream.tags)
  appendFfprobeReplayGainAudioDetail(parts, stream.tags)
  const aStart = formatFfprobeStreamStartTime(stream.start_time)
  if (aStart) {
    parts.push(aStart)
  }
  const aStartPts = formatFfprobeStartPtsDetail(stream.start_pts, stream.time_base)
  if (aStartPts) {
    parts.push(aStartPts)
  }
  if (streamDur) {
    parts.push(streamDur)
  }
  appendFfprobeNbFramesDetail(parts, stream.nb_frames)
  const audioSide = summarizeFfprobeSideDataList(stream.side_data_list, locale)
  if (audioSide !== null) {
    parts.push(audioSide)
  }
  const aProfile = ffprobeScalarDisplay(
    typeof stream.profile === 'string' ? stream.profile : undefined
  )
  if (aProfile) {
    parts.push(aProfile)
  }
  const sampleFmt = ffprobeScalarDisplay(
    typeof stream.sample_fmt === 'string' ? stream.sample_fmt : undefined
  )
  if (sampleFmt) {
    parts.push(sampleFmt)
  }
  const aBitsCodedRaw = stream.bits_per_coded_sample
  if (typeof aBitsCodedRaw === 'number' && Number.isFinite(aBitsCodedRaw) && aBitsCodedRaw > 0) {
    parts.push(`bpc ${Math.trunc(aBitsCodedRaw)}-bit`)
  } else {
    const aBitsCodedS = ffprobeScalarDisplay(
      typeof aBitsCodedRaw === 'string' ? aBitsCodedRaw : undefined
    )
    if (aBitsCodedS) {
      parts.push(`bpc ${aBitsCodedS}-bit`)
    }
  }
  const bitsPerSample = stream.bits_per_sample
  if (typeof bitsPerSample === 'number' && Number.isFinite(bitsPerSample) && bitsPerSample > 0) {
    parts.push(`${Math.trunc(bitsPerSample)}-bit PCM`)
  }
  const aFourcc = ffprobeContainerFourccDisplay(
    typeof stream.codec_tag_string === 'string' ? stream.codec_tag_string : undefined
  )
  if (aFourcc) {
    parts.push(aFourcc)
  } else {
    const aTagHex = formatFfprobeCodecTagHexDetail(stream.codec_tag)
    if (aTagHex) {
      parts.push(aTagHex)
    }
  }
  const aEx = parseFfprobeOptionalInt(stream.extradata_size)
  if (aEx !== null && aEx > 0) {
    parts.push(`exdata ${aEx} B`)
  }
  const aInitialPadding = parseFfprobeOptionalInt(stream.initial_padding)
  if (aInitialPadding !== null && aInitialPadding > 0) {
    parts.push(`pad ${aInitialPadding} smp`)
  }
  appendMaxBitrateDetailIfNotable(parts, stream.bit_rate, stream.max_bit_rate, locale)
  const aCreated = formatFfprobeCreationTimeBrief(stream.tags)
  if (aCreated) {
    parts.push(aCreated)
  }
  const aEnc = formatFfprobeTagEncoderBrief(stream.tags)
  if (aEnc) {
    parts.push(aEnc)
  }
}

export function appendFfprobeSubtitleTrackDetailParts(
  parts: string[],
  stream: FfprobeStream,
  _containerDurationSec: number | null,
  streamDur: string | null,
  _audioChannelsSuffixTemplate: string,
  locale: DownloadsWindowUiLocale
): void {
  appendTrackTagsLangTitleHandler(parts, stream.tags)
  const subFourcc = ffprobeContainerFourccDisplay(
    typeof stream.codec_tag_string === 'string' ? stream.codec_tag_string : undefined
  )
  if (subFourcc) {
    parts.push(subFourcc)
  } else {
    const subTagHex = formatFfprobeCodecTagHexDetail(stream.codec_tag)
    if (subTagHex) {
      parts.push(subTagHex)
    }
  }
  const subEx = parseFfprobeOptionalInt(stream.extradata_size)
  if (subEx !== null && subEx > 0) {
    parts.push(`exdata ${subEx} B`)
  }
  const subInitialPadding = parseFfprobeOptionalInt(stream.initial_padding)
  if (subInitialPadding !== null && subInitialPadding > 0) {
    parts.push(`pad ${subInitialPadding} smp`)
  }
  appendMaxBitrateDetailIfNotable(parts, stream.bit_rate, stream.max_bit_rate, locale)
  const subEnc = formatFfprobeTagEncoderBrief(stream.tags)
  if (subEnc) {
    parts.push(subEnc)
  }
  const subCreated = formatFfprobeCreationTimeBrief(stream.tags)
  if (subCreated) {
    parts.push(subCreated)
  }
  const subStart = formatFfprobeStreamStartTime(stream.start_time)
  if (subStart) {
    parts.push(subStart)
  }
  const subStartPts = formatFfprobeStartPtsDetail(stream.start_pts, stream.time_base)
  if (subStartPts) {
    parts.push(subStartPts)
  }
  if (streamDur) {
    parts.push(streamDur)
  }
  appendFfprobeNbFramesDetail(parts, stream.nb_frames)
}

export function appendFfprobeOtherTrackDetailParts(
  parts: string[],
  stream: FfprobeStream,
  _containerDurationSec: number | null,
  streamDur: string | null,
  _audioChannelsSuffixTemplate: string,
  locale: DownloadsWindowUiLocale
): void {
  const otherCodec = ffprobeScalarDisplay(
    typeof stream.codec_name === 'string' ? stream.codec_name : undefined
  )
  if (otherCodec) {
    parts.push(otherCodec)
  }
  const fn = tagString(stream.tags, 'filename')
  if (fn) {
    parts.push(fn)
  }
  const mimetype = tagString(stream.tags, 'mimetype')
  if (mimetype) {
    parts.push(mimetype)
  }
  const lang = tagString(stream.tags, 'language')
  const title = tagString(stream.tags, 'title')
  if (lang) {
    parts.push(lang)
  }
  if (title) {
    parts.push(title)
  }
  const oFourcc = ffprobeContainerFourccDisplay(
    typeof stream.codec_tag_string === 'string' ? stream.codec_tag_string : undefined
  )
  if (oFourcc) {
    parts.push(oFourcc)
  } else {
    const oTagHex = formatFfprobeCodecTagHexDetail(stream.codec_tag)
    if (oTagHex) {
      parts.push(oTagHex)
    }
  }
  const oEx = parseFfprobeOptionalInt(stream.extradata_size)
  if (oEx !== null && oEx > 0) {
    parts.push(`exdata ${oEx} B`)
  }
  const oInitialPadding = parseFfprobeOptionalInt(stream.initial_padding)
  if (oInitialPadding !== null && oInitialPadding > 0) {
    parts.push(`pad ${oInitialPadding} smp`)
  }
  appendMaxBitrateDetailIfNotable(parts, stream.bit_rate, stream.max_bit_rate, locale)
  const oStart = formatFfprobeStreamStartTime(stream.start_time)
  if (oStart) {
    parts.push(oStart)
  }
  const oStartPts = formatFfprobeStartPtsDetail(stream.start_pts, stream.time_base)
  if (oStartPts) {
    parts.push(oStartPts)
  }
  if (streamDur) {
    parts.push(streamDur)
  }
  appendFfprobeNbFramesDetail(parts, stream.nb_frames)
  const oEnc = formatFfprobeTagEncoderBrief(stream.tags)
  if (oEnc) {
    parts.push(oEnc)
  }
  const oCreated = formatFfprobeCreationTimeBrief(stream.tags)
  if (oCreated) {
    parts.push(oCreated)
  }
}
