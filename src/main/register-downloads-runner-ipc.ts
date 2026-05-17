import { ipcMain } from 'electron'

import {
  pauseActiveYtdlpProcess,
  resumeActiveYtdlpProcess,
  getActiveYtdlpPauseState
} from './ytdlp-download-service'
import { downloadsIpc as d } from '../shared/ipc-channels'
import { emitDownloadsLog } from './downloads-log-ipc'
import {
  cancelDownloadsRunner,
  getActiveDownloadsRunnerRowId,
  startDownloadSingleRow,
  startDownloadsSequential
} from './downloads-queue-runner'
import { getDownloadsQueueSnapshot, resetDownloadsQueueRowForRetry } from './downloads-queue'
import { isYtdlpQueueStatusRunningLike } from '../shared/ytdlp-queue-status'
import { logError } from './logger-service'
import {
  broadcastDownloadsSnapshot,
  ipcStr,
  ipcUiLocale,
  isDownloadsOrMainSender
} from './downloads-window-runtime'

export function registerDownloadsRunnerIpcHandlers(): void {
  ipcMain.handle(
    d.startQueue,
    async (event): Promise<{ ok: true } | { ok: false; error: string }> => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }

      return startDownloadsSequential(ipcUiLocale(event.sender))
    }
  )

  ipcMain.handle(
    d.startRow,
    async (event, id: unknown): Promise<{ ok: true } | { ok: false; error: string }> => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      if (typeof id !== 'number' || !Number.isFinite(id)) {
        return { ok: false, error: P.invalidRowId }
      }
      try {
        return await startDownloadSingleRow(id, ipcUiLocale(event.sender))
      } catch (err: unknown) {
        logError('downloads-queue', 'startDownloadSingleRow failed', err)
        return { ok: false, error: err instanceof Error ? err.message : String(err) }
      }
    }
  )

  ipcMain.handle(
    d.retryRow,
    async (event, id: unknown): Promise<{ ok: true } | { ok: false; error: string }> => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      if (typeof id !== 'number' || !Number.isFinite(id)) {
        return { ok: false, error: P.invalidRowId }
      }
      const current = getDownloadsQueueSnapshot().find((row) => row.id === id)
      if (!current) {
        return { ok: false, error: P.rowNotFound }
      }
      if (isYtdlpQueueStatusRunningLike(current.status)) {
        return { ok: false, error: P.cannotRetryWhileRunning }
      }
      if (!resetDownloadsQueueRowForRetry(id)) {
        return { ok: false, error: P.failedToResetRow }
      }
      broadcastDownloadsSnapshot()
      try {
        return await startDownloadSingleRow(id, ipcUiLocale(event.sender))
      } catch (err: unknown) {
        logError('downloads-queue', 'retry row failed', err)
        return { ok: false, error: err instanceof Error ? err.message : String(err) }
      }
    }
  )

  ipcMain.handle(d.cancelRun, (event): { ok: true } | { ok: false; error: string } => {
    const P = ipcStr(event.sender)
    if (!isDownloadsOrMainSender(event.sender)) {
      return { ok: false, error: P.invalidSender }
    }
    cancelDownloadsRunner()
    broadcastDownloadsSnapshot()

    return { ok: true }
  })

  ipcMain.handle(
    d.getYtdlpPauseState,
    (event): { supported: boolean; active: boolean; paused: boolean } => {
      if (!isDownloadsOrMainSender(event.sender)) {
        return { supported: false, active: false, paused: false }
      }
      return getActiveYtdlpPauseState()
    }
  )

  ipcMain.handle(d.pauseYtdlp, (event): { ok: true } | { ok: false; error: string } => {
    const P = ipcStr(event.sender)
    const loc = ipcUiLocale(event.sender)
    if (!isDownloadsOrMainSender(event.sender)) {
      return { ok: false, error: P.invalidSender }
    }
    const res = pauseActiveYtdlpProcess(loc)
    if (res.ok) {
      const rowId = getActiveDownloadsRunnerRowId()
      if (rowId !== null) {
        emitDownloadsLog({
          kind: 'line',
          rowId,
          stream: 'stderr',
          text: P.logYtdlpPausedSigstop
        })
      }
    }
    return res
  })

  ipcMain.handle(d.resumeYtdlp, (event): { ok: true } | { ok: false; error: string } => {
    const P = ipcStr(event.sender)
    const loc = ipcUiLocale(event.sender)
    if (!isDownloadsOrMainSender(event.sender)) {
      return { ok: false, error: P.invalidSender }
    }
    const res = resumeActiveYtdlpProcess(loc)
    if (res.ok) {
      const rowId = getActiveDownloadsRunnerRowId()
      if (rowId !== null) {
        emitDownloadsLog({
          kind: 'line',
          rowId,
          stream: 'stderr',
          text: P.logYtdlpResumedSigcont
        })
      }
    }
    return res
  })
}
