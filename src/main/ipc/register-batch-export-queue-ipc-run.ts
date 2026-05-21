import { BrowserWindow, ipcMain } from 'electron'

import { sendExportProgress } from '../core/export-progress-broadcast'
import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import type { FfmpegExportBatchStartResult } from '../../shared/ffmpeg-export-batch-contract'
import {
  getFfmpegExportBatchSnapshot,
  markWaitingFfmpegExportBatchRowsCancelled,
  retryFailedFfmpegExportBatchRows
} from '../services/ffmpeg/ffmpeg-export-batch-queue'
import {
  cancelFfmpegExportBatchRunner,
  isFfmpegExportBatchActive,
  runFfmpegExportBatchQueue
} from '../services/ffmpeg/ffmpeg-export-batch-runner'
import { openFfmpegExportBatchInputPath } from '../services/ffmpeg/ffmpeg-export-batch-open-input'
import { resolveAppPaths } from '../core/app-paths'
import { resolveEngineExecutablePath } from '../services/engines/engine-service'
import type { ExportBatchIpcContext } from './export-batch-ipc-context'

export function registerBatchExportQueueIpcRunHandlers(ctx: ExportBatchIpcContext): void {
  const { host, pushBatchExportSnapshot } = ctx

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
            sendExportProgress(win.webContents, { ...p, batchRowId: rowId })
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
