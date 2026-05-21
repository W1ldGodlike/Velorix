import { mkdirSync, writeFileSync } from 'fs'
import { BrowserWindow, dialog, ipcMain, shell } from 'electron'

import { DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED } from '../../../shared/downloads-log-contract'
import { isYtdlpQueueStatusDone } from '../../../shared/ytdlp-queue-status'
import { downloadsIpc as d } from '../../../shared/ipc-channels'
import { resolveAppPaths } from '../../core/app-paths'
import {
  clearDownloadsQueue,
  clearFinishedDownloadsQueueRows,
  getDownloadsQueueRowById,
  moveDownloadsQueueRow,
  removeDownloadsQueueRow
} from '../../services/downloads/downloads-queue'
import {
  cancelDownloadsRunner,
  getActiveDownloadsRunnerRowId,
  waitUntilRowNotActiveRunner
} from '../../services/downloads/downloads-queue-runner'
import { logError, logWarn } from '../../core/logger-service'
import {
  clearYtdlpDownloadHistory,
  getYtdlpDownloadHistoryWeeklySummary,
  readYtdlpDownloadHistoryNewestFirst
} from '../../services/ytdlp/ytdlp-download-history'
import { forceKillActiveYtdlpForDownloadsCancel } from '../../services/ytdlp/ytdlp-download-service'
import {
  deleteIncompleteDownloadArtifactsForQueueRow,
  resolveYtdlpOutputDirectory
} from '../../services/ytdlp/ytdlp-download-output'
import {
  broadcastDownloadsSnapshot,
  ipcStr,
  isDownloadOutputOpenMode,
  isDownloadsOrMainSender,
  openDownloadOutputInHandler,
  openDownloadOutputPath
} from '../../windows/downloads-window-runtime'

