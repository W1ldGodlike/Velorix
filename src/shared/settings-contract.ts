/**
 * Сериализуемый срез `settings.json` §4.1 / §3 / §6 / §7 (без парсеров и I/O).
 * Используется preload и main; поля опциональны для совместимости со старыми файлами.
 */

import type { EditorUrlPasteBehaviorId } from './editor-url-paste-behavior'
import type { EnginePathOverrides } from './engine-contract'
import type { AppUiLocale } from './app-ui-locale'
import type {
  FfmpegExportAudioNormalizeId,
  FfmpegExportCropPresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportUserPreset,
  FfmpegExportVideoCodecId,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoDeinterlaceId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoVignetteId,
  FfmpegExportVideoSharpenId,
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
  /** §7.3 — панель пакетного экспорта над workbench. */
  batchExport?: boolean
  ffmpegVideo?: boolean
  ffmpegFormat?: boolean
  ffmpegAudio?: boolean
  ffmpegPresets?: boolean
  /** §11 — блок «Сценарий» в правой панели FFmpeg. */
  workflowScenario?: boolean
  ffmpegOutput?: boolean
  /** §4.1 / v0 — блок превью argv ffmpeg в секции «Вывод». */
  exportCommandPreview?: boolean
  /** §13 — журнал завершённых обработок FFmpeg в правой панели главного окна. */
  processingHistory?: boolean
  /** §4.1 / §9 — раскрытие секций сводки ffprobe (окно инспектора; те же ключи влияют на раскрытие блоков там). */
  probeExportSummary?: boolean
  probeTracks?: boolean
  probeChapters?: boolean
  probeRawJson?: boolean
}

/** Сколько карточек показывать в панели истории загрузок (вкладка и отдельное окно). */
export type DownloadsHistoryListMode = 'compact' | 'full'

/** §4.1 / v0 — раскрытие секций окна загрузок (React `#downloads`). */
export interface DownloadsWindowUiPanelState {
  history?: boolean
  log?: boolean
  format?: boolean
  metadata?: boolean
  saving?: boolean
  network?: boolean
  expert?: boolean
  hints?: boolean
  historyListMode?: DownloadsHistoryListMode
}

