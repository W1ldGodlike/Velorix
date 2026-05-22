import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from 'fs'
import { join } from 'path'

import { parseAppUiLocale } from '../../../shared/app-ui-locale'
import type { FfmpegExportUserPreset } from '../../../shared/ffmpeg-export-contract'
import { parseFfmpegExportUserPresetsList } from '../../../shared/ffmpeg-export-user-preset-parse'
import {
  isBuiltinExportUserPresetId,
  mergeBuiltinFfmpegExportUserPresetsFromFile
} from '../../../shared/builtin-ffmpeg-export-user-presets'
import {
  buildPresetsExportFileV1,
  parsePresetsExportFileV1
} from '../../../shared/presets-export-disk-parse'
import {
  PRESETS_EXPORT_DIR_NAME,
  PRESETS_EXPORT_USER_SUBDIR
} from '../../../shared/presets-export-file-v1'
import type { AppSettings } from '../../../shared/settings-contract'
import { VELORIX_APP_DATA_ENV } from '../../core/app-data-root-paths'

const MAX_PRESET_FILE_BYTES = 64 * 1024

let installRootResolver: (() => string) | null = null

/** Main вызывает с `resolveInstallRoot` из app-data-root после bootstrap. */
export function configurePresetsExportInstallRoot(resolver: () => string): void {
  installRootResolver = resolver
}

/** Install root для `Presets/` без импорта Electron (Vitest, hydrate до app.ready). */
export function resolvePresetsExportInstallRoot(): string {
  if (installRootResolver) {
    return installRootResolver()
  }
  const appData = process.env[VELORIX_APP_DATA_ENV]
  if (typeof appData === 'string' && appData.trim() !== '') {
    return join(appData.trim(), '..')
  }
  return process.cwd()
}

export function resolvePresetsExportUserDirectory(): string {
  return join(
    resolvePresetsExportInstallRoot(),
    PRESETS_EXPORT_DIR_NAME,
    PRESETS_EXPORT_USER_SUBDIR
  )
}

function ensurePresetsExportUserDirectory(): string {
  const dir = resolvePresetsExportUserDirectory()
  mkdirSync(dir, { recursive: true })
  return dir
}

function presetFilePath(id: string): string | null {
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(id) || isBuiltinExportUserPresetId(id)) {
    return null
  }
  return join(ensurePresetsExportUserDirectory(), `${id}.json`)
}

function readPresetFile(abs: string): FfmpegExportUserPreset | null {
  if (!existsSync(abs) || !statSync(abs).isFile()) {
    return null
  }
  if (statSync(abs).size > MAX_PRESET_FILE_BYTES) {
    return null
  }
  try {
    const parsed = JSON.parse(readFileSync(abs, 'utf8')) as unknown
    return parsePresetsExportFileV1(parsed)
  } catch {
    return null
  }
}

export function loadUserExportPresetsFromDisk(): FfmpegExportUserPreset[] {
  const dir = resolvePresetsExportUserDirectory()
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    return []
  }
  const out: FfmpegExportUserPreset[] = []
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.json')) {
      continue
    }
    const preset = readPresetFile(join(dir, name))
    if (preset) {
      out.push(preset)
    }
  }
  return out
}

function writeUserPresetFile(preset: FfmpegExportUserPreset): boolean {
  const path = presetFilePath(preset.id)
  if (path === null) {
    return false
  }
  const payload = buildPresetsExportFileV1(preset)
  writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  return true
}

export function syncUserPresetsToDisk(userPresets: readonly FfmpegExportUserPreset[]): void {
  const dir = ensurePresetsExportUserDirectory()
  const keep = new Set(userPresets.map((p) => `${p.id}.json`))
  for (const name of readdirSync(dir)) {
    if (name.endsWith('.json') && !keep.has(name)) {
      rmSync(join(dir, name), { force: true })
    }
  }
  for (const preset of userPresets) {
    writeUserPresetFile(preset)
  }
}

export function resolvePresetUiLocale(settings: AppSettings): 'ru' | 'en' {
  const loc = parseAppUiLocale(settings.uiLocale)
  return loc === 'en' ? 'en' : 'ru'
}

export function mergeExportUserPresetsForUi(
  _settings: AppSettings,
  locale: 'ru' | 'en'
): FfmpegExportUserPreset[] {
  const fromDisk = loadUserExportPresetsFromDisk()
  return mergeBuiltinFfmpegExportUserPresetsFromFile(fromDisk, locale)
}

export function stripExportUserPresetsFromSettingsForDisk(settings: AppSettings): AppSettings {
  const next = { ...settings }
  delete next.ffmpegExportUserPresets
  return next
}

export function migrateLegacyExportUserPresetsFromSettings(settings: AppSettings): void {
  const legacy = parseFfmpegExportUserPresetsList(settings.ffmpegExportUserPresets).filter(
    (p) => !isBuiltinExportUserPresetId(p.id)
  )
  if (legacy.length === 0) {
    return
  }
  const existing = loadUserExportPresetsFromDisk()
  const byId = new Map(existing.map((p) => [p.id, p]))
  for (const p of legacy) {
    if (!byId.has(p.id)) {
      byId.set(p.id, p)
    }
  }
  syncUserPresetsToDisk([...byId.values()])
}

/** §20 — disk + legacy migration + built-in merge при hydrate settings. */
export function hydrateExportUserPresetsOnLoad(settings: AppSettings): AppSettings {
  migrateLegacyExportUserPresetsFromSettings(settings)
  const locale = resolvePresetUiLocale(settings)
  const merged = mergeExportUserPresetsForUi(settings, locale)
  return { ...settings, ffmpegExportUserPresets: merged }
}