export function registerDownloadsQueueIpcHandlers(): void {
  ipcMain.handle(d.clear, (event): { ok: true } | { ok: false; error: string } => {
    const P = ipcStr(event.sender)
    if (!isDownloadsOrMainSender(event.sender)) {
      return { ok: false, error: P.invalidSender }
    }
    cancelDownloadsRunner()
    clearDownloadsQueue()
    broadcastDownloadsSnapshot()
    return { ok: true }
  })

  ipcMain.handle(
    d.clearFinished,
    (event): { ok: true; removed: number } | { ok: false; error: string } => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      const removed = clearFinishedDownloadsQueueRows()
      broadcastDownloadsSnapshot()
      return { ok: true, removed }
    }
  )

  /** §6.4 — чтение истории завершённых загрузок (newest first). */
  ipcMain.handle(d.getHistory, (event) => {
    if (!isDownloadsOrMainSender(event.sender)) {
      return []
    }
    const paths = resolveAppPaths()
    return readYtdlpDownloadHistoryNewestFirst(paths.userData, 100)
  })

  ipcMain.handle(d.getHistoryWeeklySummary, (event) => {
    if (!isDownloadsOrMainSender(event.sender)) {
      return { since: 0, until: 0, total: 0, success: 0, error: 0, cancelled: 0 }
    }
    return getYtdlpDownloadHistoryWeeklySummary(resolveAppPaths().userData)
  })

  ipcMain.handle(d.clearHistory, (event): { ok: true } | { ok: false; error: string } => {
    const P = ipcStr(event.sender)
    if (!isDownloadsOrMainSender(event.sender)) {
      return { ok: false, error: P.invalidSender }
    }
    const paths = resolveAppPaths()
    clearYtdlpDownloadHistory(paths.userData)
    return { ok: true }
  })

  ipcMain.handle(
    d.saveVisibleLog,
    async (
      event,
      raw: unknown
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      if (typeof raw !== 'string' || raw.trim().length === 0) {
        return { ok: false, error: P.logEmpty }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win || win.isDestroyed()) {
        return { ok: false, error: P.noWindow }
      }
      const text = raw.length > 260_000 ? raw.slice(-260_000) : raw
      const stamp = new Date().toISOString().replace(/[:.]/g, '-')
      const pick = await dialog.showSaveDialog(win, {
        title: P.saveLogDialogTitle,
        defaultPath: `fluxalloy-ytdlp-${stamp}.log`,
        filters: [
          { name: P.saveLogFilterLog, extensions: ['log'] },
          { name: P.saveLogFilterText, extensions: ['txt'] }
        ]
      })
      if (pick.canceled || !pick.filePath) {
        return { ok: false, error: DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED }
      }
      try {
        writeFileSync(pick.filePath, text, 'utf-8')
        return { ok: true, path: pick.filePath }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        logError('downloads-window', 'save yt-dlp visible log failed', err)
        return { ok: false, error: msg }
      }
    }
  )

  ipcMain.handle(
    d.openQueueOutput,
    async (
      event,
      id: unknown,
      modeRaw: unknown
    ): Promise<{ ok: true } | { ok: false; error: string }> => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      if (typeof id !== 'number' || !Number.isFinite(id) || !isDownloadOutputOpenMode(modeRaw)) {
        return { ok: false, error: P.badOpenFileRequest }
      }
      const row = getDownloadsQueueRowById(id)
      if (!row) {
        return { ok: false, error: P.rowNotFound }
      }
      if (modeRaw === 'folder' && (!row.outputPath || row.outputPath.trim().length === 0)) {
        const paths = resolveAppPaths()
        const dir = resolveYtdlpOutputDirectory(paths.userData)
        try {
          mkdirSync(dir, { recursive: true })
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          logError('downloads-window', 'mkdir download output dir failed', err)
          return { ok: false, error: msg }
        }
        try {
          const err = await shell.openPath(dir)
          return err ? { ok: false, error: err } : { ok: true }
        } catch (err) {
          return { ok: false, error: err instanceof Error ? err.message : String(err) }
        }
      }
      if (!row.outputPath) {
        return { ok: false, error: P.queueRowNoOutputPath }
      }
      return openDownloadOutputPath(row.outputPath, modeRaw, P)
    }
  )

  ipcMain.handle(
    d.openHistoryOutput,
    async (
      event,
      id: unknown,
      modeRaw: unknown
    ): Promise<{ ok: true } | { ok: false; error: string }> => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      if (typeof id !== 'string' || id.length === 0 || !isDownloadOutputOpenMode(modeRaw)) {
        return { ok: false, error: P.badOpenHistoryRequest }
      }
      const paths = resolveAppPaths()
      const entry = readYtdlpDownloadHistoryNewestFirst(paths.userData, 500).find(
        (e) => e.id === id
      )
      if (!entry?.outputPath) {
        return { ok: false, error: P.historyEntryNoOutputPath }
      }
      return openDownloadOutputPath(entry.outputPath, modeRaw, P)
    }
  )

  ipcMain.handle(
    d.openQueueOutputInHandler,
    async (event, id: unknown): Promise<{ ok: true } | { ok: false; error: string }> => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      if (typeof id !== 'number' || !Number.isFinite(id)) {
        return { ok: false, error: P.invalidRowId }
      }
      const row = getDownloadsQueueRowById(id)
      if (!row?.outputPath) {
        return { ok: false, error: P.queueRowNoOutputPath }
      }
      return openDownloadOutputInHandler(row.outputPath, P)
    }
  )

  ipcMain.handle(
    d.openHistoryOutputInHandler,
    async (event, id: unknown): Promise<{ ok: true } | { ok: false; error: string }> => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      if (typeof id !== 'string' || id.length === 0) {
        return { ok: false, error: P.invalidHistoryId }
      }
      const paths = resolveAppPaths()
      const entry = readYtdlpDownloadHistoryNewestFirst(paths.userData, 500).find(
        (e) => e.id === id
      )
      if (!entry?.outputPath) {
        return { ok: false, error: P.historyEntryNoOutputPath }
      }
      return openDownloadOutputInHandler(entry.outputPath, P)
    }
  )

  ipcMain.handle(
    d.remove,
    async (event, id: unknown): Promise<{ ok: true } | { ok: false; error: string }> => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      if (typeof id !== 'number' || !Number.isFinite(id)) {
        return { ok: false, error: P.invalidRowId }
      }
      const row = getDownloadsQueueRowById(id)
      if (!row) {
        return { ok: false, error: P.rowNotFound }
      }
      const wasActive = getActiveDownloadsRunnerRowId() === id
      if (wasActive) {
        cancelDownloadsRunner()
        await waitUntilRowNotActiveRunner(id, 12_000)
        if (getActiveDownloadsRunnerRowId() === id) {
          forceKillActiveYtdlpForDownloadsCancel()
          await waitUntilRowNotActiveRunner(id, 4000)
        }
        if (getActiveDownloadsRunnerRowId() === id) {
          logWarn(
            'downloads-window',
            'active download row still marked runner-active after cancel + force-kill; proceeding with cleanup'
          )
        }
      }
      const rowForCleanup = getDownloadsQueueRowById(id) ?? row
      if (!isYtdlpQueueStatusDone(rowForCleanup.status)) {
        try {
          deleteIncompleteDownloadArtifactsForQueueRow(resolveAppPaths().userData, rowForCleanup)
        } catch (err) {
          logError('downloads-window', 'delete incomplete download artifacts failed', err)
        }
      }
      if (!removeDownloadsQueueRow(id)) {
        return { ok: false, error: P.rowNotFound }
      }
      broadcastDownloadsSnapshot()
      return { ok: true }
    }
  )

  ipcMain.handle(d.move, (event, id: unknown, direction: unknown) => {
    const P = ipcStr(event.sender)
    if (!isDownloadsOrMainSender(event.sender)) {
      return { ok: false, error: P.invalidSender }
    }
    if (typeof id !== 'number' || !Number.isFinite(id)) {
      return { ok: false, error: P.invalidRowId }
    }
    const delta = direction === -1 || direction === 1 ? direction : 0
    if (delta === 0) {
      return { ok: false, error: P.invalidMoveDirection }
    }
    if (!moveDownloadsQueueRow(id, delta)) {
      return { ok: false, error: P.cannotMoveRowThatWay }
    }
    broadcastDownloadsSnapshot()
    return { ok: true }
  })
}
