import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, isAbsolute, normalize } from 'path'

import type { EngineId, EnginePathOverrides } from './engine-service'

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
