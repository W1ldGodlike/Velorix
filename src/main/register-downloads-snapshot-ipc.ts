import { ipcMain } from 'electron'

import { isYtdlpQueueStatusDone } from '../shared/ytdlp-queue-status'
import { downloadsIpc as d } from '../shared/ipc-channels'
import {
  appendUrlsFromMultilineBlock,
  enqueueFirstWaitingUrlFromBlock,
  getDownloadsQueueRowById
} from './downloads-queue'
import { isDownloadsRunnerBusy, startDownloadSingleRow } from './downloads-queue-runner'
import {
  broadcastDownloadsSnapshot,
  getDownloadsQueueSnapshotForRenderer,
  ipcStr,
  ipcUiLocale,
  isDownloadsOrMainSender,
  resolveAllowedDownloadOutputPath,
  getDownloadsBoundsHooks
} from './downloads-window-runtime'

export function registerDownloadsSnapshotIpcHandlers(): void {
  ipcMain.handle(d.getSnapshot, (event) => {
    if (!isDownloadsOrMainSender(event.sender)) {
      return []
    }
    return getDownloadsQueueSnapshotForRenderer()
  })

  ipcMain.handle(
    d.addLines,
    (event, text: unknown): { ok: true; added: number } | { ok: false; error: string } => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      if (typeof text !== 'string') {
        return { ok: false, error: P.invalidUrlText }
      }
      const n = appendUrlsFromMultilineBlock(text)
      broadcastDownloadsSnapshot()
      return { ok: true, added: n }
    }
  )

  ipcMain.handle(
    d.downloadFirstUrlOpenInMainEditor,
    async (event, raw: unknown): Promise<{ ok: true } | { ok: false; error: string }> => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      if (typeof raw !== 'string') {
        return { ok: false, error: P.invalidUrlText }
      }
      if (isDownloadsRunnerBusy()) {
        return { ok: false, error: P.downloadAlreadyRunning }
      }
      const enqueued = enqueueFirstWaitingUrlFromBlock(raw)
      if (!enqueued) {
        return { ok: false, error: P.invalidUrlText }
      }
      const { id: rowId } = enqueued
      broadcastDownloadsSnapshot()
      const loc = ipcUiLocale(event.sender)
      const started = await startDownloadSingleRow(rowId, loc)
      if (!started.ok) {
        return started
      }
      const row = getDownloadsQueueRowById(rowId)
      if (!row) {
        return { ok: false, error: P.rowNotFound }
      }
      if (!isYtdlpQueueStatusDone(row.status)) {
        const st = row.status.trim().slice(0, 200)
        return { ok: false, error: `${P.downloadOpenEditorNotReady} ${st}` }
      }
      const out = row.outputPath?.trim()
      if (!out) {
        return { ok: false, error: P.queueRowNoOutputPath }
      }
      const file = resolveAllowedDownloadOutputPath(out)
      if (!file) {
        return { ok: false, error: P.fileOutsideDownloadDir }
      }
      const fn = getDownloadsBoundsHooks().openDownloadedFileInHandler
      if (!fn) {
        return { ok: false, error: P.handlerNotConnected }
      }
      return fn(file)
    }
  )
}
