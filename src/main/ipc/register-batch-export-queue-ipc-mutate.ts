import { ipcMain } from 'electron'

import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import type {
  FfmpegExportBatchClearCompletedResult,
  FfmpegExportBatchRetryFailedResult,
  FfmpegExportBatchSnapshot
} from '../../shared/ffmpeg-export-batch-contract'
import {
  clearFfmpegExportBatchQueue,
  getFfmpegExportBatchSnapshot,
  listFfmpegExportBatchInputPaths,
  listFfmpegExportBatchOutputPaths,
  moveFfmpegExportBatchRow,
  removeCompletedFfmpegExportBatchRows,
  removeFfmpegExportBatchRows,
  removeWaitingFfmpegExportBatchRows,
  reorderFfmpegExportBatchRowAt,
  retryFailedFfmpegExportBatchRows,
  retryFfmpegExportBatchRows,
  setFfmpegExportBatchConcurrency
} from '../services/ffmpeg/ffmpeg-export-batch-queue'
import { isFfmpegExportBatchActive } from '../services/ffmpeg/ffmpeg-export-batch-runner'
import type { ExportBatchIpcContext } from './export-batch-ipc-context'

export function registerBatchExportQueueIpcMutateHandlers(ctx: ExportBatchIpcContext): void {
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
}
