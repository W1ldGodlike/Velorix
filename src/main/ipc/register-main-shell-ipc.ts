import { ipcMain } from 'electron'

import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import { closeMainWindowFromShellChrome, mainWindowRef } from '../windows/main-window-runtime-state'

let ipcRegistered = false

export function registerMainShellIpcHandlers(): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  ipcMain.handle(mw.shellRequestClose, () => {
    closeMainWindowFromShellChrome()
  })

  ipcMain.handle(mw.shellRequestMinimize, () => {
    const win = mainWindowRef
    if (win != null && !win.isDestroyed()) {
      win.minimize()
    }
  })
}
