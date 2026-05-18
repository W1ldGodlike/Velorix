import type { AppUiLocale } from './app-ui-locale'

/** Подписи §6.4 для колонки прогресса / формата / статуса ошибки очереди yt-dlp. */
export type YtdlpQueueProgressStrings = {
  progressPlaylist: string
  progressFragment: string
  progressPauseSec: string
  progressWaitingReconnect: string
  progressHlsManifest: string
  progressPlayerMetadata: string
  progressWebpage: string
  progressWaiting: string
  progressResume: string
  progressRetryFragment: string
  progressRetry: string
  progressRetryInSec: string
  progressPlaylistSkip: string
  progressRenameFailed: string
  progressFormatSelect: string
  progressAlreadyDownloaded: string
  progressGivingUpRetries: string
  progressWritingThumbnail: string
  progressWritingSubtitles: string
  progressWritingMetadata: string
  progressRateLimitSleep: string
  progressDeletingOriginal: string
  progressPostMerge: string
  progressPostAudio: string
  progressPostRemux: string
  progressPostConvert: string
  progressPostEmbedSubtitle: string
  progressPostEmbedThumbnail: string
  progressPostMetadataEmbed: string
  progressPostConcat: string
  progressPostMoveFile: string
  progressPostFixup: string
  progressPostSponsorBlock: string
  progressPostSubConvert: string
  progressPostProcessing: string
  progressPostFfmpegDestination: string
  formatHintMerge: string
  formatHintAudio: string
  formatHintRemux: string
  formatHintConvert: string
  progressCellEta: string
  failureParensSignal: string
  failureParensCode: string
  failureKindTransientNetwork: string
  failureKindSourceBlock: string
  failureKindBadOptions: string
  failureKindNeedsRestart: string
  failureKindDownloadLimit: string
}

export const YTDLP_QUEUE_PROGRESS_STRINGS_RU: YtdlpQueueProgressStrings = {
  progressPlaylist: 'плейлист {a}/{b}',
  progressFragment: 'фрагмент {a}/{b}',
  progressPauseSec: 'пауза {sec} с',
  progressWaitingReconnect: 'ожидание переподключения',
  progressHlsManifest: 'манифест HLS',
  progressPlayerMetadata: 'метаданные API плеера',
  progressWebpage: 'веб-страница',
  progressWaiting: 'ожидание',
  progressResume: 'продолжение загрузки',
  progressRetryFragment: 'повтор фрагмента {frag} · {a}/{b}',
  progressRetry: 'повтор {a}/{b}',
  progressRetryInSec: 'повтор через {sec} с',
  progressPlaylistSkip: 'пропуск {a}/{b}',
  progressRenameFailed: 'не удалось переименовать',
  progressFormatSelect: 'формат {ids}',
  progressAlreadyDownloaded: 'уже скачано',
  progressGivingUpRetries: 'отмена · попытки {n}',
  progressWritingThumbnail: 'миниатюра',
  progressWritingSubtitles: 'субтитры',
  progressWritingMetadata: 'метаданные',
  progressRateLimitSleep: 'лимит скорости · пауза {sec} с',
  progressDeletingOriginal: 'удаление исходника',
  progressPostMerge: 'слияние форматов',
  progressPostAudio: 'извлечение аудио',
  progressPostRemux: 'перепаковка',
  progressPostConvert: 'перекодирование',
  progressPostEmbedSubtitle: 'встраивание субтитров',
  progressPostEmbedThumbnail: 'миниатюра в файл',
  progressPostMetadataEmbed: 'метаданные в файл',
  progressPostConcat: 'склейка',
  progressPostMoveFile: 'перемещение',
  progressPostFixup: 'исправление контейнера',
  progressPostSponsorBlock: 'SponsorBlock',
  progressPostSubConvert: 'конвертация субтитров',
  progressPostProcessing: 'постобработка ffmpeg',
  progressPostFfmpegDestination: 'ffmpeg · запись',
  formatHintMerge: 'слияние',
  formatHintAudio: 'аудио',
  formatHintRemux: 'перепаковка (remux)',
  formatHintConvert: 'перекодирование (convert)',
  progressCellEta: 'Осталось {eta}',
  failureParensSignal: '(сигнал {signal})',
  failureParensCode: '(код {code})',
  failureKindTransientNetwork: ' · вероятно сеть',
  failureKindSourceBlock: ' · отказ источника',
  failureKindBadOptions: ' · ошибка параметров',
  failureKindNeedsRestart: ' · нужен перезапуск yt-dlp',
  failureKindDownloadLimit: ' · лимит загрузок'
}

export const YTDLP_QUEUE_PROGRESS_STRINGS_EN: YtdlpQueueProgressStrings = {
  progressPlaylist: 'playlist {a}/{b}',
  progressFragment: 'fragment {a}/{b}',
  progressPauseSec: 'pause {sec} s',
  progressWaitingReconnect: 'waiting for reconnect',
  progressHlsManifest: 'HLS manifest',
  progressPlayerMetadata: 'player metadata',
  progressWebpage: 'webpage',
  progressWaiting: 'waiting',
  progressResume: 'resuming download',
  progressRetryFragment: 'retry fragment {frag} · {a}/{b}',
  progressRetry: 'retry {a}/{b}',
  progressRetryInSec: 'retry in {sec} s',
  progressPlaylistSkip: 'skip {a}/{b}',
  progressRenameFailed: 'rename failed',
  progressFormatSelect: 'format {ids}',
  progressAlreadyDownloaded: 'already downloaded',
  progressGivingUpRetries: 'giving up · {n} retries',
  progressWritingThumbnail: 'thumbnail',
  progressWritingSubtitles: 'subtitles',
  progressWritingMetadata: 'metadata',
  progressRateLimitSleep: 'rate limit · pause {sec} s',
  progressDeletingOriginal: 'deleting original',
  progressPostMerge: 'merging formats',
  progressPostAudio: 'extracting audio',
  progressPostRemux: 'remuxing',
  progressPostConvert: 'converting',
  progressPostEmbedSubtitle: 'embedding subtitles',
  progressPostEmbedThumbnail: 'embedding thumbnail',
  progressPostMetadataEmbed: 'embedding metadata',
  progressPostConcat: 'concatenating',
  progressPostMoveFile: 'moving file',
  progressPostFixup: 'container fixup',
  progressPostSponsorBlock: 'SponsorBlock',
  progressPostSubConvert: 'subtitle conversion',
  progressPostProcessing: 'ffmpeg post-processing',
  progressPostFfmpegDestination: 'ffmpeg · writing',
  formatHintMerge: 'merge',
  formatHintAudio: 'audio',
  formatHintRemux: 'remux',
  formatHintConvert: 'convert',
  progressCellEta: 'ETA {eta}',
  failureParensSignal: '(signal {signal})',
  failureParensCode: '(code {code})',
  failureKindTransientNetwork: ' · likely network',
  failureKindSourceBlock: ' · source blocked',
  failureKindBadOptions: ' · bad options',
  failureKindNeedsRestart: ' · restart yt-dlp required',
  failureKindDownloadLimit: ' · download limit'
}

export function getYtdlpQueueProgressStrings(
  locale: AppUiLocale
): YtdlpQueueProgressStrings {
  return locale === 'en' ? YTDLP_QUEUE_PROGRESS_STRINGS_EN : YTDLP_QUEUE_PROGRESS_STRINGS_RU
}
