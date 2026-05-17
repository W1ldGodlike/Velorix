import type { AppPaths } from './app-paths'
import { resolveEngineExecutablePath, type EnginePathOverrides } from './engine-service'
import { buildChapterRowsFromFfprobeJson } from '../shared/ffprobe-chapters'
import {
  parseFfprobeContainerFieldsFromFormat,
  parseFfprobeFormatBitRateKbps,
  parseFfprobeFormatDurationSec
} from '../shared/ffprobe-container-format'
import { parseFfprobeFormatScalarTagsFromFfprobe } from '../shared/ffprobe-format-tag-registry'
import type { MediaProbeResult, MediaProbeSuccess } from '../shared/ffprobe-contract'
export type {
  MediaProbeResult,
  MediaProbeSuccess,
  MediaProbeTrackRow
} from '../shared/ffprobe-contract'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { getMainApplicationStrings } from '../shared/main-application-locale'
import { resolveVideoFpsApprox } from '../shared/ffprobe-video-fps'

import { buildTrackRows, type FfprobeJson } from './ffprobe-track-detail-builder'
export { buildTrackRows } from './ffprobe-track-detail-builder'
import { runFfprobeJson } from './ffprobe-probe-json'

export async function probeMediaFile(
  paths: AppPaths,
  absoluteMediaPath: string,
  engineOverrides?: EnginePathOverrides,
  locale: DownloadsWindowUiLocale = 'ru'
): Promise<MediaProbeResult> {
  const S = getMainApplicationStrings(locale)
  const ffprobe = resolveEngineExecutablePath(paths, 'ffprobe', engineOverrides)
  if (!ffprobe) {
    return { ok: false, error: S.ffprobeNotFound }
  }

  let rawJson: string
  try {
    rawJson = await runFfprobeJson(ffprobe, absoluteMediaPath)
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : S.ffprobeRunFailed
    }
  }

  let parsed: FfprobeJson
  try {
    parsed = JSON.parse(rawJson) as FfprobeJson
  } catch {
    return { ok: false, error: S.ffprobeInvalidJson }
  }

  const durationSecResolved = parseFfprobeFormatDurationSec(parsed.format?.duration)

  let video: MediaProbeSuccess['video'] = null
  let videoFpsApprox: number | null = null
  let audioCodec: string | null = null

  for (const s of parsed.streams ?? []) {
    if (
      s.codec_type === 'video' &&
      video === null &&
      s.width !== undefined &&
      s.height !== undefined
    ) {
      video = {
        width: s.width,
        height: s.height,
        codec: s.codec_name ?? 'unknown'
      }
      videoFpsApprox = resolveVideoFpsApprox({
        durationSec: durationSecResolved,
        ...(typeof s.avg_frame_rate === 'string' ? { avgFrameRate: s.avg_frame_rate } : {}),
        ...(typeof s.r_frame_rate === 'string' ? { rFrameRate: s.r_frame_rate } : {}),
        ...(typeof s.nb_frames === 'string' ? { nbFrames: s.nb_frames } : {})
      })
    }
    if (s.codec_type === 'audio' && audioCodec === null && s.codec_name) {
      audioCodec = s.codec_name
    }
  }

  const formatLong =
    typeof parsed.format?.format_long_name === 'string' &&
    parsed.format.format_long_name.trim() !== ''
      ? parsed.format.format_long_name.trim()
      : null

  return {
    ok: true,
    durationSec: durationSecResolved,
    video,
    videoFpsApprox,
    audioCodec,
    formatName:
      typeof parsed.format?.format_name === 'string'
        ? (parsed.format.format_name.split(',')[0]?.trim() ?? null)
        : null,
    formatLongName: formatLong,
    bitrateKbps: parseFfprobeFormatBitRateKbps(parsed.format?.bit_rate),
    ...parseFfprobeContainerFieldsFromFormat(parsed.format),
    ...parseFfprobeFormatScalarTagsFromFfprobe(parsed.format?.tags),
    tracks: buildTrackRows(parsed.streams, durationSecResolved, locale),
    chapters: buildChapterRowsFromFfprobeJson(parsed.chapters),
    rawJson
  }
}
