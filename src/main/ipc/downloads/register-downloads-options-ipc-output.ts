import { BrowserWindow, ipcMain, shell } from 'electron'

import { resolveAppPaths } from '../../core/app-paths'
import {
  isYtdlpDownloadDirectoryDefault,
  resolveYtdlpOutputDirectory
} from '../../services/ytdlp/ytdlp-download-output'
import { downloadsIpc as d } from '../../../shared/ipc-channels'
import {
  getDownloadsBoundsHooks,
  ipcStr,
  isDownloadsOrMainSender
} from '../../windows/downloads-window-runtime'

export function registerDownloadsOptionsIpcOutputHandlers(): void {
  ipcMain.handle(
    d.getOutputDir,
    (
      event
    ): {
      path: string
      isDefault: boolean
    } => {
      if (!isDownloadsOrMainSender(event.sender)) {
        return { path: '', isDefault: true }
      }
      const paths = resolveAppPaths()
      return {
        path: resolveYtdlpOutputDirectory(paths.userData),
        isDefault: isYtdlpDownloadDirectoryDefault()
      }
    }
  )

  ipcMain.handle(
    d.openOutputDir,
    async (event): Promise<{ ok: true } | { ok: false; error: string }> => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      const paths = resolveAppPaths()
      const target = resolveYtdlpOutputDirectory(paths.userData)
      const result = await shell.openPath(target)
      return result.length === 0 ? { ok: true } : { ok: false, error: result }
    }
  )

  ipcMain.handle(
    d.pickOutputDir,
    async (
      event
    ): Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      const fn = getDownloadsBoundsHooks().pickYtdlpOutputDirectory
      if (!fn) {
        return { ok: false, error: P.pickDirectoryNotConnected }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win || win.isDestroyed()) {
        return { ok: false, error: P.noWindow }
      }
      return fn(win)
    }
  )

  ipcMain.handle(d.clearOutputDir, (event): { ok: true } | { ok: false; error: string } => {
    const P = ipcStr(event.sender)
    if (!isDownloadsOrMainSender(event.sender)) {
      return { ok: false, error: P.invalidSender }
    }
    const fn = getDownloadsBoundsHooks().clearYtdlpOutputDirectoryOverride
    if (!fn) {
      return { ok: false, error: P.clearDirectoryNotConnected }
    }
    fn()
    return { ok: true }
  })
}
