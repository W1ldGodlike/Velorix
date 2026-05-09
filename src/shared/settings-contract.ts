/**
 * Сериализуемый срез `settings.json` §4.1 / §3 / §6 / §7 (без парсеров и I/O).
 * Используется preload и main; поля опциональны для совместимости со старыми файлами.
 */

import type { EnginePathOverrides } from './engine-contract'

export type AppTheme = 'dark' | 'light'

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
}

export interface AppSettings {
  /** Тема хранится в main, чтобы меню, renderer и будущие окна не расходились между собой. */
  theme: AppTheme
  /** §4.1: последний успешно открытый локальный файл для мягкого восстановления сессии. */
  lastOpenedSourcePath?: string
  /** §3: полные пути к exe движков; имеют приоритет над bundled и userData/bin. */
  engineExecutablePaths?: EnginePathOverrides
  /** §4.1: последние размеры/позиции отдельных окон (main + менеджер загрузок). */
  windowBounds?: WindowBoundsConfig
  /** §6.2: абсолютный каталог для `-o` yt-dlp; если нет — `userData/downloads/ytdlp`. */
  ytdlpDownloadDirectory?: string
  /** §6.2: относительный шаблон `-o` внутри каталога загрузки; см. `ytdlp-download-options`. */
  ytdlpFilenameTemplate?: string
  /** §6.2: пресет `-f` (`default` | `merge_bv_ba` | `best_single` и др.). */
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
  /** §7.2: режим аудио экспорта: AAC или без аудиодорожки. */
  ffmpegExportAudioMode?: 'aac' | 'none'
  /** §7.2: битрейт AAC одним argv-токеном (`128k`, `192k`, `320k`). */
  ffmpegExportAudioBitrate?: string
  /** §7.2: FPS вывода; отсутствует — исходная частота. */
  ffmpegExportFps?: number
  /** §7.2: preset масштабирования с сохранением пропорций. */
  ffmpegExportScalePreset?: 'source' | '480p' | '720p' | '1080p'
  /** §7: последняя папка успешного ffmpeg export; используется только как defaultPath save dialog. */
  ffmpegExportDirectory?: string
  /** §7.6: последняя папка успешного снимка кадра; используется как defaultPath save dialog. */
  ffmpegSnapshotDirectory?: string
  /** §7.6: формат снимка кадра по умолчанию. */
  ffmpegSnapshotFormat?: 'png' | 'jpg'
}
