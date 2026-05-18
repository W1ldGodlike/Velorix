import { app } from 'electron'

import { isWindowsExplorerShellHeadlessArgv } from '../shared/windows-explorer-context-menu'
import { isNativeMainWindows } from '../shared/native-main-platform'
import { getMainApplicationStrings } from '../shared/main-runtime-locale'
import { logInfo } from './logger-service'
import {
  registerWindowsExplorerContextMenu,
  unregisterWindowsExplorerContextMenu
} from './windows-explorer-context-menu-sync'

/** §14 — reg.exe без UI (installer NSIS / portable script). */
export async function runWindowsExplorerShellHeadlessCliIfRequested(): Promise<boolean> {
  const mode = isWindowsExplorerShellHeadlessArgv()
  if (!mode) {
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
  } else {
    const res = await registerWindowsExplorerContextMenu(process.execPath, labels)
    logInfo(
      'shell',
      res.ok ? 'headless explorer menu register done' : `register failed: ${res.error}`
    )
  }
  app.quit()
  return true
}
