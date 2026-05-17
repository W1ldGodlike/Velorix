import { isAbsolute, normalize } from 'path'

import { ENGINE_IDS, type EnginePathOverrides } from '../shared/engine-contract'
import type { FfmpegExportVideoCodecId } from '../shared/ffmpeg-export-contract'
import { parseFfmpegExportVideoCodec } from '../shared/ffmpeg-export-video-codec'
import type {
  DownloadsWindowUiPanelState,
  MainWindowUiPanelState,
  StoredWindowRect,
  WindowBoundsConfig
} from '../shared/settings-contract'
import {
  parseStoredTrimmedWhitelistEnum,
  parseStoredWhitelistEnum
} from '../shared/settings-stored-parse'
import { validateYtdlpCookiesBrowserProfile } from './ytdlp-extra-args'

export function parseStoredWindowRect(raw: unknown): StoredWindowRect | undefined {
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

export function parseWindowBoundsConfig(raw: unknown): WindowBoundsConfig | undefined {
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

export function parseEngineExecutablePaths(raw: unknown): EnginePathOverrides | undefined {
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

export function parseYtdlpDownloadDirectory(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return undefined
  }
  const n = normalize(raw.trim())
  return isAbsolute(n) ? n : undefined
}

export function parseFfmpegExportDirectoryStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return undefined
  }
  const n = normalize(raw.trim())
  return isAbsolute(n) && n.length <= 4096 ? n : undefined
}

export function parseFfmpegSnapshotDirectoryStored(raw: unknown): string | undefined {
  return parseFfmpegExportDirectoryStored(raw)
}

export function parseFfmpegSnapshotFormatStored(raw: unknown): 'png' | 'jpg' | undefined {
  return parseStoredWhitelistEnum(raw, ['png', 'jpg'])
}

export function parseYtdlpFormatPresetStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return undefined
  }
  return raw.trim().slice(0, 64)
}

export function parseYtdlpExtraArgsLineStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim()
  if (t.length === 0) {
    return undefined
  }
  return t.length <= 2000 ? t : t.slice(0, 2000)
}

export function parseYtdlpSubtitlePresetStored(raw: unknown): 'manual' | 'manual_auto' | undefined {
  return parseStoredWhitelistEnum(raw, ['manual', 'manual_auto'])
}

/** Только безопасный алфавит для одного argv-токена `--sub-langs` (без пробелов/shell). */
export function parseYtdlpSubLangsStored(raw: unknown): string | undefined {
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

export function parseYtdlpCookiesFileStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return undefined
  }
  const n = normalize(raw.trim())
  if (!isAbsolute(n) || n.length > 4096) {
    return undefined
  }
  return n
}

export function parseYtdlpCookiesBrowserStored(
  raw: unknown
): 'chrome' | 'edge' | 'firefox' | undefined {
  return parseStoredWhitelistEnum(raw, ['chrome', 'edge', 'firefox'])
}

export function parseYtdlpCookiesBrowserProfileStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const v = validateYtdlpCookiesBrowserProfile(raw)
  if (!v.ok || v.value.length === 0) {
    return undefined
  }
  return v.value
}

export function parseYtdlpImpersonateStored(
  raw: unknown
): 'chrome' | 'edge' | 'firefox' | undefined {
  return parseStoredWhitelistEnum(raw, ['chrome', 'edge', 'firefox'])
}

export function parseYtdlpRateLimitStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim()
  if (t.length === 0 || t.length > 16 || !/^\d+(?:\.\d+)?[KMG]?$/i.test(t)) {
    return undefined
  }
  return t.toUpperCase()
}

export function parseYtdlpRetriesStored(raw: unknown): number | undefined {
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0 || raw > 99) {
    return undefined
  }
  return raw
}

export function parseFfmpegExportEncodePresetStored(raw: unknown): string | undefined {
  return parseStoredTrimmedWhitelistEnum(raw, ['balance', 'smaller', 'quality'])
}

export function parseFfmpegExportVideoCodecStored(
  raw: unknown
): FfmpegExportVideoCodecId | undefined {
  const id = parseFfmpegExportVideoCodec(raw)
  if (id === 'libx264') {
    return undefined
  }
  return id
}

export function parseFfmpegExportContainerStored(raw: unknown): 'mp4' | 'mkv' | 'mov' | undefined {
  return parseStoredWhitelistEnum(raw, ['mp4', 'mkv', 'mov'])
}

export function parseFfmpegExportCrfStored(raw: unknown): number | undefined {
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0 || raw > 51) {
    return undefined
  }
  return raw
}

export function parseFfmpegExportAudioBitrateStored(raw: unknown): string | undefined {
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

export function parseFfmpegExportVideoBitrateStored(raw: unknown): string | undefined {
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

export function parseFfmpegExportAudioModeStored(
  raw: unknown
):
  | 'aac'
  | 'libmp3lame'
  | 'ac3'
  | 'copy'
  | 'none'
  | 'pcm_s16le'
  | 'libvorbis'
  | 'libopus'
  | 'flac'
  | 'alac'
  | undefined {
  return parseStoredWhitelistEnum(raw, [
    'aac',
    'libmp3lame',
    'ac3',
    'copy',
    'none',
    'pcm_s16le',
    'libvorbis',
    'libopus',
    'flac',
    'alac'
  ])
}

export function parseFfmpegExportFpsStored(raw: unknown): number | undefined {
  if (typeof raw !== 'number' || ![24, 25, 30, 50, 60].includes(raw)) {
    return undefined
  }
  return raw
}

export function parseFfmpegExportScalePresetStored(
  raw: unknown
): 'source' | '480p' | '720p' | '1080p' | undefined {
  return parseStoredWhitelistEnum(raw, ['source', '480p', '720p', '1080p'])
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

export function parseMainWindowUiPanels(raw: unknown): MainWindowUiPanelState | undefined {
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

export function parseDownloadsWindowUiPanels(
  raw: unknown
): DownloadsWindowUiPanelState | undefined {
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
