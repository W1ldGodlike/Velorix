import { ipcMain } from 'electron'

import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import { isNativeMainWindows } from '../../shared/native-main-platform'
import { getMainApplicationStrings } from '../../shared/main-runtime-locale'
import type { AppSettings } from '../settings-store'
import {
  isWindowsExplorerContextMenuRegistered,
  registerWindowsExplorerContextMenu,
  syncWindowsExplorerContextMenuEnabled,
  unregisterWindowsExplorerContextMenu
} from '../windows-explorer-context-menu-sync'
import {
  isWindowsFileAssociationRegistered,
  registerWindowsFileAssociation,
  syncWindowsFileAssociationEnabled,
  unregisterWindowsFileAssociation
} from '../windows-file-association-sync'
import { openWindowsDefaultAppsSettings } from '../windows-default-apps-settings'

let ipcRegistered = false

export type WindowsShellContextMenuIpcDeps = {
  getSettings: () => AppSettings
  mutateSettings: (mutate: (prev: AppSettings) => AppSettings) => AppSettings
  mainUiLocale: () => import('../../shared/app-ui-locale').AppUiLocale
}

function setOpenWithEnabledFlag(
  deps: WindowsShellContextMenuIpcDeps,
  enabled: boolean
): AppSettings {
  return deps.mutateSettings((prev) => {
    const next = { ...prev }
    if (enabled) {
      next.windowsOpenWithFluxAlloy = true
    } else {
      delete next.windowsOpenWithFluxAlloy
    }
    return next
  })
}

function setExplorerMenuEnabledFlag(
  deps: WindowsShellContextMenuIpcDeps,
  enabled: boolean
): AppSettings {
  return deps.mutateSettings((prev) => {
    const next = { ...prev }
    if (enabled) {
      next.windowsExplorerContextMenu = true
    } else {
      delete next.windowsExplorerContextMenu
    }
    return next
  })
}

export function registerWindowsShellContextMenuIpc(deps: WindowsShellContextMenuIpcDeps): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  ipcMain.handle(mw.windowsExplorerContextMenuStatus, async () => {
    const settings = deps.getSettings()
    return {
      supported: isNativeMainWindows(),
      enabledInSettings: settings.windowsExplorerContextMenu === true,
      registered: await isWindowsExplorerContextMenuRegistered()
    }
  })

  ipcMain.handle(mw.windowsExplorerContextMenuSetEnabled, async (_, raw: unknown) => {
    if (!isNativeMainWindows()) {
      return { ok: true as const }
    }
    const enabled = raw === true
    const loc = deps.mainUiLocale()
    const M = getMainApplicationStrings(loc)
    const labels = {
      open: M.windowsExplorerContextMenuOpen,
      quickMp4: M.windowsExplorerContextMenuQuickMp4
    }
    const sync = await syncWindowsExplorerContextMenuEnabled(enabled, labels)
    if (!sync.ok) {
      return sync
    }
    setExplorerMenuEnabledFlag(deps, enabled)
    return { ok: true as const }
  })

  ipcMain.handle(mw.windowsExplorerContextMenuRegisterNow, async () => {
    if (!isNativeMainWindows()) {
      return { ok: true as const }
    }
    const loc = deps.mainUiLocale()
    const M = getMainApplicationStrings(loc)
    return registerWindowsExplorerContextMenu(process.execPath, {
      open: M.windowsExplorerContextMenuOpen,
      quickMp4: M.windowsExplorerContextMenuQuickMp4
    })
  })

  ipcMain.handle(mw.windowsExplorerContextMenuUnregister, async () => {
    await unregisterWindowsExplorerContextMenu()
    setExplorerMenuEnabledFlag(deps, false)
    return { ok: true as const }
  })

  ipcMain.handle(mw.windowsFileAssociationStatus, async () => {
    const settings = deps.getSettings()
    return {
      supported: isNativeMainWindows(),
      enabledInSettings: settings.windowsOpenWithFluxAlloy === true,
      registered: await isWindowsFileAssociationRegistered()
    }
  })

  ipcMain.handle(mw.windowsFileAssociationSetEnabled, async (_, raw: unknown) => {
    if (!isNativeMainWindows()) {
      return { ok: true as const }
    }
    const enabled = raw === true
    const M = getMainApplicationStrings(deps.mainUiLocale())
    const sync = await syncWindowsFileAssociationEnabled(enabled, M.windowsFileAssociationTypeName)
    if (!sync.ok) {
      return sync
    }
    setOpenWithEnabledFlag(deps, enabled)
    return { ok: true as const }
  })

  ipcMain.handle(mw.windowsFileAssociationRegisterNow, async () => {
    if (!isNativeMainWindows()) {
      return { ok: true as const }
    }
    const M = getMainApplicationStrings(deps.mainUiLocale())
    return registerWindowsFileAssociation(process.execPath, M.windowsFileAssociationTypeName)
  })

  ipcMain.handle(mw.windowsFileAssociationUnregister, async () => {
    await unregisterWindowsFileAssociation(process.execPath)
    setOpenWithEnabledFlag(deps, false)
    return { ok: true as const }
  })

  ipcMain.handle(mw.openWindowsDefaultAppsSettings, async () => {
    return openWindowsDefaultAppsSettings()
  })
}
