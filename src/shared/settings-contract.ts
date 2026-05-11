/**
 * Сериализуемый срез `settings.json` §4.1 / §3 / §6 / §7 (без парсеров и I/O).
 * Используется preload и main; поля опциональны для совместимости со старыми файлами.
 */

import type { EnginePathOverrides } from './engine-contract'
import type {
  FfmpegExportCropPresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportUserPreset,
  FfmpegExportVideoTransformId
} from './ffmpeg-export-contract'

/** Эффективная light/dark-палитра для CSS (`data-theme`) и вторичных окон. */
export type ResolvedAppTheme = 'dark' | 'light'

/** Сохраняемое предпочтение: явная палитра или следование Electron `nativeTheme`. */
export type AppTheme = ResolvedAppTheme | 'system'

/** §4.1 — прямоугольник окна в экранных координатах (DIP). */
export interface StoredWindowRect {
  x: number
  y: number
  width: number
  height: number
}

export interface WindowBoundsConfig {
  main?: StoredWindowRect
  downloads?: StoredWindowRect
  inspector?: StoredWindowRect
}

/**
 * §4.1 / v0 — раскрытие collapsible в главном окне (React `details` FFmpeg / быстрый yt-dlp).
 * Не заданные ключи при отображении трактуются как дефолты в renderer.
 */
export interface MainWindowUiPanelState {
  /** §4.1 / v0 — видимость правой колонки «Настройки FFmpeg»; `false` — только превью (больше места под таймлайн). */
  ffmpegSettingsRailOpen?: boolean
  quickYtdlp?: boolean
  ffmpegVideo?: boolean
  ffmpegFormat?: boolean
  ffmpegAudio?: boolean
  ffmpegPresets?: boolean
  ffmpegOutput?: boolean
  /** §4.1 / v0 — блок превью argv ffmpeg в секции «Вывод». */
  exportCommandPreview?: boolean
  /** §4.1 / §9 — раскрытие `details` инспектора под превью. */
  probeExportSummary?: boolean
  probeTracks?: boolean
  probeChapters?: boolean
  probeRawJson?: boolean
}

/** §4.1 / v0 — раскрытие секций окна загрузок (data HTML + `details`). */
export interface DownloadsWindowUiPanelState {
  history?: boolean
  log?: boolean
  format?: boolean
  metadata?: boolean
  saving?: boolean
  network?: boolean
  expert?: boolean
  hints?: boolean
}

