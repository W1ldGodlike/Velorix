import type {
  YtdlpCookiesBrowserId,
  YtdlpFormatPresetId,
  YtdlpImpersonateId,
  YtdlpQueueRetryProfileId,
  YtdlpSubtitlePresetId
} from '../shared/ytdlp-download-contract'

/** Шаблон по умолчанию совпадает с тем, что раньше был захардкожен в `runYtdlpOnce`. */
/** Без суффикса `[id]` в имени файла — он выглядел как артефакт; `%(id)s` при необходимости вручную в шаблоне. */
export const YTDLP_DEFAULT_FILENAME_TEMPLATE = '%(title)s.%(ext)s'

export interface YtdlpRunOptionsSnapshot {
  filenameTemplate: string
  formatPreset: YtdlpFormatPresetId
  /** Дополнительные аргументы yt-dlp перед `-o` (уже разобранные токены, без shell). */
  formatExtraArgs: string[]
  /** Передаётся в spawn как `--yes-playlist`; иначе `--no-playlist`. */
  downloadPlaylist: boolean
  /** `-x --audio-format best`; `-f` из пресета при этом не добавляется. */
  audioOnly: boolean
  /** §6.2: только whitelist; строка языков без пробелов для `--sub-langs`. */
  subtitlePreset: YtdlpSubtitlePresetId
  /** Токен для argv при активном пресете и непустой строке. */
  subLangs: string
  /** Строка из настроек для поля UI (пусто если в JSON был мусор). */
  subLangsLine: string
  /** Исходная строка из UI/settings для редактирования §6.3. */
  extraArgsLine: string
  /** Уже проверенные токены; при ошибке чтения JSON — пусто, см. `extraArgsParseWarning`. */
  extraArgs: string[]
  /** Если строка из файла не прошла parse — показываем в UI, runner игнорирует extras. */
  extraArgsParseWarning: string | null
  /** §6.2 — путь для `--cookies`, только если файл на диске доступен. */
  cookiesArgvFile: string | null
  /** §6.2 — только если нет рабочего файла cookies. */
  cookiesArgvBrowser: YtdlpCookiesBrowserId | null
  /** §6.2 — валидированный суффикс после `BROWSER:`; только вместе с `cookiesArgvBrowser`. */
  cookiesArgvBrowserProfile: string | null
  /** Путь из settings для подписи в UI (может быть битым). */
  cookiesFilePathStored: string
  /** Выбор в UI (может сосуществовать с файлом в JSON до сохранения). */
  cookiesBrowserChoice: 'none' | YtdlpCookiesBrowserId
  /** Строка для поля «профиль/контейнер» в UI (из settings, после trim при успешной валидации). */
  cookiesBrowserProfileLine: string
  cookiesWarning: string | null
  /** §6.2 — только whitelist; null если выключено. */
  impersonateTarget: YtdlpImpersonateId | null
  impersonateChoice: 'none' | YtdlpImpersonateId
  /** §6.2 `--limit-rate`; один безопасный токен, пусто — без лимита. */
  rateLimit: string
  /** §6.2 `--retries`; null — дефолт yt-dlp. */
  retries: number | null
  retriesLine: string
  /** §6.4 `--fragment-retries`; null — дефолт yt-dlp. */
  fragmentRetries: number | null
  fragmentRetriesLine: string
  /** §6.4 — повтор запуска той же строки очереди при ошибке (не `--retries`). */
  queueRetryProfile: YtdlpQueueRetryProfileId
  /** §6.4 — после успешной загрузки открыть файл в главном окне (runner). */
  openInHandlerOnComplete: boolean
  /** §6.4 — после успешного авто-открытия запустить ffmpeg-экспорт (runner + main). */
  autoExportAfterOpenInHandler: boolean
  /** §7.4 — после успеха добавить файл в пакетный экспорт. */
  enqueueBatchOnDownloadComplete: boolean
  /** §7.4 — запустить пакет после добавления. */
  autoStartBatchAfterEnqueue: boolean
}

export function formatPresetToExtraArgs(id: YtdlpFormatPresetId): string[] {
  if (id === 'editor_mp4') {
    return [
      '-f',
      'bv*[ext=mp4][vcodec^=avc1]+ba[ext=m4a][acodec^=mp4a]/b[ext=mp4]/best[ext=mp4]/best',
      '--merge-output-format',
      'mp4'
    ]
  }
  if (id === 'merge_bv_ba') {
    return ['-f', 'bv*+ba/b']
  }
  if (id === 'best_single') {
    return ['-f', 'best']
  }
  return []
}
