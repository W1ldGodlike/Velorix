import type { DownloadsWindowUiLocale } from './downloads-window-ui-locale'

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

const RU: YtdlpQueueProgressStrings = {
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

const EN: YtdlpQueueProgressStrings = {
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
  locale: DownloadsWindowUiLocale
): YtdlpQueueProgressStrings {
  return locale === 'en' ? EN : RU
}
