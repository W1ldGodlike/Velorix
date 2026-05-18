import { BrowserWindow } from 'electron'

import { downloadsIpc as d } from '../shared/ipc-channels'

export function broadcastDownloadsHistoryChanged(): void {
  for (const w of BrowserWindow.getAllWindows()) {
    if (!w.isDestroyed()) {
      w.webContents.send(d.downloadsHistoryChanged)
    }
  }
}
