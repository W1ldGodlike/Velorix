import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { formatFfprobeStreamStartTime } from '../shared/ffprobe-stream-start-time'
import { formatFfprobeCreationTimeBrief } from '../shared/ffprobe-creation-time-brief'
import {
  appendFfprobeNbFramesDetail,
  appendMaxBitrateDetailIfNotable,
  ffprobeContainerFourccDisplay,
  ffprobeScalarDisplay,
  formatFfprobeCodecTagHexDetail,
  formatFfprobeStartPtsDetail,
  formatFfprobeTagEncoderBrief,
  parseFfprobeOptionalInt,
  tagString
} from './ffprobe-track-detail-helpers'
import type { FfprobeStream } from './ffprobe-track-detail-by-codec-types'

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
