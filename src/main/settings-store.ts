import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, isAbsolute, normalize } from 'path'

import type { EngineId, EnginePathOverrides } from './engine-service'
import { parseYtdlpQueueRetryProfile } from './ytdlp-queue-retry'

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
  ytdlpQueueRetryProfile?: 'off' | 'light' | 'normal'
  /** §7.2: системный пресет экспорта MP4 (libx264 CRF + `-preset`). */
  ffmpegExportEncodePreset?: string
  // TODO(§4.6): язык, hotkeys.
}

function parseStoredWindowRect(raw: unknown): StoredWindowRect | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const o = raw as Record<string, unknown>
  const x = Number(o.x)
  const y = Number(o.y)
  const width = Number(o.width)
  const height = Number(o.height)
  if (![x, y, width, height].every(Number.isFinite)) {
    return undefined
  }
  if (width < 320 || height < 240 || width > 16384 || height > 16384) {
    return undefined
  }
  return { x, y, width, height }
}

function parseWindowBoundsConfig(raw: unknown): WindowBoundsConfig | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const o = raw as Record<string, unknown>
  const main = parseStoredWindowRect(o.main)
  const downloads = parseStoredWindowRect(o.downloads)
  if (!main && !downloads) {
    return undefined
  }
  const cfg: WindowBoundsConfig = {}
  if (main) {
    cfg.main = main
  }
  if (downloads) {
    cfg.downloads = downloads
  }
  return cfg
}

function parseEngineExecutablePaths(raw: unknown): EnginePathOverrides | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const src = raw as Record<string, unknown>
  const ids: EngineId[] = ['ffmpeg', 'ffprobe', 'yt-dlp']
  const out: EnginePathOverrides = {}
  for (const id of ids) {
    const v = src[id]
    if (typeof v === 'string' && v.trim() !== '') {
      out[id] = v.trim()
    }
  }
  return Object.keys(out).length > 0 ? out : undefined
}

function parseYtdlpDownloadDirectory(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return undefined
  }
  const n = normalize(raw.trim())
  return isAbsolute(n) ? n : undefined
}

function parseYtdlpFilenameTemplate(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return undefined
  }
  const t = raw.trim()
  return t.length <= 480 ? t : t.slice(0, 480)
}

function parseYtdlpFormatPresetStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return undefined
  }
  return raw.trim().slice(0, 64)
}

function parseYtdlpExtraArgsLineStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim()
  if (t.length === 0) {
    return undefined
  }
  return t.length <= 2000 ? t : t.slice(0, 2000)
}

function parseYtdlpSubtitlePresetStored(raw: unknown): 'manual' | 'manual_auto' | undefined {
  if (raw === 'manual' || raw === 'manual_auto') {
    return raw
  }
  return undefined
}

/** Только безопасный алфавит для одного argv-токена `--sub-langs` (без пробелов/shell). */
function parseYtdlpSubLangsStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim()
  if (t.length === 0 || t.length > 160) {
    return undefined
  }
  if (!/^[a-zA-Z0-9.,*+\-_]+$/.test(t)) {
    return undefined
  }
  return t
}

function parseYtdlpCookiesFileStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return undefined
  }
  const n = normalize(raw.trim())
  if (!isAbsolute(n) || n.length > 4096) {
    return undefined
  }
  return n
}

function parseYtdlpCookiesBrowserStored(raw: unknown): 'chrome' | 'edge' | 'firefox' | undefined {
  if (raw === 'chrome' || raw === 'edge' || raw === 'firefox') {
    return raw
  }
  return undefined
}

function parseYtdlpImpersonateStored(raw: unknown): 'chrome' | 'edge' | 'firefox' | undefined {
  if (raw === 'chrome' || raw === 'edge' || raw === 'firefox') {
    return raw
  }
  return undefined
}

function parseYtdlpRateLimitStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim()
  if (t.length === 0 || t.length > 16 || !/^\d+(?:\.\d+)?[KMG]?$/i.test(t)) {
    return undefined
  }
  return t.toUpperCase()
}

function parseYtdlpRetriesStored(raw: unknown): number | undefined {
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0 || raw > 99) {
    return undefined
  }
  return raw
}

function parseFfmpegExportEncodePresetStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim()
  if (t === 'balance' || t === 'smaller' || t === 'quality') {
    return t
  }
  return undefined
}

const defaults: AppSettings = { theme: 'dark' }

/**
 * Читает настройки терпимо.
 *
 * Повреждённый JSON, ручное редактирование или перенос файла со старой версии не должны
 * блокировать запуск. Поэтому схема сейчас белым списком достаёт только известные поля,
 * а всё неизвестное/битое откатывает к безопасным значениям по умолчанию.
 */
