import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, isAbsolute, normalize } from 'path'

import { ENGINE_IDS, type EnginePathOverrides } from '../shared/engine-contract'
import type { FfmpegExportVideoCodecId } from '../shared/ffmpeg-export-contract'
import type {
  AppSettings,
  AppTheme,
  DownloadsWindowUiPanelState,
  MainWindowUiPanelState,
  StoredWindowRect,
  WindowBoundsConfig
} from '../shared/settings-contract'
import {
  parseFfmpegExportCropPreset,
  parseFfmpegExportUserPresetsList,
  parseFfmpegExportVideoTransform
} from './ffmpeg-export-service'
import { parseYtdlpQueueRetryProfile } from './ytdlp-queue-retry'
import { validateYtdlpCookiesBrowserProfile } from './ytdlp-extra-args'

export type {
  AppSettings,
  AppSettingsView,
  AppTheme,
  ResolvedAppTheme,
  StoredWindowRect,
  WindowBoundsConfig
} from '../shared/settings-contract'

function parseStoredWindowRect(raw: unknown): StoredWindowRect | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const o = raw as Record<string, unknown>
  const x = Number(o['x'])
  const y = Number(o['y'])
  const width = Number(o['width'])
  const height = Number(o['height'])
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
  const main = parseStoredWindowRect(o['main'])
  const downloads = parseStoredWindowRect(o['downloads'])
  const inspector = parseStoredWindowRect(o['inspector'])
  if (!main && !downloads && !inspector) {
    return undefined
  }
  const cfg: WindowBoundsConfig = {}
  if (main) {
    cfg.main = main
  }
  if (downloads) {
    cfg.downloads = downloads
  }
  if (inspector) {
    cfg.inspector = inspector
  }
  return cfg
}

function parseEngineExecutablePaths(raw: unknown): EnginePathOverrides | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const src = raw as Record<string, unknown>
  const out: EnginePathOverrides = {}
  for (const id of ENGINE_IDS) {
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

function parseFfmpegExportDirectoryStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return undefined
  }
  const n = normalize(raw.trim())
  return isAbsolute(n) && n.length <= 4096 ? n : undefined
}

function parseFfmpegSnapshotDirectoryStored(raw: unknown): string | undefined {
  return parseFfmpegExportDirectoryStored(raw)
}

function parseFfmpegSnapshotFormatStored(raw: unknown): 'png' | 'jpg' | undefined {
  if (raw === 'png' || raw === 'jpg') {
    return raw
  }
  return undefined
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

function parseYtdlpCookiesBrowserProfileStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const v = validateYtdlpCookiesBrowserProfile(raw)
  if (!v.ok || v.value.length === 0) {
    return undefined
  }
  return v.value
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

function parseFfmpegExportVideoCodecStored(raw: unknown): FfmpegExportVideoCodecId | undefined {
  if (raw === 'libx265') {
    return 'libx265'
  }
  return undefined
}

function parseFfmpegExportContainerStored(raw: unknown): 'mp4' | 'mkv' | 'mov' | undefined {
  if (raw === 'mp4' || raw === 'mkv' || raw === 'mov') {
    return raw
  }
  return undefined
}

function parseFfmpegExportCrfStored(raw: unknown): number | undefined {
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0 || raw > 51) {
    return undefined
  }
  return raw
}

function parseFfmpegExportAudioBitrateStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim().toLowerCase()
  if (!/^\d{2,3}k$/.test(t)) {
    return undefined
  }
  const kbps = Number(t.slice(0, -1))
  if (!Number.isInteger(kbps) || kbps < 32 || kbps > 512) {
    return undefined
  }
  return `${kbps}k`
}

function parseFfmpegExportVideoBitrateStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim().toLowerCase()
  if (!/^\d{3,5}k$/.test(t)) {
    return undefined
  }
  const kbps = Number(t.slice(0, -1))
  if (!Number.isInteger(kbps) || kbps < 300 || kbps > 50000) {
    return undefined
  }
  return `${kbps}k`
}

function parseFfmpegExportAudioModeStored(raw: unknown): 'aac' | 'none' | undefined {
  if (raw === 'aac' || raw === 'none') {
    return raw
  }
  return undefined
}

