import { app, dialog, ipcMain, shell, BrowserWindow } from 'electron'
import { mkdirSync, writeFileSync } from 'fs'

import { resolveAppPaths } from './app-paths'
import { DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED } from '../shared/downloads-log-contract'
import { isYtdlpQueueStatusDone, isYtdlpQueueStatusRunningLike } from '../shared/ytdlp-queue-status'
import {
  isYtdlpDownloadDirectoryDefault,
  resolveYtdlpOutputDirectory,
  deleteIncompleteDownloadArtifactsForQueueRow
} from './ytdlp-download-output'
import {
  forceKillActiveYtdlpForDownloadsCancel,
  pauseActiveYtdlpProcess,
  resumeActiveYtdlpProcess
} from './ytdlp-download-service'
import {
  parseYtdlpCookiesBrowser,
  parseYtdlpFormatPreset,
  parseYtdlpImpersonate,
  parseYtdlpSubtitlePreset,
  type YtdlpDownloadOptionsPatch,
  type YtdlpDownloadOptionsPayload
} from './ytdlp-download-options'
import { validateYtdlpCookiesBrowserProfile } from './ytdlp-extra-args'
import { parseYtdlpQueueRetryProfile } from './ytdlp-queue-retry'
import {
  clearYtdlpDownloadHistory,
  getYtdlpDownloadHistoryWeeklySummary,
  readYtdlpDownloadHistoryNewestFirst
} from './ytdlp-download-history'
import { logError, logWarn } from './logger-service'
import {
  attachDownloadsQueuePersistOnQuitOnce,
  hydrateDownloadsQueueFromDisk
} from './ytdlp-download-queue-persist'
import { downloadsIpc as d, mainWindowIpc as mw } from '../shared/ipc-channels'
import { focusOrCreateInspectorWindow } from './inspector-window'
import {
  appendUrlsFromMultilineBlock,
  clearFinishedDownloadsQueueRows,
  clearDownloadsQueue,
  enqueueFirstWaitingUrlFromBlock,
  getDownloadsQueueRowById,
  moveDownloadsQueueRow,
  removeDownloadsQueueRow,
  resetDownloadsQueueRowForRetry
} from './downloads-queue'
import {
  cancelDownloadsRunner,
  getActiveDownloadsRunnerRowId,
  isDownloadsRunnerBusy,
  setDownloadsRunnerNotifier,
  startDownloadSingleRow,
  startDownloadsSequential,
  waitUntilRowNotActiveRunner
} from './downloads-queue-runner'
import { getDownloadsQueueSnapshot } from './downloads-queue'
import { getActiveYtdlpPauseState } from './ytdlp-download-service'
import { emitDownloadsLog, setDownloadsLogSink } from './downloads-log-ipc'
import {
  broadcastDownloadsSnapshot,
  broadcastDownloadsLogPayload,
  getDownloadsBoundsHooks,
  getDownloadsQueueSnapshotForRenderer,
  ipcStr,
  ipcUiLocale,
  isDownloadsOrMainSender,
  openDownloadOutputInHandler,
  openDownloadOutputPath,
  resolveAllowedDownloadOutputPath,
  resolveMainEditorWindow,
  sanitizeDownloadsUiPanelPatch,
  isDownloadOutputOpenMode
} from './downloads-window-runtime'

let ipcRegistered = false

