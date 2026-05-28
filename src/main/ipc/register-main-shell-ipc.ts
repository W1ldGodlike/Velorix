import { ipcMain } from 'electron'

import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import { mainWindowRef } from '../windows/main-window-runtime-state'

let ipcRegistered = false

export function registerMainShellIpcHandlers(): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  ipcMain.handle(mw.shellRequestClose, () => {
    const win = mainWindowRef
    if (win != null && !win.isDestroyed()) {
      win.close()
    }
  })

  ipcMain.handle(mw.shellRequestMinimize, () => {
    const win = mainWindowRef
    if (win != null && !win.isDestroyed()) {
      win.minimize()
    }
  })
}