function parseFfmpegExportFpsStored(raw: unknown): number | undefined {
  if (typeof raw !== 'number' || ![24, 25, 30, 50, 60].includes(raw)) {
    return undefined
  }
  return raw
}

function parseFfmpegExportScalePresetStored(
  raw: unknown
): 'source' | '480p' | '720p' | '1080p' | undefined {
  if (raw === 'source' || raw === '480p' || raw === '720p' || raw === '1080p') {
    return raw
  }
  return undefined
}

const MAIN_UI_PANEL_KEYS = [
  'ffmpegSettingsRailOpen',
  'quickYtdlp',
  'ffmpegVideo',
  'ffmpegFormat',
  'ffmpegAudio',
  'ffmpegPresets',
  'ffmpegOutput',
  'exportCommandPreview',
  'processingHistory',
  'probeExportSummary',
  'probeTracks',
  'probeChapters',
  'probeRawJson'
] as const satisfies ReadonlyArray<keyof MainWindowUiPanelState>

function parseMainWindowUiPanels(raw: unknown): MainWindowUiPanelState | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const o = raw as Record<string, unknown>
  const out: MainWindowUiPanelState = {}
  for (const k of MAIN_UI_PANEL_KEYS) {
    if (typeof o[k] === 'boolean') {
      out[k] = o[k]
    }
  }
  return Object.keys(out).length > 0 ? out : undefined
}

const DOWNLOADS_UI_PANEL_KEYS = [
  'history',
  'log',
  'format',
  'metadata',
  'saving',
  'network',
  'expert',
  'hints'
] as const satisfies ReadonlyArray<keyof DownloadsWindowUiPanelState>

function parseDownloadsWindowUiPanels(raw: unknown): DownloadsWindowUiPanelState | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const o = raw as Record<string, unknown>
  const out: DownloadsWindowUiPanelState = {}
  for (const k of DOWNLOADS_UI_PANEL_KEYS) {
    if (typeof o[k] === 'boolean') {
      out[k] = o[k]
    }
  }
  return Object.keys(out).length > 0 ? out : undefined
}