export interface AppSettings {
  /** Тема хранится в main; `system` синхронизируется с `nativeTheme.shouldUseDarkColors`. */
  theme: AppTheme
  /** Язык интерфейса (main-меню, строки IPC, окно загрузок по умолчанию); при отсутствии — эвристика как в renderer. */
  uiLocale?: AppUiLocale
  /** §4.1: последний успешно открытый локальный файл для мягкого восстановления сессии. */
  lastOpenedSourcePath?: string
  /** §3: полные пути к exe движков; имеют приоритет над bundled и app-data/bin. */
  engineExecutablePaths?: EnginePathOverrides
  /** §4.1: последние размеры/позиции окон (main, менеджер загрузок, инспектор §9). */
  windowBounds?: WindowBoundsConfig
  /** §6.2: абсолютный каталог для `-o` yt-dlp; если нет — `app-data/downloads/ytdlp`. */
  ytdlpDownloadDirectory?: string
  /** §6.2: относительный шаблон `-o` внутри каталога загрузки; см. `ytdlp-download-options`. */
  ytdlpFilenameTemplate?: string
  /** §6.2: пресет `-f` (`editor_mp4` | `default` | `merge_bv_ba` | `best_single` и др.). */
  ytdlpFormatPreset?: string
  /** §14 (Windows): пункты «Открыть в FluxAlloy» / Quick MP4 в контекстном меню видео. */
  windowsExplorerContextMenu?: boolean
  /** §14 — «Открыть с помощью» для видео (HKCU OpenWithProgids). */
  windowsOpenWithFluxAlloy?: boolean
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
  /** §6.2: суффикс после двоеточия в `--cookies-from-browser BROWSER:…` (профиль/контейнер yt-dlp). */
  ytdlpCookiesBrowserProfile?: string
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
  /** §6.4: после успешного авто-открытия в обработчике запустить ffmpeg-экспорт в соседний файл (параметры §7.2). */
  ytdlpAutoExportAfterOpenInHandler?: boolean
  /** §7.4: после успешной загрузки добавить видео в очередь пакетного экспорта. */
  ytdlpEnqueueBatchOnDownloadComplete?: boolean
  /** §7.4: после добавления в пакет автоматически запустить batch. */
  ytdlpAutoStartBatchAfterEnqueue?: boolean
  /** §7.2: системный пресет экспорта (CRF/preset для libx264/libx265). */
  ffmpegExportEncodePreset?: string
  /** §7.2: видеокодек экспорта (`libx264` по умолчанию — поле можно не писать). */
  ffmpegExportVideoCodec?: FfmpegExportVideoCodecId
  /** §7.2: контейнер экспорта по умолчанию. */
  ffmpegExportContainer?: 'mp4' | 'mkv' | 'mov'
  /** §7.2: явный CRF libx264 0..51; если отсутствует — CRF берётся из пресета. */
  ffmpegExportCrf?: number
  /** §7.2: video bitrate одним argv-токеном; если задан — заменяет CRF mode. */
  ffmpegExportVideoBitrate?: string
  /** §7.2 / v0 — двухпроходное libx264 (только вместе с `ffmpegExportVideoBitrate`, не с CRF). */
  ffmpegExportTwoPass?: boolean
  /** §7.3 — экономный режим: `-threads 1` в argv ffmpeg. */
  ffmpegExportEconomyMode?: boolean
  /** §16 / ТЗ — порог пиковой загрузки CPU (%) для «Рекомендовано» в бенчмарке; по умолчанию 80. */
  ffmpegExportBenchmarkLoadThresholdPercent?: number
  /** §7.2 — аппаратное декодирование исходника (`-hwaccel`) при экспорте. */
  ffmpegExportHwDecode?: boolean
  /** §7.2 — дополнительные argv ffmpeg перед выходным файлом (пробелы между токенами). */
  ffmpegExportExtraArgsLine?: string
  /** §7.3 — шаблон имени выхода пакета (`{stem}`, `{name}`, `{ext}`); без расширения контейнера. */
  ffmpegExportBatchOutputSuffix?: string
  /** §7.3 — абсолютная папка для готовых файлов пакета; не задано — рядом с каждым источником. */
  ffmpegExportBatchOutputDirectory?: string
  /** §4.6 / §7.4 — глобальная вставка URL: менеджер загрузок или скачать в редактор. */
  editorUrlPasteBehavior?: EditorUrlPasteBehaviorId
  /** §7.2: режим аудио экспорта: AAC, PCM s16le или без дорожки. */
  ffmpegExportAudioMode?:
    | 'aac'
    | 'libmp3lame'
    | 'ac3'
    | 'copy'
    | 'pcm_s16le'
    | 'libvorbis'
    | 'libopus'
    | 'flac'
    | 'alac'
    | 'none'
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
  /** §7.2: пресет `hqdn3d` (`off` по умолчанию = не пишем поле). */
  ffmpegExportVideoDenoise?: FfmpegExportVideoDenoiseId
  /** §7.2: пресет `deband` (`off` по умолчанию = не пишем поле). */
  ffmpegExportVideoDeband?: FfmpegExportVideoDebandId
  /** §7.2: пресет `histeq` (`off` по умолчанию = не пишем поле). */
  ffmpegExportVideoHisteq?: FfmpegExportVideoHisteqId
  /** §7.2: bundled `lut3d` (`off` по умолчанию = не пишем поле). */
  ffmpegExportVideoLut3d?: FfmpegExportVideoLut3dId
  /** §7.2: пресет `unsharp` (`off` по умолчанию = не пишем поле). */
  ffmpegExportVideoSharpen?: FfmpegExportVideoSharpenId
  /** §7.2: пресет `eq=...` (`off` по умолчанию = не пишем поле). */
  ffmpegExportVideoEqPreset?: FfmpegExportVideoEqPresetId
  /** §7.2: пресет `hue` после `eq` (`off` по умолчанию = не пишем поле). */
  ffmpegExportVideoHue?: FfmpegExportVideoHueId
  /** §7.2: пресет `noise` — зернистость (`off` по умолчанию = не пишем поле). */
  ffmpegExportVideoGrain?: FfmpegExportVideoGrainId
  /** §7.2: пресет `vignette` (`off` по умолчанию = не пишем поле). */
  ffmpegExportVideoVignette?: FfmpegExportVideoVignetteId
  /** §7.2: пресет `gblur` (`off` по умолчанию = не пишем поле). */
  ffmpegExportVideoBlur?: FfmpegExportVideoBlurId
  /** §7.2: деинтерлейс `yadif` (`off` по умолчанию = не пишем поле). */
  ffmpegExportVideoDeinterlace?: FfmpegExportVideoDeinterlaceId
  /** §7.2: пресет аудио-нормализации (`off` по умолчанию = не пишем поле). */
  ffmpegExportAudioNormalize?: FfmpegExportAudioNormalizeId
  /** §7.2: пользовательские пресеты экспорта (имя + снимок параметров тулбара). */
  ffmpegExportUserPresets?: FfmpegExportUserPreset[]
  /** §7: последняя папка успешного ffmpeg export; используется только как defaultPath save dialog. */
  ffmpegExportDirectory?: string
  /** §7.6: последняя папка успешного снимка кадра; используется как defaultPath save dialog. */
  ffmpegSnapshotDirectory?: string
  /** §7.6: формат снимка кадра по умолчанию. */
  ffmpegSnapshotFormat?: 'png' | 'jpg' | 'webp'
  /** §17: AviSynth/VapourSynth скрипт в `-vf` экспорта (`off` — поле не пишем). */
  ffmpegExportExternalFilterKind?: 'off' | 'avisynth' | 'vapoursynth'
  /** §17: абсолютный путь к `.avs` / `.vpy`. */
  ffmpegExportExternalFilterScriptPath?: string
  /** §4.1 — сохранённое раскрытие панелей главного окна (см. `MainWindowUiPanelState`). */
  mainWindowUiPanels?: MainWindowUiPanelState
  /** §4.1 — сохранённое раскрытие панелей окна yt-dlp. */
  downloadsWindowUiPanels?: DownloadsWindowUiPanelState
}

/** Ответ IPC `settingsGet` / `settingsSetTheme`: `effectiveTheme` не пишется в `settings.json`. */
export type AppSettingsView = AppSettings & { effectiveTheme: ResolvedAppTheme }
