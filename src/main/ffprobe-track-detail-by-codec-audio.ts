import type { AppUiLocale } from '../shared/app-ui-locale'
import { summarizeFfprobeSideDataList } from '../shared/ffprobe-side-data'
import { formatFfprobeStreamStartTime } from '../shared/ffprobe-stream-start-time'
import { formatFfprobeCreationTimeBrief } from '../shared/ffprobe-creation-time-brief'
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
  parseFfprobeOptionalInt,
  parsePositiveNumber
} from './ffprobe-track-detail-helpers'
import type { FfprobeStream } from './ffprobe-track-detail-by-codec-types'

export function appendFfprobeAudioTrackDetailParts(
  parts: string[],
  stream: FfprobeStream,
  _containerDurationSec: number | null,
  streamDur: string | null,
  audioChannelsSuffixTemplate: string,
  locale: AppUiLocale
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
