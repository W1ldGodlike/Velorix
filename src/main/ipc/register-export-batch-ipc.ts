import { existsSync, statSync } from 'fs'
import { basename, normalize, resolve } from 'path'

import { BrowserWindow, dialog, ipcMain, shell } from 'electron'

import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import { FFMPEG_EXPORT_CANCELLED_ERROR } from '../../shared/ffmpeg-export-contract'
import { collectDownloadsQueueVideoPaths } from '../../shared/ffmpeg-export-batch-collect-paths'
import {
  exportProgressLaunchingFfmpeg,
  processingHistoryFfmpegExportCancelled,
  processingHistoryFfmpegExportFailed,
  processingHistoryFfmpegExportSuccess,
  processingHistorySnapshotFailed,
  processingHistorySnapshotSuccess
} from '../../shared/processing-history-status-locale'
import {
  parseDownloadsWindowUiLocale,
  type DownloadsWindowUiLocale
} from '../../shared/downloads-window-ui-locale'
import { getMainApplicationStrings } from '../../shared/main-application-locale'
import { resolveAppPaths } from '../app-paths'
import { filterExistingVideoPathsForBatch } from '../ffmpeg-export-batch-grant-paths'
import {
  addFfmpegExportBatchPaths,
  clearFfmpegExportBatchQueue,
  getFfmpegExportBatchSnapshot,
  listFfmpegExportBatchInputPaths,
  listFfmpegExportBatchOutputPaths,
  markWaitingFfmpegExportBatchRowsCancelled,
  moveFfmpegExportBatchRow,
  removeCompletedFfmpegExportBatchRows,
  removeFfmpegExportBatchRows,
  removeWaitingFfmpegExportBatchRows,
  reorderFfmpegExportBatchRowAt,
  retryFailedFfmpegExportBatchRows,
  retryFfmpegExportBatchRows,
  setFfmpegExportBatchConcurrency
} from '../ffmpeg-export-batch-queue'
import {
  cancelFfmpegExportBatchRunner,
  isFfmpegExportBatchActive,
  runFfmpegExportBatchQueue,
  setFfmpegExportBatchRunnerNotifier
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
import { appendProcessingHistoryEntry, findProcessingHistoryEntryById } from '../processing-history'
import {
  ensureFfmpegSnapshotExtension,
  parseFfmpegSnapshotFormat,
  runFfmpegSnapshotFrame
} from '../ffmpeg-frame-snapshot-service'
import { ensureFfmpegExportExtension } from '../ffmpeg-export-app-settings-merge'
import {
  parseFfmpegExportTrim,
  parseFfmpegExportVideoLut3d,
  runFfmpegExportJob,
  type MediaExportStartResult,
  type FfmpegExportProgressPayload
} from '../ffmpeg-export-service'
import { resolveFfmpegExportJobOptionsFromAppSettings } from '../ffmpeg-export-resolve-from-settings'
import { resolveFfmpegExportLutCubeAbsPath } from '../ffmpeg-export-lut-path'
import { resolveEngineExecutablePath } from '../engine-service'
import { grantMediaPath, isGrantedMediaPath } from '../media-protocol'
import { getDownloadsQueueSnapshot } from '../downloads-queue'
import type { AppSettings } from '../settings-store'
import { focusOrCreateDownloadsWindow } from '../downloads-window'

let ipcRegistered = false

export type ExportBatchIpcHost = {
  getActiveExportAbort: () => AbortController | null
  setActiveExportAbort: (ac: AbortController | null) => void
  getSettings: () => AppSettings
  bindBatchSnapshotBroadcast: (fn: (win?: BrowserWindow | null) => void) => void
  launchFfmpegExportBatchRunner: (raw: unknown, win?: BrowserWindow | null) => boolean
  mainAppStr: () => ReturnType<typeof getMainApplicationStrings>
  mainDownloadsUiLocale: () => DownloadsWindowUiLocale
  previewOpenDialogOptsFromSettings: () => { defaultPath: string } | undefined
  batchExportOutputFolderPickOptsFromSettings: () => { defaultPath: string } | undefined
  rememberedExportDefaultPath: (fileName: string) => string
  rememberExportOutputPath: (filePath: string) => void
  rememberFfmpegExportDirectory: (outputPath: string) => void
  rememberedSnapshotDefaultPath: (fileName: string) => string
  rememberFfmpegSnapshotDirectory: (outputPath: string) => void
  openExportOutputPath: (
    rawPath: unknown,
    rawMode: unknown
  ) => Promise<{ ok: true; path: string } | { ok: false; error: string }>
  openDownloadedFileInMainHandler: (
    absoluteFile: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>
  parseDownloadsOpenRequest: (raw: unknown) => {
    mergeText: string | null
    uiLocale?: DownloadsWindowUiLocale
  }
}

export function registerExportBatchIpcHandlers(host: ExportBatchIpcHost): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  const pushBatchExportSnapshot = (win?: BrowserWindow | null): void => {
    const snap = getFfmpegExportBatchSnapshot()
    const targets = win ? [win] : BrowserWindow.getAllWindows().filter((w) => !w.isDestroyed())
    for (const w of targets) {
      w.webContents.send(mw.batchExportSnapshot, snap)
    }
  }
  host.bindBatchSnapshotBroadcast(pushBatchExportSnapshot)
  setFfmpegExportBatchRunnerNotifier(() => {
    pushBatchExportSnapshot()
  })

  ipcMain.handle(mw.openDownloadsWindow, (_, raw: unknown) => {
    const req = host.parseDownloadsOpenRequest(raw)
    focusOrCreateDownloadsWindow(req.mergeText, req.uiLocale)
  })
  ipcMain.handle(mw.exportResolveBundledLutCubePath, (_event, raw: unknown): string | null => {
    const id = parseFfmpegExportVideoLut3d(raw)
    const paths = resolveAppPaths()
    return resolveFfmpegExportLutCubeAbsPath(paths.resources, id)
  })
  ipcMain.handle(mw.exportStart, async (event, raw: unknown): Promise<MediaExportStartResult> => {
    const base = host.mainAppStr()
    if (host.getActiveExportAbort() !== null || isFfmpegExportBatchActive()) {
      return { ok: false, error: base.exportAlreadyRunning }
    }
    if (!raw || typeof raw !== 'object') {
      return { ok: false, error: base.exportInvalidRequest }
    }
    const exportUiLocale =
      parseDownloadsWindowUiLocale((raw as { uiLocale?: unknown }).uiLocale) ??
      host.mainDownloadsUiLocale()
    const M = getMainApplicationStrings(exportUiLocale)
    const inputRaw = (raw as { inputPath?: unknown }).inputPath
    if (typeof inputRaw !== 'string' || inputRaw.trim().length === 0) {
      return { ok: false, error: M.exportInputMissing }
    }
    const abs = resolve(normalize(inputRaw.trim()))
    if (!existsSync(abs)) {
      return { ok: false, error: M.exportFileNotFound }
    }
    if (!isGrantedMediaPath(abs)) {
      return {
        ok: false,
        error: M.exportNotGrantedPath
      }
    }
    const pd = (raw as { probeDurationSec?: unknown }).probeDurationSec
    const probeDurationSec = typeof pd === 'number' && Number.isFinite(pd) && pd > 0 ? pd : null
    const trim = parseFfmpegExportTrim((raw as { trim?: unknown }).trim)
    const exportOpts = resolveFfmpegExportJobOptionsFromAppSettings(host.getSettings(), raw)
    const exportContainer = exportOpts.container
    const paths = resolveAppPaths()
    const ffmpeg = resolveEngineExecutablePath(
      paths,
      'ffmpeg',
      host.getSettings().engineExecutablePaths
    )
    if (!ffmpeg) {
      return { ok: false, error: M.exportFfmpegMissing }
    }
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) {
      return { ok: false, error: M.exportNoActiveWindow }
    }
    const stem = basename(abs).replace(/\.[^.]+$/, '')
    const defaultExportName = `${stem}-export.${exportContainer}`
    const pick = await dialog.showSaveDialog(win, {
      title: M.exportVideoDialogTitle,
      defaultPath: host.rememberedExportDefaultPath(defaultExportName),
      filters: [
        { name: M.exportFilterMp4, extensions: ['mp4'] },
        { name: M.exportFilterMkv, extensions: ['mkv'] },
        { name: M.exportFilterMov, extensions: ['mov'] },
        { name: M.exportFilterAll, extensions: ['*'] }
      ]
    })
    if (pick.canceled || !pick.filePath || pick.filePath.trim().length === 0) {
      return { ok: false, cancelled: true }
    }
    const outPath = ensureFfmpegExportExtension(pick.filePath, exportContainer)
    const ac = new AbortController()
    host.setActiveExportAbort(ac)
    const startedAt = Date.now()
    const pushProgress = (p: FfmpegExportProgressPayload): void => {
      win.webContents.send(mw.exportProgress, p)
    }
    try {
      pushProgress({ percent: -1, message: exportProgressLaunchingFfmpeg(exportUiLocale) })
      const result = await runFfmpegExportJob({
        ffmpegPath: ffmpeg,
        inputPath: abs,
        outputPath: outPath,
        ...(trim !== undefined ? { trim } : {}),
        probeDurationSec,
        ...exportOpts,
        lutResourcesRoot: paths.resources,
        signal: ac.signal,
        onProgress: pushProgress,
        uiLocale: exportUiLocale
      })
      if (result.ok) {
        host.rememberExportOutputPath(outPath)
        host.rememberFfmpegExportDirectory(outPath)
        appendProcessingHistoryEntry(paths.userData, {
          kind: 'ffmpegExport',
          startedAt,
          finishedAt: Date.now(),
          inputPath: abs,
          outputPath: outPath,
          outcome: 'success',
          status: processingHistoryFfmpegExportSuccess(exportUiLocale),
          errorHint: null,
          exportVideoCodecUsed: result.videoCodecUsed
        })
        return { ok: true, path: outPath }
      }
      if (result.error === FFMPEG_EXPORT_CANCELLED_ERROR) {
        appendProcessingHistoryEntry(paths.userData, {
          kind: 'ffmpegExport',
          startedAt,
          finishedAt: Date.now(),
          inputPath: abs,
          outputPath: outPath,
          outcome: 'cancelled',
          status: processingHistoryFfmpegExportCancelled(exportUiLocale),
          errorHint: null,
          exportVideoCodecUsed: result.videoCodecUsed
        })
        return { ok: false, cancelled: true }
      }
      appendProcessingHistoryEntry(paths.userData, {
        kind: 'ffmpegExport',
        startedAt,
        finishedAt: Date.now(),
        inputPath: abs,
        outputPath: outPath,
        outcome: 'error',
        status: processingHistoryFfmpegExportFailed(exportUiLocale),
        errorHint: result.error,
        exportVideoCodecUsed: result.videoCodecUsed
      })
      return { ok: false, error: result.error }
    } finally {
      host.setActiveExportAbort(null)
    }
  })
  ipcMain.handle(mw.exportCancel, (): { ok: true } | { ok: false; error: string } => {
    if (host.getActiveExportAbort() === null && !isFfmpegExportBatchActive()) {
      return { ok: false, error: host.mainAppStr().exportCancelNoActive }
    }
    host.getActiveExportAbort()?.abort()
    cancelFfmpegExportBatchRunner()
    markWaitingFfmpegExportBatchRowsCancelled()
    pushBatchExportSnapshot()
    return { ok: true }
  })

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
  ipcMain.handle(
    mw.exportOpenOutput,
    async (
      _event,
      raw: unknown
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> => {
      if (!raw || typeof raw !== 'object') {
        return { ok: false, error: host.mainAppStr().exportOpenBadRequest }
      }
      const payload = raw as { path?: unknown; mode?: unknown }
      return host.openExportOutputPath(payload.path, payload.mode)
    }
  )
  ipcMain.handle(
    mw.snapshotFrame,
    async (
      event,
      raw: unknown
    ): Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, error: host.mainAppStr().ipcNoActiveWindow }
      }
      if (!raw || typeof raw !== 'object') {
        return { ok: false, error: host.mainAppStr().ipcInvalidRequest }
      }
      const snapUiLocale =
        parseDownloadsWindowUiLocale((raw as { uiLocale?: unknown }).uiLocale) ??
        host.mainDownloadsUiLocale()
      const M = getMainApplicationStrings(snapUiLocale)
      const inputRaw = (raw as { inputPath?: unknown }).inputPath
      const timeRaw = (raw as { timeSec?: unknown }).timeSec
      if (typeof inputRaw !== 'string' || inputRaw.trim().length === 0) {
        return { ok: false, error: M.exportInputMissing }
      }
      const abs = resolve(normalize(inputRaw.trim()))
      if (!existsSync(abs)) {
        return { ok: false, error: M.exportFileNotFound }
      }
      if (!isGrantedMediaPath(abs)) {
        return { ok: false, error: M.exportNotGrantedPath }
      }
      const timeSec =
        typeof timeRaw === 'number' && Number.isFinite(timeRaw) ? Math.max(0, timeRaw) : 0
      const paths = resolveAppPaths()
      const ffmpeg = resolveEngineExecutablePath(
        paths,
        'ffmpeg',
        host.getSettings().engineExecutablePaths
      )
      if (!ffmpeg) {
        return { ok: false, error: M.exportFfmpegMissing }
      }
      const stem = basename(abs).replace(/\.[^.]+$/, '')
      const snapshotFormat = parseFfmpegSnapshotFormat(host.getSettings().ffmpegSnapshotFormat)
      const pick = await dialog.showSaveDialog(win, {
        title: M.snapshotSaveDialogTitle,
        defaultPath: host.rememberedSnapshotDefaultPath(`${stem}-frame.${snapshotFormat}`),
        filters: [
          { name: M.snapshotFilterPng, extensions: ['png'] },
          { name: M.snapshotFilterJpeg, extensions: ['jpg', 'jpeg'] }
        ]
      })
      if (pick.canceled || !pick.filePath || pick.filePath.trim().length === 0) {
        return { ok: false, cancelled: true }
      }
      const outPath = ensureFfmpegSnapshotExtension(pick.filePath, snapshotFormat)
      const startedAt = Date.now()
      const result = await runFfmpegSnapshotFrame({
        ffmpegPath: ffmpeg,
        inputPath: abs,
        outputPath: outPath,
        timeSec
      })
      if (result.ok) {
        host.rememberExportOutputPath(outPath)
        host.rememberFfmpegSnapshotDirectory(outPath)
        appendProcessingHistoryEntry(paths.userData, {
          kind: 'ffmpegSnapshot',
          startedAt,
          finishedAt: Date.now(),
          inputPath: abs,
          outputPath: outPath,
          outcome: 'success',
          status: processingHistorySnapshotSuccess(snapUiLocale),
          errorHint: null
        })
        return { ok: true, path: outPath }
      }
      appendProcessingHistoryEntry(paths.userData, {
        kind: 'ffmpegSnapshot',
        startedAt,
        finishedAt: Date.now(),
        inputPath: abs,
        outputPath: outPath,
        outcome: 'error',
        status: processingHistorySnapshotFailed(snapUiLocale),
        errorHint: result.error
      })
      return result
    }
  )
}