function parseStoredTheme(raw: unknown): AppTheme {
  if (raw === 'light' || raw === 'dark' || raw === 'system') {
    return raw
  }
  return 'dark'
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
    const theme = parseStoredTheme(parsed.theme)
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
    const ffmpegExportVideoCodec = parseFfmpegExportVideoCodecStored(parsed.ffmpegExportVideoCodec)
    const ffmpegExportContainer = parseFfmpegExportContainerStored(parsed.ffmpegExportContainer)
    const ffmpegExportCrf = parseFfmpegExportCrfStored(parsed.ffmpegExportCrf)
    const ffmpegExportVideoBitrate = parseFfmpegExportVideoBitrateStored(
      parsed.ffmpegExportVideoBitrate
    )
    const ffmpegExportAudioBitrate = parseFfmpegExportAudioBitrateStored(
      parsed.ffmpegExportAudioBitrate
    )
    const ffmpegExportAudioMode = parseFfmpegExportAudioModeStored(parsed.ffmpegExportAudioMode)
    const ffmpegExportFps = parseFfmpegExportFpsStored(parsed.ffmpegExportFps)
    const ffmpegExportScalePreset = parseFfmpegExportScalePresetStored(
      parsed.ffmpegExportScalePreset
    )
    const ffmpegExportVideoTransform = parseFfmpegExportVideoTransform(
      parsed.ffmpegExportVideoTransform
    )
    const ffmpegExportCropPreset = parseFfmpegExportCropPreset(parsed.ffmpegExportCropPreset)
    const ffmpegExportDirectory = parseFfmpegExportDirectoryStored(parsed.ffmpegExportDirectory)
    const ffmpegSnapshotDirectory = parseFfmpegSnapshotDirectoryStored(
      parsed.ffmpegSnapshotDirectory
    )
    const ffmpegSnapshotFormat = parseFfmpegSnapshotFormatStored(parsed.ffmpegSnapshotFormat)
    const ytdlpExtraArgsLine = parseYtdlpExtraArgsLineStored(parsed.ytdlpExtraArgsLine)
    const ytdlpSubtitlePreset = parseYtdlpSubtitlePresetStored(parsed.ytdlpSubtitlePreset)
    const ytdlpSubLangs = parseYtdlpSubLangsStored(parsed.ytdlpSubLangs)
    const ytdlpCookiesFile = parseYtdlpCookiesFileStored(parsed.ytdlpCookiesFile)
    const ytdlpCookiesBrowser = parseYtdlpCookiesBrowserStored(parsed.ytdlpCookiesBrowser)
    const ytdlpCookiesBrowserProfile = parseYtdlpCookiesBrowserProfileStored(
      parsed.ytdlpCookiesBrowserProfile
    )
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
    if (ffmpegExportVideoCodec !== undefined) {
      base.ffmpegExportVideoCodec = ffmpegExportVideoCodec
    }
    if (ffmpegExportContainer !== undefined) {
      base.ffmpegExportContainer = ffmpegExportContainer
    }
    if (ffmpegExportCrf !== undefined) {
      base.ffmpegExportCrf = ffmpegExportCrf
    }
    if (ffmpegExportVideoBitrate !== undefined) {
      base.ffmpegExportVideoBitrate = ffmpegExportVideoBitrate
    }
    if (parsed.ffmpegExportTwoPass === true) {
      base.ffmpegExportTwoPass = true
    }
    if (ffmpegExportAudioBitrate !== undefined) {
      base.ffmpegExportAudioBitrate = ffmpegExportAudioBitrate
    }
    if (ffmpegExportAudioMode !== undefined && ffmpegExportAudioMode !== 'aac') {
      base.ffmpegExportAudioMode = ffmpegExportAudioMode
    }
    if (ffmpegExportFps !== undefined) {
      base.ffmpegExportFps = ffmpegExportFps
    }
    if (ffmpegExportScalePreset !== undefined && ffmpegExportScalePreset !== 'source') {
      base.ffmpegExportScalePreset = ffmpegExportScalePreset
    }
    if (ffmpegExportVideoTransform !== 'none') {
      base.ffmpegExportVideoTransform = ffmpegExportVideoTransform
    }
    if (ffmpegExportCropPreset !== 'none') {
      base.ffmpegExportCropPreset = ffmpegExportCropPreset
    }
    if (ffmpegExportDirectory !== undefined) {
      base.ffmpegExportDirectory = ffmpegExportDirectory
    }
    if (ffmpegSnapshotDirectory !== undefined) {
      base.ffmpegSnapshotDirectory = ffmpegSnapshotDirectory
    }
    if (ffmpegSnapshotFormat !== undefined && ffmpegSnapshotFormat !== 'png') {
      base.ffmpegSnapshotFormat = ffmpegSnapshotFormat
    }
    if (parsed.ytdlpDownloadPlaylist === true) {
      base.ytdlpDownloadPlaylist = true
    }
    if (parsed.ytdlpAudioOnly === true) {
      base.ytdlpAudioOnly = true
    }
    if (parsed.ytdlpOpenInHandlerOnComplete === true) {
      base.ytdlpOpenInHandlerOnComplete = true
    }
    if (parsed.ytdlpAutoExportAfterOpenInHandler === true) {
      base.ytdlpAutoExportAfterOpenInHandler = true
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
    if (ytdlpCookiesBrowserProfile !== undefined) {
      base.ytdlpCookiesBrowserProfile = ytdlpCookiesBrowserProfile
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
    const ffmpegExportUserPresets = parseFfmpegExportUserPresetsList(parsed.ffmpegExportUserPresets)
    if (ffmpegExportUserPresets.length > 0) {
      base.ffmpegExportUserPresets = ffmpegExportUserPresets
    }
    const mainWindowUiPanels = parseMainWindowUiPanels(parsed.mainWindowUiPanels)
    if (mainWindowUiPanels !== undefined) {
      base.mainWindowUiPanels = mainWindowUiPanels
    }
    const downloadsWindowUiPanels = parseDownloadsWindowUiPanels(parsed.downloadsWindowUiPanels)
    if (downloadsWindowUiPanels !== undefined) {
      base.downloadsWindowUiPanels = downloadsWindowUiPanels
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
