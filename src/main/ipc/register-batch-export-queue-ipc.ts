import { existsSync, statSync } from 'fs'
import { normalize } from 'path'

import { BrowserWindow, ipcMain, shell } from 'electron'

import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import { collectDownloadsQueueVideoPaths } from '../../shared/ffmpeg-export-batch-collect-paths'
import { resolveAppPaths } from '../app-paths'
import { filterExistingVideoPathsForBatch } from '../ffmpeg-export-batch-grant-paths'
import {
  addFfmpegExportBatchPaths,
  clearFfmpegExportBatchQueue,
  getFfmpegExportBatchSnapshot,
  listFfmpegExportBatchInputPaths,
  listFfmpegExportBatchOutputPaths,
  moveFfmpegExportBatchRow,
  removeCompletedFfmpegExportBatchRows,
  removeFfmpegExportBatchRows,
  markWaitingFfmpegExportBatchRowsCancelled,
  removeWaitingFfmpegExportBatchRows,
  reorderFfmpegExportBatchRowAt,
  retryFailedFfmpegExportBatchRows,
  retryFfmpegExportBatchRows,
  setFfmpegExportBatchConcurrency
} from '../ffmpeg-export-batch-queue'
import {
  cancelFfmpegExportBatchRunner,
  isFfmpegExportBatchActive,
  runFfmpegExportBatchQueue
} from '../ffmpeg-export-batch-runner'
import {
  pickFfmpegExportBatchInputFiles,
  pickFfmpegExportBatchInputFolder,
  pickFfmpegExportBatchOutputFolder
} from '../ffmpeg-export-batch-pick'
import { expandFfmpegExportBatchDnDPaths } from '../ffmpeg-export-batch-folder-scan'
import { openFfmpegExportBatchInputPath } from '../ffmpeg-export-batch-open-input'
import type {
  FfmpegExportBatchClearCompletedResult,
  FfmpegExportBatchRetryFailedResult,
  FfmpegExportBatchSnapshot,
  FfmpegExportBatchStartResult
} from '../../shared/ffmpeg-export-batch-contract'
import { findProcessingHistoryEntryById } from '../processing-history'
import { resolveEngineExecutablePath } from '../engine-service'
import { grantMediaPath } from '../media-protocol'
import { getDownloadsQueueSnapshot } from '../downloads-queue'
import type { ExportBatchIpcContext } from './export-batch-ipc-context'

