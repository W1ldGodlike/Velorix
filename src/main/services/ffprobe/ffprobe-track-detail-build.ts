import type { MediaProbeTrackRow } from '../../../shared/ffprobe-contract'
import type { AppUiLocale } from '../../../shared/app-ui-locale'
import { formatFfprobeDispositionSummary } from '../../../shared/ffprobe-disposition'
import { formatFfprobeCodecLongNameDetail } from '../../../shared/ffprobe-codec-long-name'
import { formatFfprobeStreamDurationDetail } from '../../../shared/ffprobe-stream-duration-detail'
import { formatFfprobeStreamDurationTsDetail } from '../../../shared/ffprobe-stream-duration-ts'
import { formatFfprobeStreamCodecTimeBaseDetail } from '../../../shared/ffprobe-stream-codec-time-base'
import { formatFfprobeStreamTimeBaseDetail } from '../../../shared/ffprobe-stream-time-base'
import { formatFfprobeStartPtsDetail } from './ffprobe-track-detail-helpers'
import { getMainApplicationStrings } from '../../../shared/main-application-locale'
import type { FfprobeJson } from './ffprobe-json-types'
import {
  ffprobeScalarDisplay,
  formatBitrateKbps,
  mapCodecType,
  tagString
} from './ffprobe-track-detail-helpers'

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
  locale: AppUiLocale
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

  const ptsShowsTimeBase = formatFfprobeStartPtsDetail(stream.start_pts, stream.time_base) !== null
  const streamTb = formatFfprobeStreamTimeBaseDetail(stream.time_base, ptsShowsTimeBase)
  if (streamTb) {
    parts.push(streamTb)
  }
  const codecTb = formatFfprobeStreamCodecTimeBaseDetail(stream.codec_time_base, stream.time_base)
  if (codecTb) {
    parts.push(codecTb)
  }

  const streamDurTs = formatFfprobeStreamDurationTsDetail(stream.duration_ts)
  if (streamDurTs) {
    parts.push(streamDurTs)
  }

  return parts.length > 0 ? parts.join(' · ') : '—'
}

export function buildTrackRows(
  streams: FfprobeJson['streams'],
  containerDurationSec: number | null,
  uiLocale: AppUiLocale = 'ru'
): MediaProbeTrackRow[] {
  const audioChSuffix = getMainApplicationStrings(uiLocale).ffprobeAudioChannelsSuffix
  const list = streams ?? []
  const rows: MediaProbeTrackRow[] = []
  list.forEach((stream, i) => {
    const index = typeof stream.index === 'number' ? stream.index : i
    const isVideo = stream.codec_type === 'video'
    const colorTransferRaw = stream.color_transfer ?? stream.color_trc
    rows.push({
      index,
      kind: mapCodecType(stream.codec_type),
      codec:
        typeof stream.codec_name === 'string' && stream.codec_name.trim() !== ''
          ? stream.codec_name
          : '?',
      detail: buildTrackDetail(stream, containerDurationSec, audioChSuffix, uiLocale),
      language: tagString(stream.tags, 'language'),
      titleTag: tagString(stream.tags, 'title'),
      streamBitrateKbps: formatBitrateKbps(
        typeof stream.bit_rate === 'string' ? stream.bit_rate : undefined
      ),
      dispositionSummary: formatFfprobeDispositionSummary(stream.disposition),
      pixelFormat: isVideo ? ffprobeScalarDisplay(stream.pix_fmt) : null,
      sampleAspectRatio: isVideo ? ffprobeScalarDisplay(stream.sample_aspect_ratio) : null,
      displayAspectRatio: isVideo ? ffprobeScalarDisplay(stream.display_aspect_ratio) : null,
      colorSpace: isVideo ? ffprobeScalarDisplay(stream.color_space) : null,
      colorPrimaries: isVideo ? ffprobeScalarDisplay(stream.color_primaries) : null,
      colorTransfer: isVideo ? ffprobeScalarDisplay(colorTransferRaw) : null,
      colorRange: isVideo ? ffprobeScalarDisplay(stream.color_range) : null
    })
  })
  rows.sort((a, b) => a.index - b.index)
  return rows
}
