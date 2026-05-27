import { existsSync, statSync } from 'fs'
import { isAbsolute, normalize } from 'path'

import { BrowserWindow } from 'electron'

import { mainWindowIpc as mw } from '../../../shared/ipc-channels'
import type { MainWindowUiPanelState } from '../../../shared/settings-contract'
import { parseAppUiLocale } from '../../../shared/app-ui-locale'
import { patchAppSettingsUiLocale } from '../../../shared/ui-locale-settings-patch'
import {
  ENGINE_IDS,
  type EnginePathOverrides,
  type EnginePathOverridesPatch
} from '../engines/engine-service'
import type { AppSettings } from './settings-store'
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
  | 'persistConfirmCloseOnQuit'
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
      'workflowScenario',
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
  function persistUiLocale(raw: unknown): AppSettings {
    const v = parseAppUiLocale(raw)
    if (v === undefined) {
      return snapshot(access)
    }
    const next = patchAppSettingsUiLocale(access.get(), v)
    access.set(next)
    access.save()
    hooks.buildApplicationMenu()
    hooks.syncDownloadsWindowLocale(v)
    for (const w of BrowserWindow.getAllWindows()) {
      if (!w.isDestroyed()) {
        w.webContents.send(mw.uiLocaleChanged, v)
      }
    }
    return snapshot(access)
  }

  function persistConfirmCloseOnQuit(raw: unknown): AppSettings {
    const enabled = raw !== false
    const next = { ...access.get() }
    if (enabled) {
      delete next.confirmCloseOnQuit
    } else {
      next.confirmCloseOnQuit = false
    }
    return commit(access, next)
  }

  return {
    persistUiLocale,
    persistConfirmCloseOnQuit,
    persistEnginePathOverridesPatch,
    persistMainWindowUiPanelsMerge
  }
}
