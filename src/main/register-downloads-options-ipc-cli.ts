import { ipcMain } from 'electron'

import type { YtdlpDownloadOptionsPayload } from './ytdlp-download-options'
import { parseYtdlpDownloadOptionsIpcPatch } from './ytdlp-download-options-ipc-patch'
import { downloadsIpc as d } from '../shared/ipc-channels'
import {
  getDownloadsBoundsHooks,
  ipcStr,
  ipcUiLocale,
  isDownloadsOrMainSender
} from './downloads-window-runtime'

export function registerDownloadsOptionsIpcCliHandlers(): void {
  ipcMain.handle(
    d.getCliOptions,
    (
      event,
      raw?: unknown
    ): { ok: true; payload: YtdlpDownloadOptionsPayload } | { ok: false; error: string } => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      const fn = getDownloadsBoundsHooks().getYtdlpDownloadCliOptions
      if (!fn) {
        return { ok: false, error: P.ytdlpOptionsNotConnected }
      }
      return { ok: true, payload: fn(raw, ipcUiLocale(event.sender)) }
    }
  )

  ipcMain.handle(
    d.setCliOptions,
    (event, raw: unknown): { ok: true } | { ok: false; error: string } => {
      const P = ipcStr(event.sender)
      const loc = ipcUiLocale(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      const fn = getDownloadsBoundsHooks().applyYtdlpDownloadCliPatch
      if (!fn) {
        return { ok: false, error: P.ytdlpOptionsNotConnected }
      }
      const parsed = parseYtdlpDownloadOptionsIpcPatch(raw, P, loc)
      if (!parsed.ok) {
        return parsed
      }
      return fn(parsed.patch, loc)
    }
  )
}
