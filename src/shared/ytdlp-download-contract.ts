/**
 * IPC/persisted типы окна yt-dlp §6.2–§6.4 и связанных whitelist-идентификаторов.
 * Реализация парсеров и сборки argv остаётся в main (`ytdlp-download-options`, `ytdlp-extra-args`).
 */

import type { DownloadsWindowUiLocale } from './downloads-window-ui-locale'

/** Белый список режимов субтитров §6.2 (без произвольных флагов в UI). */
export type YtdlpSubtitlePresetId = 'none' | 'manual' | 'manual_auto'

/** §6.2 — только распространённые движки для `--cookies-from-browser`. */
export type YtdlpCookiesBrowserId = 'chrome' | 'edge' | 'firefox'

/** §6.2 — whitelist целей `--impersonate` без версионирования. */
export type YtdlpImpersonateId = 'chrome' | 'edge' | 'firefox'

/** §6.4 — повторы на уровне очереди (отдельно от `--retries` yt-dlp). */
export type YtdlpQueueRetryProfileId = 'off' | 'light' | 'normal' | 'persistent'

/**
 * Упрощённый выбор «качества» без произвольного `-f` от пользователя §6.2;
 * только белый список параметров.
 */
export type YtdlpFormatPresetId = 'editor_mp4' | 'default' | 'merge_bv_ba' | 'best_single'

/** Компактная запись для окна загрузок §6.3 (из `Data/ytdlp_commands.json`). */
export interface YtdlpCommandHintEntry {
  token: string
  summary: string
  /** Группа для `<optgroup>`; из JSON или встроенная карта в main. */
  category: string
}

/** То, что видит окно загрузок: текущие значения и метки для `<select>`. */
export interface YtdlpDownloadOptionsPayload {
  filenameTemplate: string
  defaultFilenameTemplate: string
  formatPreset: YtdlpFormatPresetId
  formatPresetChoices: Array<{ id: YtdlpFormatPresetId; label: string }>
  downloadPlaylist: boolean
  audioOnly: boolean
  subtitlePreset: YtdlpSubtitlePresetId
  /** Редактируемое значение `--sub-langs` в окне загрузок. */
  subLangsLine: string
  extraArgsLine: string
  /** Превью полной командной строки (`yt-dlp …`) с безопасным примером URL и текущим каталогом. */
  commandPreview: string
  extraArgsParseWarning: string | null
  /** Подсказки для поля доп. аргументов §6.3 (из `Data/ytdlp_commands.json`). */
  commandHints: YtdlpCommandHintEntry[]
  cookiesBrowserChoice: 'none' | YtdlpCookiesBrowserId
  /** §6.2 — строка для поля «профиль/контейнер» (суффикс к `--cookies-from-browser`). */
  cookiesBrowserProfileLine: string
  cookiesFilePathStored: string
  cookiesWarning: string | null
  impersonateChoice: 'none' | YtdlpImpersonateId
  rateLimit: string
  retriesLine: string
  fragmentRetriesLine: string
  queueRetryProfile: YtdlpQueueRetryProfileId
  queueRetryProfileChoices: Array<{ id: YtdlpQueueRetryProfileId; label: string }>
  /** §6.4 — после успеха yt-dlp открыть результат в preview главного окна без ручного «В обработчик». */
  openInHandlerOnComplete: boolean
  /** §6.4 — после успешного авто-открытия запустить экспорт §7.2 в `…-export` рядом с файлом. */
  autoExportAfterOpenInHandler: boolean
}

/**
 * Запрос превью argv §6.3: опционально другой каталог `-o` и черновик полей формы без записи в settings.json.
 */
export interface YtdlpGetCliOptionsParams {
  previewOutputDirectory?: string
  draft?: YtdlpDownloadOptionsPatch
  /** Renderer-driven locale (e.g. `navigator.language`); overrides Electron app locale for hints. */
  uiLocale?: DownloadsWindowUiLocale
}

export interface YtdlpDownloadOptionsPatch {
  filenameTemplate?: string
  formatPreset?: YtdlpFormatPresetId
  downloadPlaylist?: boolean
  audioOnly?: boolean
  subtitlePreset?: YtdlpSubtitlePresetId
  subLangs?: string
  /** §6.2 `none` или whitelist браузера; при сохранении отличного от «нет» сбрасывает файл cookies. */
  cookiesBrowser?: 'none' | YtdlpCookiesBrowserId
  /** §6.2 — суффикс `BROWSER:…` для `--cookies-from-browser`; пустая строка удаляет сохранённое значение. */
  cookiesBrowserProfile?: string
  /** §6.2 `--impersonate` только chrome / edge / firefox. */
  impersonate?: 'none' | YtdlpImpersonateId
  rateLimit?: string
  retriesLine?: string
  fragmentRetriesLine?: string
  extraArgsLine?: string
  /** §6.4 — профиль `off` | `light` | `normal` | `persistent`. */
  queueRetryProfile?: YtdlpQueueRetryProfileId
  /** §6.4 — авто-открытие скачанного файла в обработчике после успешной строки очереди. */
  openInHandlerOnComplete?: boolean
  /** §6.4 — авто-экспорт после успешного авто-открытия (только вместе с `openInHandlerOnComplete`). */
  autoExportAfterOpenInHandler?: boolean
}
