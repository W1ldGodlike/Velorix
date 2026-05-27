import { ipcMain } from 'electron'

import { downloadsIpc as d, mainWindowIpc as mw } from '../../../shared/ipc-channels'
import { focusOrCreateInspectorWindow } from '../../windows/inspector-window'
import {
  ipcStr,
  isDownloadsOrMainSender,
  resolveMainEditorWindow
} from '../../windows/downloads-window-runtime'

export function registerDownloadsBridgeIpcHandlers(): void {
  ipcMain.handle(
    d.bridgeOpenInspector,
    (event, raw: unknown): { ok: true } | { ok: false; error: string } => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      const p = typeof raw === 'string' && raw.trim().length > 0 ? raw : undefined
      focusOrCreateInspectorWindow(p)
      return { ok: true }
    }
  )

  ipcMain.handle(d.bridgeFocusMainEditor, (event): { ok: true } | { ok: false; error: string } => {
    const P = ipcStr(event.sender)
    if (!isDownloadsOrMainSender(event.sender)) {
      return { ok: false, error: P.invalidSender }
    }
    const w = resolveMainEditorWindow()
    if (!w || w.isDestroyed()) {
      return { ok: false, error: P.mainWindowNotFound }
    }
    w.show()
    w.focus()
    return { ok: true }
  })

  ipcMain.handle(d.bridgeOpenEnginePaths, (event): { ok: true } | { ok: false; error: string } => {
    const P = ipcStr(event.sender)
    if (!isDownloadsOrMainSender(event.sender)) {
      return { ok: false, error: P.invalidSender }
    }
    const w = resolveMainEditorWindow()
    if (!w || w.isDestroyed()) {
      return { ok: false, error: P.mainWindowNotFound }
    }
    w.webContents.send(mw.openSettings, 'dependencies')
    w.show()
    w.focus()
    return { ok: true }
  })

  ipcMain.handle(d.bridgeOpenAbout, (event): { ok: true } | { ok: false; error: string } => {
    const P = ipcStr(event.sender)
    if (!isDownloadsOrMainSender(event.sender)) {
      return { ok: false, error: P.invalidSender }
    }
    const w = resolveMainEditorWindow()
    if (!w || w.isDestroyed()) {
      return { ok: false, error: P.mainWindowNotFound }
    }
    w.webContents.send(mw.openAbout)
    w.show()
    w.focus()
    return { ok: true }
  })
}
