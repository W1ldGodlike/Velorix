import { BrowserWindow } from 'electron'

import { mainWindowIpc as mw } from '../../../shared/ipc-channels'

export function broadcastProcessingHistoryChanged(): void {
  for (const w of BrowserWindow.getAllWindows()) {
    if (!w.isDestroyed()) {
      w.webContents.send(mw.processingHistoryChanged)
    }
  }
}
