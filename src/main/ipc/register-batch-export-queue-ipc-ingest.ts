import { existsSync, statSync } from 'fs'
import { normalize } from 'path'

import { BrowserWindow, ipcMain, shell } from 'electron'

import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import { collectDownloadsQueueVideoPaths } from '../../shared/ffmpeg-export-batch-collect-paths'
import { addFfmpegExportBatchPaths } from '../ffmpeg-export-batch-queue'
import { isFfmpegExportBatchActive } from '../ffmpeg-export-batch-runner'
import {
  pickFfmpegExportBatchInputFiles,
  pickFfmpegExportBatchInputFolder,
  pickFfmpegExportBatchOutputFolder
} from '../ffmpeg-export-batch-pick'
import { expandFfmpegExportBatchDnDPaths } from '../ffmpeg-export-batch-folder-scan'
import { filterExistingVideoPathsForBatch } from '../ffmpeg-export-batch-grant-paths'
import { getDownloadsQueueSnapshot } from '../downloads-queue'
import { resolveAppPaths } from '../app-paths'
import { findProcessingHistoryEntryById } from '../processing-history'
import { grantMediaPath } from '../media-protocol'
import type { ExportBatchIpcContext } from './export-batch-ipc-context'

export function registerBatchExportQueueIpcIngestHandlers(ctx: ExportBatchIpcContext): void {
  const { host, pushBatchExportSnapshot } = ctx

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
}
