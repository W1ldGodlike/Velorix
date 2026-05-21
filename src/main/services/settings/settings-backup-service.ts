import { readFileSync, writeFileSync } from 'fs'
import { basename } from 'path'

import { BrowserWindow, dialog } from 'electron'
import type { BrowserWindow as BrowserWindowType } from 'electron'

import { mainWindowIpc as mw } from '../../../shared/ipc-channels'
import { parseAppUiLocale } from '../../../shared/app-ui-locale'
import {
  buildSettingsBackupFileV1,
  extractSettingsPayloadFromBackupJson
} from '../../../shared/settings-backup-parse'
import type { AppSettings, AppTheme, ResolvedAppTheme } from './settings-store'
import { stripExportUserPresetsFromSettingsForDisk } from '../presets/presets-export-disk-store'
import { hydrateAppSettingsFromPartial, settingsStoreDefaults } from './settings-store-hydrate'

export type SettingsBackupServiceHooks = {
  getSettings: () => AppSettings
  replaceSettings: (next: AppSettings) => void
  saveSettings: () => void
  resolveEffectiveTheme: (pref: AppTheme) => ResolvedAppTheme
  buildApplicationMenu: () => void
  refreshEnginePathOverridesSnapshot: () => void
  refreshYtdlpFromSettings: () => void
  syncDownloadsPopoutHtmlToLocale: (
    locale: import('../../../shared/app-ui-locale').AppUiLocale
  ) => void
  mainAppStr: () => {
    settingsBackupExportTitle: string
    settingsBackupExportFilter: string
    settingsBackupImportTitle: string
    settingsBackupImportFilter: string
    settingsBackupExportOkTitle: string
    settingsBackupExportOkMessage: string
    settingsBackupImportOkTitle: string
    settingsBackupImportOkMessage: string
    settingsBackupParseErrorTitle: string
    settingsBackupParseErrorMessage: string
    settingsBackupImportConfirmTitle: string
    settingsBackupImportConfirmMessage: string
    settingsBackupImportConfirm: string
    settingsBackupImportCancel: string
    ipcInvalidRequest: string
    exportNoActiveWindow: string
  }
}

let hooks: SettingsBackupServiceHooks | null = null

export function configureSettingsBackupService(next: SettingsBackupServiceHooks): void {
  hooks = next
}

function requireHooks(): SettingsBackupServiceHooks {
  if (!hooks) {
    throw new Error('settings-backup-service: configureSettingsBackupService not called')
  }
  return hooks
}

function broadcastSettingsReplacements(prev: AppSettings, next: AppSettings): void {
  const h = requireHooks()
  const resolved = h.resolveEffectiveTheme(next.theme)
  const prevResolved = h.resolveEffectiveTheme(prev.theme)
  if (resolved !== prevResolved || next.theme !== prev.theme) {
    BrowserWindow.getAllWindows().forEach((w) => {
      if (!w.isDestroyed()) {
        w.webContents.send(mw.themeChanged, resolved)
      }
    })
  }
  const nextLoc = parseAppUiLocale(next.uiLocale)
  const prevLoc = parseAppUiLocale(prev.uiLocale)
  if (nextLoc !== undefined && nextLoc !== prevLoc) {
    h.syncDownloadsPopoutHtmlToLocale(nextLoc)
    for (const w of BrowserWindow.getAllWindows()) {
      if (!w.isDestroyed()) {
        w.webContents.send(mw.uiLocaleChanged, nextLoc)
      }
    }
  }
  h.refreshEnginePathOverridesSnapshot()
  const panels = next.mainWindowUiPanels ?? {}
  for (const w of BrowserWindow.getAllWindows()) {
    if (!w.isDestroyed()) {
      w.webContents.send(mw.mainWindowUiPanelsChanged, panels)
      w.webContents.send(mw.enginePathsChanged)
      w.webContents.send(mw.settingsBackupImported)
    }
  }
  h.refreshYtdlpFromSettings()
  h.buildApplicationMenu()
}

export function applyImportedAppSettings(partial: Record<string, unknown>): AppSettings {
  const h = requireHooks()
  const prev = h.getSettings()
  const next = hydrateAppSettingsFromPartial(partial)
  h.replaceSettings(next)
  h.saveSettings()
  broadcastSettingsReplacements(prev, next)
  return next
}