export function loadSettings(filePath: string): AppSettings {
  try {
    if (!existsSync(filePath)) {
      return { ...defaults }
    }
    const raw = readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<AppSettings>
    const theme = parsed.theme === 'light' ? 'light' : 'dark'
    const last =
      typeof parsed.lastOpenedSourcePath === 'string' && parsed.lastOpenedSourcePath.trim() !== ''
        ? parsed.lastOpenedSourcePath.trim()
        : undefined
    const engineExecutablePaths = parseEngineExecutablePaths(parsed.engineExecutablePaths)
    const windowBounds = parseWindowBoundsConfig(parsed.windowBounds)
    const ytdlpDownloadDirectory = parseYtdlpDownloadDirectory(parsed.ytdlpDownloadDirectory)
    const ytdlpFilenameTemplate = parseYtdlpFilenameTemplate(parsed.ytdlpFilenameTemplate)
    const ytdlpFormatPreset = parseYtdlpFormatPresetStored(parsed.ytdlpFormatPreset)
    const ffmpegExportEncodePreset = parseFfmpegExportEncodePresetStored(
      parsed.ffmpegExportEncodePreset
    )
    const ytdlpExtraArgsLine = parseYtdlpExtraArgsLineStored(parsed.ytdlpExtraArgsLine)
    const ytdlpSubtitlePreset = parseYtdlpSubtitlePresetStored(parsed.ytdlpSubtitlePreset)
    const ytdlpSubLangs = parseYtdlpSubLangsStored(parsed.ytdlpSubLangs)
    const ytdlpCookiesFile = parseYtdlpCookiesFileStored(parsed.ytdlpCookiesFile)
    const ytdlpCookiesBrowser = parseYtdlpCookiesBrowserStored(parsed.ytdlpCookiesBrowser)
    const ytdlpImpersonate = parseYtdlpImpersonateStored(parsed.ytdlpImpersonate)
    const ytdlpRateLimit = parseYtdlpRateLimitStored(parsed.ytdlpRateLimit)
    const ytdlpRetries = parseYtdlpRetriesStored(parsed.ytdlpRetries)
    const ytdlpFragmentRetries = parseYtdlpRetriesStored(parsed.ytdlpFragmentRetries)

    const base: AppSettings = { theme }
    if (last !== undefined) {
      base.lastOpenedSourcePath = last
    }
    if (engineExecutablePaths !== undefined) {
      base.engineExecutablePaths = engineExecutablePaths
    }
    if (windowBounds !== undefined) {
      base.windowBounds = windowBounds
    }
    if (ytdlpDownloadDirectory !== undefined) {
      base.ytdlpDownloadDirectory = ytdlpDownloadDirectory
    }
    if (ytdlpFilenameTemplate !== undefined) {
      base.ytdlpFilenameTemplate = ytdlpFilenameTemplate
    }
    if (ytdlpFormatPreset !== undefined) {
      base.ytdlpFormatPreset = ytdlpFormatPreset
    }
    if (ffmpegExportEncodePreset !== undefined) {
      base.ffmpegExportEncodePreset = ffmpegExportEncodePreset
    }
    if (parsed.ytdlpDownloadPlaylist === true) {
      base.ytdlpDownloadPlaylist = true
    }
    if (parsed.ytdlpAudioOnly === true) {
      base.ytdlpAudioOnly = true
    }
    if (ytdlpSubtitlePreset !== undefined) {
      base.ytdlpSubtitlePreset = ytdlpSubtitlePreset
    }
    if (ytdlpSubLangs !== undefined) {
      base.ytdlpSubLangs = ytdlpSubLangs
    }
    if (ytdlpCookiesFile !== undefined) {
      base.ytdlpCookiesFile = ytdlpCookiesFile
    }
    if (ytdlpCookiesBrowser !== undefined) {
      base.ytdlpCookiesBrowser = ytdlpCookiesBrowser
    }
    if (ytdlpImpersonate !== undefined) {
      base.ytdlpImpersonate = ytdlpImpersonate
    }
    if (ytdlpRateLimit !== undefined) {
      base.ytdlpRateLimit = ytdlpRateLimit
    }
    if (ytdlpRetries !== undefined) {
      base.ytdlpRetries = ytdlpRetries
    }
    if (ytdlpFragmentRetries !== undefined) {
      base.ytdlpFragmentRetries = ytdlpFragmentRetries
    }
    if (ytdlpExtraArgsLine !== undefined) {
      base.ytdlpExtraArgsLine = ytdlpExtraArgsLine
    }
    const qrp = parseYtdlpQueueRetryProfile(parsed.ytdlpQueueRetryProfile)
    if (qrp !== 'off') {
      base.ytdlpQueueRetryProfile = qrp
    }
    return base
  } catch {
    return { ...defaults }
  }
}

/**
 * Записывает настройки в userData.
 *
 * Каталог создаётся лениво: на чистой системе `settings.json` может появиться только после
 * первого изменения темы. Когда настроек станет больше, здесь можно будет добавить временный
 * файл + rename, но для текущей маленькой схемы синхронная запись проще и предсказуемее.
 */
export function saveSettings(filePath: string, settings: AppSettings): void {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf-8')
}
