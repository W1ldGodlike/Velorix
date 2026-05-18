import type { AppUiLocale } from '../shared/app-ui-locale'
import { formatFfprobeStreamStartTime } from '../shared/ffprobe-stream-start-time'
import { formatFfprobeCreationTimeBrief } from '../shared/ffprobe-creation-time-brief'
import {
  appendFfprobeNbFramesDetail,
  appendMaxBitrateDetailIfNotable,
  appendTrackTagsLangTitleHandler,
  ffprobeContainerFourccDisplay,
  formatFfprobeCodecTagHexDetail,
  formatFfprobeStartPtsDetail,
  formatFfprobeTagEncoderBrief,
  parseFfprobeOptionalInt
} from './ffprobe-track-detail-helpers'
import type { FfprobeStream } from './ffprobe-track-detail-by-codec-types'

export function appendFfprobeSubtitleTrackDetailParts(
  parts: string[],
  stream: FfprobeStream,
  _containerDurationSec: number | null,
  streamDur: string | null,
  _audioChannelsSuffixTemplate: string,
  locale: AppUiLocale
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