export async function exportSettingsBackupWithDialog(
  win?: BrowserWindowType
): Promise<
  { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
> {
  const h = requireHooks()
  const M = h.mainAppStr()
  const parent = win && !win.isDestroyed() ? win : (BrowserWindow.getFocusedWindow() ?? undefined)
  if (!parent) {
    return { ok: false, error: M.exportNoActiveWindow }
  }
  const stamp = new Date().toISOString().slice(0, 10)
  const pick = await dialog.showSaveDialog(parent, {
    title: M.settingsBackupExportTitle,
    defaultPath: `fluxalloy-settings-${stamp}.json`,
    filters: [{ name: M.settingsBackupExportFilter, extensions: ['json'] }]
  })
  if (pick.canceled || !pick.filePath) {
    return { ok: false, cancelled: true }
  }
  try {
    const payload = buildSettingsBackupFileV1(
      stripExportUserPresetsFromSettingsForDisk(h.getSettings())
    )
    writeFileSync(pick.filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8')
    await dialog.showMessageBox(parent, {
      type: 'info',
      title: M.settingsBackupExportOkTitle,
      message: M.settingsBackupExportOkMessage,
      detail: pick.filePath
    })
    return { ok: true, path: pick.filePath }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
}

export async function importSettingsBackupWithDialog(
  win?: BrowserWindowType
): Promise<{ ok: true } | { ok: false; cancelled: true } | { ok: false; error: string }> {
  const h = requireHooks()
  const M = h.mainAppStr()
  const parent = win && !win.isDestroyed() ? win : (BrowserWindow.getFocusedWindow() ?? undefined)
  if (!parent) {
    return { ok: false, error: M.exportNoActiveWindow }
  }
  const pick = await dialog.showOpenDialog(parent, {
    title: M.settingsBackupImportTitle,
    properties: ['openFile'],
    filters: [{ name: M.settingsBackupImportFilter, extensions: ['json'] }]
  })
  if (pick.canceled || pick.filePaths.length === 0) {
    return { ok: false, cancelled: true }
  }
  const filePath = pick.filePaths[0]
  if (typeof filePath !== 'string' || filePath.length === 0) {
    return { ok: false, error: M.ipcInvalidRequest }
  }
  let parsed: unknown
  try {
    const text = readFileSync(filePath, 'utf-8')
    parsed = JSON.parse(text) as unknown
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await dialog.showMessageBox(parent, {
      type: 'error',
      title: M.settingsBackupParseErrorTitle,
      message: M.settingsBackupParseErrorMessage,
      detail: message
    })
    return { ok: false, error: message }
  }
  const payload = extractSettingsPayloadFromBackupJson(parsed)
  if (payload === null) {
    await dialog.showMessageBox(parent, {
      type: 'error',
      title: M.settingsBackupParseErrorTitle,
      message: M.settingsBackupParseErrorMessage,
      detail: basename(filePath)
    })
    return { ok: false, error: M.ipcInvalidRequest }
  }
  const confirm = await dialog.showMessageBox(parent, {
    type: 'warning',
    title: M.settingsBackupImportConfirmTitle,
    message: M.settingsBackupImportConfirmMessage,
    detail: basename(filePath),
    buttons: [M.settingsBackupImportConfirm, M.settingsBackupImportCancel],
    defaultId: 0,
    cancelId: 1
  })
  if (confirm.response !== 0) {
    return { ok: false, cancelled: true }
  }
  applyImportedAppSettings(payload)
  await dialog.showMessageBox(parent, {
    type: 'info',
    title: M.settingsBackupImportOkTitle,
    message: M.settingsBackupImportOkMessage,
    detail: basename(filePath)
  })
  return { ok: true }
}

/** Сброс settings.json к заводским значениям; геометрия окон сохраняется. */
export function resetAppSettingsToDefaultsKeepingWindowBounds(): AppSettings {
  const h = requireHooks()
  const prev = h.getSettings()
  const partial: Record<string, unknown> = { ...settingsStoreDefaults }
  if (prev.windowBounds !== undefined) {
    partial['windowBounds'] = prev.windowBounds
  }
  return applyImportedAppSettings(partial)
}
