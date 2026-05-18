import { app } from 'electron'

import { isWindowsFileAssociationHeadlessArgv } from '../shared/windows-file-association'
import { isWindowsExplorerShellHeadlessArgv } from '../shared/windows-explorer-context-menu'
import { isNativeMainWindows } from '../shared/native-main-platform'
import { getMainApplicationStrings } from '../shared/main-runtime-locale'
import { logInfo } from './logger-service'
import {
  registerWindowsExplorerContextMenu,
  unregisterWindowsExplorerContextMenu
} from './windows-explorer-context-menu-sync'
import {
  registerWindowsFileAssociation,
  unregisterWindowsFileAssociation
} from './windows-file-association-sync'

/** §14 — reg.exe без UI (installer NSIS / portable script). */
export async function runWindowsExplorerShellHeadlessCliIfRequested(): Promise<boolean> {
  const openWithMode = isWindowsFileAssociationHeadlessArgv()
  const mode = isWindowsExplorerShellHeadlessArgv()
  if (!openWithMode && !mode) {
    return false
  }
  if (!isNativeMainWindows()) {
    app.quit()
    return true
  }
  await app.whenReady()
  const M = getMainApplicationStrings('ru')
  const labels = {
    open: M.windowsExplorerContextMenuOpen,
    quickMp4: M.windowsExplorerContextMenuQuickMp4
  }
  if (mode === 'unregister') {
    await unregisterWindowsExplorerContextMenu()
    logInfo('shell', 'headless explorer menu unregister done')
  } else if (mode === 'register') {
    const res = await registerWindowsExplorerContextMenu(process.execPath, labels)
    logInfo(
      'shell',
      res.ok ? 'headless explorer menu register done' : `register failed: ${res.error}`
    )
  }
  if (openWithMode === 'unregister') {
    await unregisterWindowsFileAssociation(process.execPath)
    logInfo('shell', 'headless open-with unregister done')
  } else if (openWithMode === 'register') {
    const res = await registerWindowsFileAssociation(
      process.execPath,
      M.windowsFileAssociationTypeName
    )
    logInfo(
      'shell',
      res.ok ? 'headless open-with register done' : `open-with register failed: ${res.error}`
    )
  }
  app.quit()
  return true
}