export interface AppSettings {
  /** Тема хранится в main; `system` синхронизируется с `nativeTheme.shouldUseDarkColors`. */
  theme: AppTheme
  /** §4.1: последний успешно открытый локальный файл для мягкого восстановления сессии. */
  lastOpenedSourcePath?: string
  /** §3: полные пути к exe движков; имеют приоритет над bundled и userData/bin. */
  engineExecutablePaths?: EnginePathOverrides
  /** §4.1: последние размеры/позиции окон (main, менеджер загрузок, инспектор §9). */
  windowBounds?: WindowBoundsConfig
  /** §6.2: абсолютный каталог для `-o` yt-dlp; если нет — `userData/downloads/ytdlp`. */
  ytdlpDownloadDirectory?: string
  /** §6.2: относительный шаблон `-o` внутри каталога загрузки; см. `ytdlp-download-options`. */
  ytdlpFilenameTemplate?: string
  /** §6.2: пресет `-f` (`editor_mp4` | `default` | `merge_bv_ba` | `best_single` и др.). */
  ytdlpFormatPreset?: string
  /** §6.2: с `--yes-playlist` скачивать весь плейлист (иначе `--no-playlist`). */
  ytdlpDownloadPlaylist?: boolean
  /** §6.2: извлечение аудио `-x` (нужен ffmpeg рядом с yt-dlp). */
  ytdlpAudioOnly?: boolean
  /** §6.2: пресет субтитров (`--write-subs` / автосубы); если нет — режим «выкл». */
  ytdlpSubtitlePreset?: 'manual' | 'manual_auto'
  /** §6.2: необязательный фильтр `--sub-langs` (один токен без пробелов). */
  ytdlpSubLangs?: string
  /** §6.2: абсолютный путь к Netscape cookies (`--cookies`). */
  ytdlpCookiesFile?: string
  /** §6.2: `--cookies-from-browser` для ограниченного whitelist (если нет файла). */
  ytdlpCookiesBrowser?: 'chrome' | 'edge' | 'firefox'
  /** §6.2: клиент для `--impersonate` (ограниченный whitelist). */
  ytdlpImpersonate?: 'chrome' | 'edge' | 'firefox'
  /** §6.2: ограничение скорости `--limit-rate` одним безопасным токеном (`500K`, `2M`). */
  ytdlpRateLimit?: string
  /** §6.2: количество повторов `--retries`; отсутствует — дефолт yt-dlp. */
  ytdlpRetries?: number
  /** §6.4: количество повторов фрагментов `--fragment-retries`; отсутствует — дефолт yt-dlp. */
  ytdlpFragmentRetries?: number
  /** §6.3: дополнительные аргументы yt-dlp одной строкой (токены через пробел). */
  ytdlpExtraArgsLine?: string
  /** §6.4: профиль повторов всей строки очереди при ненулевом exit code (не путать с `--retries`). */
  ytdlpQueueRetryProfile?: 'off' | 'light' | 'normal' | 'persistent'
  /** §6.4: после успешной загрузки автоматически открыть файл в главном окне обработки (preview). */
  ytdlpOpenInHandlerOnComplete?: boolean
  /** §7.2: системный пресет экспорта MP4 (libx264 CRF + `-preset`). */
  ffmpegExportEncodePreset?: string
  /** §7.2: контейнер экспорта по умолчанию. */
  ffmpegExportContainer?: 'mp4' | 'mkv' | 'mov'
  /** §7.2: явный CRF libx264 0..51; если отсутствует — CRF берётся из пресета. */
  ffmpegExportCrf?: number
  /** §7.2: video bitrate одним argv-токеном; если задан — заменяет CRF mode. */
  ffmpegExportVideoBitrate?: string
  /** §7.2 / v0 — двухпроходное libx264 (только вместе с `ffmpegExportVideoBitrate`, не с CRF). */
  ffmpegExportTwoPass?: boolean
  /** §7.2: режим аудио экспорта: AAC или без аудиодорожки. */
  ffmpegExportAudioMode?: 'aac' | 'none'
  /** §7.2: битрейт AAC одним argv-токеном (`128k`, `192k`, `320k`). */
  ffmpegExportAudioBitrate?: string
  /** §7.2: FPS вывода; отсутствует — исходная частота. */
  ffmpegExportFps?: number
  /** §7.2: preset масштабирования с сохранением пропорций. */
  ffmpegExportScalePreset?: 'source' | '480p' | '720p' | '1080p'
  /** §7.2: поворот/зеркало экспортируемого видео (whitelist фильтров). */
  ffmpegExportVideoTransform?: FfmpegExportVideoTransformId
  /** §7.2: crop экспортируемого видео (whitelist пресетов, без произвольного `-vf`). */
  ffmpegExportCropPreset?: FfmpegExportCropPresetId
  /** §7.2: целочисленный сдвиг громкости в дБ (`-filter:a volume=NdB`); 0/нет — без фильтра. */
  ffmpegExportAudioGainDb?: number
  /** §7.2: удалить контейнерные метаданные (`-map_metadata -1`). */
  ffmpegExportStripMetadata?: boolean
  /** §7.2: удалить chapter markers (`-map_chapters -1`). */
  ffmpegExportStripChapters?: boolean
  /** §7.2: поведение субтитров на экспорте (`drop` по умолчанию = не пишем поле). */
  ffmpegExportSubtitleMode?: FfmpegExportSubtitleModeId
  /** §7.2: пользовательские пресеты экспорта (имя + снимок параметров тулбара). */
  ffmpegExportUserPresets?: FfmpegExportUserPreset[]
  /** §7: последняя папка успешного ffmpeg export; используется только как defaultPath save dialog. */
  ffmpegExportDirectory?: string
  /** §7.6: последняя папка успешного снимка кадра; используется как defaultPath save dialog. */
  ffmpegSnapshotDirectory?: string
  /** §7.6: формат снимка кадра по умолчанию. */
  ffmpegSnapshotFormat?: 'png' | 'jpg'
  /** §4.1 — сохранённое раскрытие панелей главного окна (см. `MainWindowUiPanelState`). */
  mainWindowUiPanels?: MainWindowUiPanelState
  /** §4.1 — сохранённое раскрытие панелей окна yt-dlp. */
  downloadsWindowUiPanels?: DownloadsWindowUiPanelState
}

/** Ответ IPC `settingsGet` / `settingsSetTheme`: `effectiveTheme` не пишется в `settings.json`. */
export type AppSettingsView = AppSettings & { effectiveTheme: ResolvedAppTheme }
