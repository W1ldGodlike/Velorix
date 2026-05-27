import { existsSync, statSync } from 'fs'
import { join, normalize } from 'path'

import { app } from 'electron'
import type { BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'

import { resolveOpenMediaDialogDefaultPath } from '../../../shared/preview-open-dialog-default-path'
import { setEnginePathOverridesSnapshot } from '../engines/engine-path-sync'
import type { SettingsIpcPersistApi } from './settings-ipc-persist'
import type { AppSettings, AppTheme, ResolvedAppTheme, WindowBoundsConfig } from './settings-store'
import { stripExportUserPresetsFromSettingsForDisk } from '../presets/presets-export-disk-store'
import { loadSettings, saveSettings } from './settings-store'
import { boundsFromBrowserWindow } from '../../windows/window-bounds'

let cachedSettings: AppSettings = { theme: 'dark' }

let getSettingsIpcPersist: (() => SettingsIpcPersistApi) | null = null

export function configureMainCachedSettingsRevealPanel(next: {
  getSettingsIpcPersist: () => SettingsIpcPersistApi
}): void {
  getSettingsIpcPersist = next.getSettingsIpcPersist
}

export function settingsPath(): string {
  return join(app.getPath('userData'), 'settings.json')
}

export function technicalSpecPath(): string {
  const packaged = join(process.resourcesPath, 'VELORIX_NEON_THEME.md')
  if (!is.dev && existsSync(packaged)) {
    return packaged
  }
  return join(app.getAppPath(), 'docs', 'VELORIX_NEON_THEME.md')
}

export function getCachedSettings(): AppSettings {
  return cachedSettings
}

export function setCachedSettings(next: AppSettings): void {
  cachedSettings = next
}

export function loadCachedSettingsFromDisk(): void {
  cachedSettings = loadSettings(settingsPath())
}

export function saveCachedSettingsToDisk(): void {
  saveSettings(settingsPath(), stripExportUserPresetsFromSettingsForDisk(cachedSettings))
}

export const mainSettingsAccess = {
  get: (): AppSettings => cachedSettings,
  set: (next: AppSettings): void => {
    cachedSettings = next
  },
  save: (): void => {
    saveCachedSettingsToDisk()
  }
}

export function patchCachedSettings(
  updater: (prev: AppSettings) => AppSettings,
  options?: { persist?: boolean }
): void {
  cachedSettings = updater(cachedSettings)
  if (options?.persist !== false) {
    saveCachedSettingsToDisk()
  }
}

export function resolveEffectiveTheme(pref: AppTheme): ResolvedAppTheme {
  void pref
  return 'dark'
}

export function refreshEnginePathOverridesSnapshot(): void {
  setEnginePathOverridesSnapshot(cachedSettings.engineExecutablePaths)
}

export function patchWindowBounds(partial: Partial<WindowBoundsConfig>): void {
  cachedSettings = {
    ...cachedSettings,
    windowBounds: {
      ...cachedSettings.windowBounds,
      ...partial
    }
  }
  saveCachedSettingsToDisk()
}

export function attachMainWindowBoundsPersistence(win: BrowserWindow): void {
  let mainWindowBoundsTimer: ReturnType<typeof setTimeout> | null = null

  const flush = (): void => {
    if (win.isDestroyed()) {
      return
    }
    patchWindowBounds({ main: boundsFromBrowserWindow(win) })
  }

  const schedule = (): void => {
    if (mainWindowBoundsTimer !== null) {
      clearTimeout(mainWindowBoundsTimer)
    }
    mainWindowBoundsTimer = setTimeout(() => {
      mainWindowBoundsTimer = null
      flush()
    }, 480)
  }

  win.on('resize', schedule)
  win.on('move', schedule)
  win.on('close', () => {
    if (mainWindowBoundsTimer !== null) {
      clearTimeout(mainWindowBoundsTimer)
      mainWindowBoundsTimer = null
    }
    flush()
  })
}

export function persistLastOpenedSource(absolutePath: string | null): void {
  if (absolutePath === null || absolutePath.trim().length === 0) {
    const rest = { ...cachedSettings }
    delete rest.lastOpenedSourcePath
    cachedSettings = rest
  } else {
    cachedSettings = { ...cachedSettings, lastOpenedSourcePath: absolutePath.trim() }
  }
  saveCachedSettingsToDisk()
}

export function previewOpenDialogOptsFromSettings(): { defaultPath: string } | undefined {
  const d = resolveOpenMediaDialogDefaultPath(cachedSettings.lastOpenedSourcePath)
  return d !== undefined ? { defaultPath: d } : undefined
}

export function batchExportOutputFolderPickOptsFromSettings(): { defaultPath: string } | undefined {
  const raw = cachedSettings.ffmpegExportBatchOutputDirectory
  if (typeof raw === 'string' && raw.trim().length > 0) {
    const p = normalize(raw.trim())
    if (existsSync(p)) {
      try {
        if (statSync(p).isDirectory()) {
          return { defaultPath: p }
        }
      } catch {
        /* fall back to last preview path */
      }
    }
  }
  return previewOpenDialogOptsFromSettings()
}

export function revealMainWindowBatchExportPanel(): void {
  if (cachedSettings.mainWindowUiPanels?.batchExport === true) {
    return
  }
  if (!getSettingsIpcPersist) {
    throw new Error('main-cached-settings-host: configureMainCachedSettingsRevealPanel not called')
  }
  getSettingsIpcPersist().persistMainWindowUiPanelsMerge({ batchExport: true })
}