export function registerBatchExportQueueIpcHandlers(ctx: ExportBatchIpcContext): void {
  const { host, pushBatchExportSnapshot } = ctx
  ipcMain.handle(mw.batchExportGetSnapshot, (): FfmpegExportBatchSnapshot => {
    return getFfmpegExportBatchSnapshot()
  })
  ipcMain.handle(mw.batchExportListInputPaths, (): { ok: true; paths: string[] } => {
    return { ok: true, paths: listFfmpegExportBatchInputPaths() }
  })
  ipcMain.handle(mw.batchExportListOutputPaths, (): { ok: true; paths: string[] } => {
    return { ok: true, paths: listFfmpegExportBatchOutputPaths() }
  })
  ipcMain.handle(
    mw.batchExportRemoveWaiting,
    (): { ok: true; removed: number } | { ok: false; error: string } => {
      const M = host.mainAppStr()
      if (isFfmpegExportBatchActive()) {
        return { ok: false, error: M.batchExportRunningCantMutate }
      }
      const removed = removeWaitingFfmpegExportBatchRows()
      pushBatchExportSnapshot()
      return { ok: true, removed }
    }
  )
  ipcMain.handle(
    mw.batchExportPickFiles,
    async (
      event
    ): Promise<
      { ok: true; added: number } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, error: host.mainAppStr().openVideoDialogNoWindow }
      }
      const loc = host.mainDownloadsUiLocale()
      const def = host.previewOpenDialogOptsFromSettings()
      const picked = await pickFfmpegExportBatchInputFiles(win, loc, def)
      if (!picked.ok) {
        return picked
      }
      const counts = addFfmpegExportBatchPaths(picked.paths)
      pushBatchExportSnapshot(win)
      return { ok: true, ...counts }
    }
  )
  ipcMain.handle(
    mw.batchExportPickFolder,
    async (
      event
    ): Promise<
      { ok: true; added: number } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, error: host.mainAppStr().openVideoDialogNoWindow }
      }
      const loc = host.mainDownloadsUiLocale()
      const def = host.previewOpenDialogOptsFromSettings()
      const picked = await pickFfmpegExportBatchInputFolder(win, loc, def)
      if (!picked.ok) {
        return picked
      }
      const counts = addFfmpegExportBatchPaths(picked.paths)
      pushBatchExportSnapshot(win)
      return { ok: true, ...counts }
    }
  )
  ipcMain.handle(
    mw.batchExportPickOutputFolder,
    async (event): Promise<{ ok: true; path: string } | { ok: false; cancelled: true }> => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, cancelled: true }
      }
      const loc = host.mainDownloadsUiLocale()
      const def = host.batchExportOutputFolderPickOptsFromSettings()
      return pickFfmpegExportBatchOutputFolder(win, loc, def)
    }
  )
  ipcMain.handle(
    mw.batchExportRevealSharedOutputFolder,
    async (): Promise<{ ok: true } | { ok: false; error: string }> => {
      const M = host.mainAppStr()
      const raw = host.getSettings().ffmpegExportBatchOutputDirectory
      if (typeof raw !== 'string' || raw.trim().length === 0) {
        return { ok: false, error: M.batchExportSharedOutputDirNotSet }
      }
      const dir = normalize(raw.trim())
      if (!existsSync(dir)) {
        return { ok: false, error: M.batchExportSharedOutputDirMissing }
      }
      try {
        if (!statSync(dir).isDirectory()) {
          return { ok: false, error: M.batchExportSharedOutputDirNotDirectory }
        }
      } catch {
        return { ok: false, error: M.batchExportSharedOutputDirMissing }
      }
      const err = await shell.openPath(dir)
      return err ? { ok: false, error: err } : { ok: true }
    }
  )
  ipcMain.handle(
    mw.batchExportAddPaths,
    (_event, raw: unknown): { ok: true; added: number } | { ok: false; error: string } => {
      if (!Array.isArray(raw)) {
        return { ok: false, error: host.mainAppStr().ipcInvalidRequest }
      }
      const paths = raw.filter((p): p is string => typeof p === 'string')
      const expanded = expandFfmpegExportBatchDnDPaths(paths)
      const granted: string[] = []
      for (const abs of expanded) {
        if (grantMediaPath(abs)) {
          granted.push(abs)
        }
      }
      const counts = addFfmpegExportBatchPaths(granted)
      pushBatchExportSnapshot()
      return { ok: true, ...counts }
    }
  )
  ipcMain.handle(
    mw.batchExportRemoveRows,
    (_event, raw: unknown): { ok: true; removed: number } => {
      const ids = Array.isArray(raw) ? raw.filter((n): n is number => typeof n === 'number') : []
      const removed = removeFfmpegExportBatchRows(ids)
      pushBatchExportSnapshot()
      return { ok: true, removed }
    }
  )
  ipcMain.handle(mw.batchExportClear, (): { ok: true } => {
    clearFfmpegExportBatchQueue()
    pushBatchExportSnapshot()
    return { ok: true }
  })
  ipcMain.handle(
    mw.batchExportMoveRow,
    (_event, raw: unknown): { ok: true; moved: boolean } | { ok: false; error: string } => {
      if (!raw || typeof raw !== 'object') {
        return { ok: false, error: host.mainAppStr().ipcInvalidRequest }
      }
      const id = (raw as { id?: unknown }).id
      const direction = (raw as { direction?: unknown }).direction
      if (typeof id !== 'number' || (direction !== 'up' && direction !== 'down')) {
        return { ok: false, error: host.mainAppStr().ipcInvalidRequest }
      }
      const moved = moveFfmpegExportBatchRow(id, direction)
      pushBatchExportSnapshot()
      return { ok: true, moved }
    }
  )
  ipcMain.handle(
    mw.batchExportReorderRow,
    (_event, raw: unknown): { ok: true; moved: boolean } | { ok: false; error: string } => {
      if (!raw || typeof raw !== 'object') {
        return { ok: false, error: host.mainAppStr().ipcInvalidRequest }
      }
      const id = (raw as { id?: unknown }).id
      const toIndex = (raw as { toIndex?: unknown }).toIndex
      if (typeof id !== 'number' || typeof toIndex !== 'number' || !Number.isFinite(toIndex)) {
        return { ok: false, error: host.mainAppStr().ipcInvalidRequest }
      }
      const moved = reorderFfmpegExportBatchRowAt(id, Math.trunc(toIndex))
      pushBatchExportSnapshot()
      return { ok: true, moved }
    }
  )
  ipcMain.handle(mw.batchExportSetConcurrency, (_event, raw: unknown): { ok: true } => {
    setFfmpegExportBatchConcurrency(raw)
    pushBatchExportSnapshot()
    return { ok: true }
  })
  ipcMain.handle(
    mw.batchExportStart,
    async (event, raw: unknown): Promise<FfmpegExportBatchStartResult> => {
      const M = host.mainAppStr()
      if (host.getActiveExportAbort() !== null || isFfmpegExportBatchActive()) {
        return { ok: false, error: M.batchExportAlreadyRunning }
      }
      const snap = getFfmpegExportBatchSnapshot()
      if (!snap.rows.some((r) => r.status === 'waiting')) {
        return { ok: false, error: M.batchExportQueueEmpty }
      }
      const paths = resolveAppPaths()
      const ffmpeg = resolveEngineExecutablePath(
        paths,
        'ffmpeg',
        host.getSettings().engineExecutablePaths
      )
      if (!ffmpeg) {
        return { ok: false, error: M.batchExportFfmpegMissing }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!host.launchFfmpegExportBatchRunner(raw, win)) {
        return { ok: false, error: M.batchExportAlreadyRunning }
      }
      return { ok: true }
    }
  )
  ipcMain.handle(mw.batchExportCancel, (): { ok: true } => {
    cancelFfmpegExportBatchRunner()
    markWaitingFfmpegExportBatchRowsCancelled()
    pushBatchExportSnapshot()
    return { ok: true }
  })
  ipcMain.handle(mw.batchExportRetryFailed, (): FfmpegExportBatchRetryFailedResult => {
    const M = host.mainAppStr()
    if (isFfmpegExportBatchActive()) {
      return { ok: false, error: M.batchExportRunningCantMutate }
    }
    const reset = retryFailedFfmpegExportBatchRows()
    pushBatchExportSnapshot()
    return { ok: true, reset }
  })
  ipcMain.handle(
    mw.batchExportRetryRows,
    (_event, raw: unknown): FfmpegExportBatchRetryFailedResult => {
      const M = host.mainAppStr()
      if (isFfmpegExportBatchActive()) {
        return { ok: false, error: M.batchExportRunningCantMutate }
      }
      const ids = Array.isArray(raw) ? raw.filter((n): n is number => typeof n === 'number') : []
      if (ids.length === 0) {
        return { ok: false, error: M.ipcInvalidRequest }
      }
      const reset = retryFfmpegExportBatchRows({ ids, includeCancelled: true })
      pushBatchExportSnapshot()
      return { ok: true, reset }
    }
  )
  ipcMain.handle(mw.batchExportClearCompleted, (): FfmpegExportBatchClearCompletedResult => {
    const M = host.mainAppStr()
    if (isFfmpegExportBatchActive()) {
      return { ok: false, error: M.batchExportRunningCantMutate }
    }
    const removed = removeCompletedFfmpegExportBatchRows()
    pushBatchExportSnapshot()
    return { ok: true, removed }
  })
  ipcMain.handle(
    mw.batchExportAddFromDownloadsDone,
    (_event, raw: unknown): { ok: true; added: number } | { ok: false; error: string } => {
      const M = host.mainAppStr()
      if (isFfmpegExportBatchActive()) {
        return { ok: false, error: M.batchExportRunningCantMutate }
      }
      const ids = Array.isArray(raw) ? raw.filter((n): n is number => typeof n === 'number') : []
      const candidates = collectDownloadsQueueVideoPaths(getDownloadsQueueSnapshot(), {
        ...(ids.length > 0 ? { ids } : {}),
        doneOnly: true
      })
      const granted = filterExistingVideoPathsForBatch(candidates)
      const counts = addFfmpegExportBatchPaths(granted)
      pushBatchExportSnapshot()
      return { ok: true, ...counts }
    }
  )
  ipcMain.handle(
    mw.batchExportAddFromHistoryInputs,
    (_event, raw: unknown): { ok: true; added: number } | { ok: false; error: string } => {
      const M = host.mainAppStr()
      if (isFfmpegExportBatchActive()) {
        return { ok: false, error: M.batchExportRunningCantMutate }
      }
      const ids = Array.isArray(raw) ? raw.filter((id): id is string => typeof id === 'string') : []
      if (ids.length === 0) {
        return { ok: false, error: M.ipcInvalidRequest }
      }
      const paths = resolveAppPaths()
      const candidates: string[] = []
      for (const id of ids) {
        const entry = findProcessingHistoryEntryById(paths.userData, id)
        if (entry?.inputPath) {
          candidates.push(entry.inputPath)
        }
      }
      const granted = filterExistingVideoPathsForBatch(candidates)
      const counts = addFfmpegExportBatchPaths(granted)
      pushBatchExportSnapshot()
      return { ok: true, ...counts }
    }
  )
  ipcMain.handle(
    mw.batchExportOpenInput,
    async (
      _event,
      raw: unknown
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> => {
      if (!raw || typeof raw !== 'object') {
        return { ok: false, error: host.mainAppStr().exportOpenBadRequest }
      }
      const payload = raw as { path?: unknown; mode?: unknown }
      return openFfmpegExportBatchInputPath(payload.path, payload.mode, host.mainAppStr(), {
        openInMainHandler: host.openDownloadedFileInMainHandler
      })
    }
  )
  ipcMain.handle(
    mw.batchExportRetryFailedAndStart,
    async (event, raw: unknown): Promise<FfmpegExportBatchStartResult> => {
      const M = host.mainAppStr()
      if (host.getActiveExportAbort() !== null || isFfmpegExportBatchActive()) {
        return { ok: false, error: M.batchExportAlreadyRunning }
      }
      retryFailedFfmpegExportBatchRows()
      pushBatchExportSnapshot()
      const snap = getFfmpegExportBatchSnapshot()
      if (!snap.rows.some((r) => r.status === 'waiting')) {
        return { ok: false, error: M.batchExportQueueEmpty }
      }
      const paths = resolveAppPaths()
      const ffmpeg = resolveEngineExecutablePath(
        paths,
        'ffmpeg',
        host.getSettings().engineExecutablePaths
      )
      if (!ffmpeg) {
        return { ok: false, error: M.batchExportFfmpegMissing }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      const loc = host.mainDownloadsUiLocale()
      void runFfmpegExportBatchQueue({
        ffmpegPath: ffmpeg,
        settings: host.getSettings(),
        lutResourcesRoot: paths.resources,
        rawExportOverrides: raw,
        userDataRoot: paths.userData,
        rememberExportOutputPath: host.rememberExportOutputPath,
        rememberFfmpegExportDirectory: host.rememberFfmpegExportDirectory,
        uiLocale: loc,
        pushRowProgress: (rowId, p) => {
          if (win && !win.isDestroyed()) {
            win.webContents.send(mw.exportProgress, { ...p, batchRowId: rowId })
          }
        }
      }).finally(() => {
        pushBatchExportSnapshot(win)
      })
      pushBatchExportSnapshot(win)
      return { ok: true }
    }
  )
}