export function registerDownloadsWindowIpcHandlers(): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  const pathsBoot = resolveAppPaths()
  hydrateDownloadsQueueFromDisk(pathsBoot.userData)
  attachDownloadsQueuePersistOnQuitOnce(app)

  setDownloadsRunnerNotifier(() => {
    broadcastDownloadsSnapshot()
  })
  setDownloadsLogSink(broadcastDownloadsLogPayload)

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
      if (!raw || typeof raw !== 'object') {
        return { ok: false, error: P.invalidData }
      }
      const o = raw as Record<string, unknown>
      const patch: YtdlpDownloadOptionsPatch = {}
      if (Object.prototype.hasOwnProperty.call(o, 'filenameTemplate')) {
        if (typeof o['filenameTemplate'] !== 'string') {
          return { ok: false, error: P.filenameTemplateMustBeString }
        }
        patch.filenameTemplate = o['filenameTemplate']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'formatPreset')) {
        patch.formatPreset = parseYtdlpFormatPreset(o['formatPreset'])
      }
      if (Object.prototype.hasOwnProperty.call(o, 'downloadPlaylist')) {
        if (typeof o['downloadPlaylist'] !== 'boolean') {
          return { ok: false, error: P.playlistMustBeBoolean }
        }
        patch.downloadPlaylist = o['downloadPlaylist']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'audioOnly')) {
        if (typeof o['audioOnly'] !== 'boolean') {
          return { ok: false, error: P.audioOnlyMustBeBoolean }
        }
        patch.audioOnly = o['audioOnly']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'subtitlePreset')) {
        patch.subtitlePreset = parseYtdlpSubtitlePreset(o['subtitlePreset'])
      }
      if (Object.prototype.hasOwnProperty.call(o, 'subLangs')) {
        if (typeof o['subLangs'] !== 'string') {
          return { ok: false, error: P.subLangsMustBeString }
        }
        patch.subLangs = o['subLangs']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'cookiesBrowser')) {
        if (typeof o['cookiesBrowser'] !== 'string') {
          return { ok: false, error: P.cookiesBrowserMustBeString }
        }
        const cv = o['cookiesBrowser']
        if (cv === 'none') {
          patch.cookiesBrowser = 'none'
        } else {
          const b = parseYtdlpCookiesBrowser(cv)
          if (!b) {
            return { ok: false, error: P.invalidCookiesBrowserValue }
          }
          patch.cookiesBrowser = b
        }
      }
      if (Object.prototype.hasOwnProperty.call(o, 'cookiesBrowserProfile')) {
        if (typeof o['cookiesBrowserProfile'] !== 'string') {
          return { ok: false, error: P.cookiesBrowserProfileMustBeString }
        }
        const pr = validateYtdlpCookiesBrowserProfile(o['cookiesBrowserProfile'], loc)
        if (!pr.ok) {
          return { ok: false, error: pr.error }
        }
        patch.cookiesBrowserProfile = pr.value
      }
      if (Object.prototype.hasOwnProperty.call(o, 'impersonate')) {
        if (typeof o['impersonate'] !== 'string') {
          return { ok: false, error: P.impersonateMustBeString }
        }
        const iv = o['impersonate']
        if (iv === 'none') {
          patch.impersonate = 'none'
        } else {
          const im = parseYtdlpImpersonate(iv)
          if (!im) {
            return { ok: false, error: P.invalidImpersonateValue }
          }
          patch.impersonate = im
        }
      }
      if (Object.prototype.hasOwnProperty.call(o, 'rateLimit')) {
        if (typeof o['rateLimit'] !== 'string') {
          return { ok: false, error: P.rateLimitMustBeString }
        }
        patch.rateLimit = o['rateLimit']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'retriesLine')) {
        if (typeof o['retriesLine'] !== 'string') {
          return { ok: false, error: P.retriesMustBeString }
        }
        patch.retriesLine = o['retriesLine']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'fragmentRetriesLine')) {
        if (typeof o['fragmentRetriesLine'] !== 'string') {
          return { ok: false, error: P.fragmentRetriesMustBeString }
        }
        patch.fragmentRetriesLine = o['fragmentRetriesLine']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'extraArgsLine')) {
        if (typeof o['extraArgsLine'] !== 'string') {
          return { ok: false, error: P.extraArgsMustBeString }
        }
        patch.extraArgsLine = o['extraArgsLine']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'queueRetryProfile')) {
        patch.queueRetryProfile = parseYtdlpQueueRetryProfile(o['queueRetryProfile'])
      }
      if (Object.prototype.hasOwnProperty.call(o, 'openInHandlerOnComplete')) {
        if (typeof o['openInHandlerOnComplete'] !== 'boolean') {
          return { ok: false, error: P.openInHandlerFlagMustBeBoolean }
        }
        patch.openInHandlerOnComplete = o['openInHandlerOnComplete']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'autoExportAfterOpenInHandler')) {
        if (typeof o['autoExportAfterOpenInHandler'] !== 'boolean') {
          return { ok: false, error: P.autoExportFlagMustBeBoolean }
        }
        patch.autoExportAfterOpenInHandler = o['autoExportAfterOpenInHandler']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'enqueueBatchOnDownloadComplete')) {
        if (typeof o['enqueueBatchOnDownloadComplete'] !== 'boolean') {
          return { ok: false, error: P.enqueueBatchFlagMustBeBoolean }
        }
        patch.enqueueBatchOnDownloadComplete = o['enqueueBatchOnDownloadComplete']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'autoStartBatchAfterEnqueue')) {
        if (typeof o['autoStartBatchAfterEnqueue'] !== 'boolean') {
          return { ok: false, error: P.autoStartBatchFlagMustBeBoolean }
        }
        patch.autoStartBatchAfterEnqueue = o['autoStartBatchAfterEnqueue']
      }
      if (
        patch.filenameTemplate === undefined &&
        patch.formatPreset === undefined &&
        patch.downloadPlaylist === undefined &&
        patch.audioOnly === undefined &&
        patch.subtitlePreset === undefined &&
        patch.subLangs === undefined &&
        patch.cookiesBrowser === undefined &&
        patch.cookiesBrowserProfile === undefined &&
        patch.impersonate === undefined &&
        patch.rateLimit === undefined &&
        patch.retriesLine === undefined &&
        patch.fragmentRetriesLine === undefined &&
        patch.extraArgsLine === undefined &&
        patch.queueRetryProfile === undefined &&
        patch.openInHandlerOnComplete === undefined &&
        patch.autoExportAfterOpenInHandler === undefined &&
        patch.enqueueBatchOnDownloadComplete === undefined &&
        patch.autoStartBatchAfterEnqueue === undefined
      ) {
        return { ok: false, error: P.nothingToSave }
      }
      return fn(patch, loc)
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

  ipcMain.handle(
    d.mergeUiPanels,
    (event, raw: unknown): { ok: true } | { ok: false; error: string } => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      const patch = sanitizeDownloadsUiPanelPatch(raw)
      if (Object.keys(patch).length === 0) {
        return { ok: true }
      }
      const fn = getDownloadsBoundsHooks().mergeDownloadsWindowUiPanelsPatch
      if (!fn) {
        return { ok: false, error: P.mergeUiPanelsNotConnected }
      }
      fn(patch)
      return { ok: true }
    }
  )

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
    w.webContents.send(mw.openEnginePaths)
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
