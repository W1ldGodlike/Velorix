import { BrowserWindow, ipcMain } from 'electron'

import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import {
  getFfmpegExportBatchSnapshot,
  markWaitingFfmpegExportBatchRowsCancelled
} from '../ffmpeg-export-batch-queue'
import {
  cancelFfmpegExportBatchRunner,
  isFfmpegExportBatchActive,
  setFfmpegExportBatchRunnerNotifier
} from '../ffmpeg-export-batch-runner'
import { createExportBatchIpcContext } from './export-batch-ipc-context'
import type { ExportBatchIpcHost } from './export-batch-ipc-host'
import { registerBatchExportQueueIpcHandlers } from './register-batch-export-queue-ipc'
import { registerSingleExportIpcHandlers } from './register-single-export-ipc'
import { registerMediaUtilitiesIpcHandlers } from './register-media-utilities-ipc'

let ipcRegistered = false

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

  const ctx = createExportBatchIpcContext(host, pushBatchExportSnapshot)
  registerSingleExportIpcHandlers(ctx)
  registerMediaUtilitiesIpcHandlers(ctx.host)
  registerBatchExportQueueIpcHandlers(ctx)

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
}
