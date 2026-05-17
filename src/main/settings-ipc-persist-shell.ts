import { existsSync, statSync } from 'fs'
import { isAbsolute, normalize } from 'path'

import { BrowserWindow } from 'electron'

import { mainWindowIpc as mw } from '../shared/ipc-channels'
import type { MainWindowUiPanelState } from '../shared/settings-contract'
import { parseDownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import {
  ENGINE_IDS,
  type EnginePathOverrides,
  type EnginePathOverridesPatch
} from './engine-service'
import type { AppSettings, AppSettingsView, AppTheme } from './settings-store'
import {
  commit,
  snapshot,
  type MainSettingsAccess,
  type SettingsIpcPersistHooks
} from './settings-ipc-persist-core'

export function createSettingsShellPersist(
  access: MainSettingsAccess,
  hooks: SettingsIpcPersistHooks
): Pick<
  import('./settings-ipc-persist-core').SettingsIpcPersistApi,
  | 'persistUiLocale'
  | 'persistThemePreference'
  | 'persistEnginePathOverridesPatch'
  | 'persistMainWindowUiPanelsMerge'
> {
  function validateEngineOverridePath(raw: string): string | null {
    const normalized = normalize(raw.trim())
    if (!isAbsolute(normalized) || normalized.length > 4096 || !existsSync(normalized)) {
      return null
    }
    try {
      return statSync(normalized).isFile() ? normalized : null
    } catch {
      return null
    }
  }

  function persistEnginePathOverridesPatch(patch: EnginePathOverridesPatch): AppSettings {
    const nextPaths: EnginePathOverrides = { ...(access.get().engineExecutablePaths ?? {}) }
    for (const id of ENGINE_IDS) {
      if (!(id in patch)) {
        continue
      }
      const v = patch[id]
      if (v === null || v === '') {
        delete nextPaths[id]
      } else if (typeof v === 'string' && v.trim() !== '') {
        const validPath = validateEngineOverridePath(v)
        if (validPath !== null) {
          nextPaths[id] = validPath
        }
      }
    }
    const merged: AppSettings = { ...access.get() }
    if (Object.keys(nextPaths).length === 0) {
      delete merged.engineExecutablePaths
    } else {
      merged.engineExecutablePaths = nextPaths
    }
    const saved = commit(access, merged)
    hooks.refreshEnginePathOverridesSnapshot()
    hooks.buildApplicationMenu()
    BrowserWindow.getAllWindows().forEach((w) => {
      w.webContents.send(mw.enginePathsChanged)
    })
    return saved
  }

  function sanitizeMainWindowUiPanelPatch(raw: unknown): Partial<MainWindowUiPanelState> {
    if (!raw || typeof raw !== 'object') {
      return {}
    }
    const keys: (keyof MainWindowUiPanelState)[] = [
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
    ]
    const o = raw as Record<string, unknown>
    const out: Partial<MainWindowUiPanelState> = {}
    for (const k of keys) {
      if (typeof o[k] === 'boolean') {
        out[k] = o[k]
      }
    }
    return out
  }

  function persistMainWindowUiPanelsMerge(raw: unknown): AppSettings {
    const patch = sanitizeMainWindowUiPanelPatch(raw)
    if (Object.keys(patch).length === 0) {
      return snapshot(access)
    }
    const next: AppSettings = {
      ...access.get(),
      mainWindowUiPanels: {
        ...(access.get().mainWindowUiPanels ?? {}),
        ...patch
      }
    }
    access.set(next)
    access.save()
    const panelsSnapshot = next.mainWindowUiPanels
    /** Синхронизация между главным окном и инспектором §9 без повторного `settings-get`. */
    for (const w of BrowserWindow.getAllWindows()) {
      if (!w.isDestroyed()) {
        w.webContents.send(mw.mainWindowUiPanelsChanged, panelsSnapshot ?? {})
      }
    }
    return snapshot(access)
  }
  function persistThemePreference(pref: AppTheme): AppSettingsView {
    const next = { ...access.get(), theme: pref }
    access.set(next)
    access.save()
    const resolved = hooks.resolveEffectiveTheme(pref)
    // Renderer подписан на событие, поэтому смена темы из меню сразу отражается во всех окнах.
    BrowserWindow.getAllWindows().forEach((w) => {
      if (!w.isDestroyed()) {
        w.webContents.send(mw.themeChanged, resolved)
      }
    })
    hooks.buildApplicationMenu()
    return { ...access.get(), effectiveTheme: resolved }
  }

  function persistUiLocale(raw: unknown): AppSettings {
    const v = parseDownloadsWindowUiLocale(raw)
    if (v === undefined) {
      return snapshot(access)
    }
    const next = { ...access.get(), uiLocale: v }
    access.set(next)
    access.save()
    hooks.buildApplicationMenu()
    hooks.syncDownloadsPopoutHtmlToLocale(v)
    for (const w of BrowserWindow.getAllWindows()) {
      if (!w.isDestroyed()) {
        w.webContents.send(mw.uiLocaleChanged, v)
      }
    }
    return snapshot(access)
  }

  return {
    persistUiLocale,
    persistThemePreference,
    persistEnginePathOverridesPatch,
    persistMainWindowUiPanelsMerge
  }
}
