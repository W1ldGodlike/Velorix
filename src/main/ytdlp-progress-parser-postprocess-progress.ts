import type { AppUiLocale } from '../shared/app-ui-locale'
import { getYtdlpQueueProgressStrings } from '../shared/ytdlp-queue-progress-locale'
import type { YtdlpDownloadProgressParts } from './ytdlp-progress-parser-download'

/**
 * §6.4 — подпись колонки «Прогресс» для строк post-processing без префикса `[download]`.
 * Дополняет `parseYtdlpDownloadProgressLine` (merge, embed, fixup, concat…).
 */
export function parseYtdlpQueuePostProcessProgressLine(
  line: string,
  locale: AppUiLocale = 'ru'
): YtdlpDownloadProgressParts | null {
  const P = getYtdlpQueueProgressStrings(locale)
  const t = line.trimEnd()
  if (t.length === 0 || !/^\[[A-Za-z][\w-]*]/.test(t)) {
    return null
  }

  if (/^\[(?:Merger|ffmpeg)]\s+Merging formats into/i.test(t)) {
    return { percent: null, speed: P.progressPostMerge, eta: null }
  }

  if (/^\[ExtractAudio]/i.test(t)) {
    return { percent: null, speed: P.progressPostAudio, eta: null }
  }

  if (/^\[(?:VideoRemuxer|FFmpegVideoRemuxer)]/i.test(t)) {
    return { percent: null, speed: P.progressPostRemux, eta: null }
  }

  if (/^\[(?:FFmpegVideoConvertor|VideoConvertor)]/i.test(t)) {
    return { percent: null, speed: P.progressPostConvert, eta: null }
  }

  if (/^\[EmbedSubtitle]/i.test(t)) {
    return { percent: null, speed: P.progressPostEmbedSubtitle, eta: null }
  }

  if (/^\[EmbedThumbnail]/i.test(t)) {
    return { percent: null, speed: P.progressPostEmbedThumbnail, eta: null }
  }

  if (/^\[Metadata]\s+(?:Adding|Writing)\s+metadata/i.test(t)) {
    return { percent: null, speed: P.progressPostMetadataEmbed, eta: null }
  }

  if (/^\[Concat]/i.test(t)) {
    return { percent: null, speed: P.progressPostConcat, eta: null }
  }

  if (/^\[MoveFiles]/i.test(t)) {
    return { percent: null, speed: P.progressPostMoveFile, eta: null }
  }

  if (/^\[Fixup/i.test(t)) {
    return { percent: null, speed: P.progressPostFixup, eta: null }
  }

  if (/^\[SponsorBlock]/i.test(t)) {
    return { percent: null, speed: P.progressPostSponsorBlock, eta: null }
  }

  if (/^\[(?:SubtitlesConvertor|SubsConvertor)]/i.test(t)) {
    return { percent: null, speed: P.progressPostSubConvert, eta: null }
  }

  if (/^\[ffmpeg]\s+Post-processing/i.test(t)) {
    return { percent: null, speed: P.progressPostProcessing, eta: null }
  }

  if (/^\[ffmpeg]\s+Destination:/i.test(t)) {
    return { percent: null, speed: P.progressPostFfmpegDestination, eta: null }
  }

  return null
}
