import { BrowserWindow, ipcMain } from 'electron'

import { downloadsIpc as d } from '../../../shared/ipc-channels'
import {
  getDownloadsBoundsHooks,
  ipcStr,
  isDownloadsOrMainSender
} from '../../windows/downloads-window-runtime'

export function registerDownloadsOptionsIpcCookiesHandlers(): void {
  ipcMain.handle(
    d.pickCookiesFile,
    async (
      event
    ): Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      const fn = getDownloadsBoundsHooks().pickYtdlpCookiesFile
      if (!fn) {
        return { ok: false, error: P.pickCookiesNotConnected }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win || win.isDestroyed()) {
        return { ok: false, error: P.noWindow }
      }
      return fn(win)
    }
  )

  ipcMain.handle(d.clearCookiesFile, (event): { ok: true } | { ok: false; error: string } => {
    const P = ipcStr(event.sender)
    if (!isDownloadsOrMainSender(event.sender)) {
      return { ok: false, error: P.invalidSender }
    }
    const fn = getDownloadsBoundsHooks().clearYtdlpCookiesFile
    if (!fn) {
      return { ok: false, error: P.clearCookiesNotConnected }
    }
    fn()
    return { ok: true }
  })
}
