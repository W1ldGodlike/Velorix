import { BrowserWindow } from 'electron'

import { mainWindowIpc as mw } from '../shared/ipc-channels'
import type { AppUiLocale } from '../shared/app-ui-locale'
import {
  fluxLogBatchAutoStartFfmpegMissing,
  fluxLogBatchAutoStartLaunched,
  fluxLogBatchAutoStartSkippedBusy,
  formatFluxLogBatchEnqueueAdded,
  fluxLogBatchEnqueueSkippedNotVideo
} from '../shared/downloads-flux-log-locale'
import { isFfmpegExportBatchVideoPath } from '../shared/ffmpeg-export-batch-video-ext'
import { resolveAppPaths } from './app-paths'
import type { AppSettings } from './settings-store'
import type { EnginePathOverrides } from './engine-service'
import { resolveEngineExecutablePath } from './engine-service'
import { filterExistingVideoPathsForBatch } from './ffmpeg-export-batch-grant-paths'
import {
  addFfmpegExportBatchPaths,
  getFfmpegExportBatchSnapshot
} from './ffmpeg-export-batch-queue'
import { isFfmpegExportBatchActive, runFfmpegExportBatchQueue } from './ffmpeg-export-batch-runner'
import { grantMediaPath } from './media-protocol'
import { emitDownloadsLog } from './downloads-log-ipc'
import { getYtdlpRunOptionsSnapshot } from './ytdlp-run-options-sync'

export type MainFfmpegExportBatchHostAccess = {
  isExportBusy: () => boolean
  getSettings: () => AppSettings
  getEnginePathOverrides: () => EnginePathOverrides
  mainDownloadsUiLocale: () => AppUiLocale
  rememberExportOutputPath: (filePath: string) => void
  rememberFfmpegExportDirectory: (outputPath: string) => void
  broadcastBatchSnapshot: (win?: BrowserWindow | null) => void
  revealMainWindowBatchExportPanel: () => void
}

let access: MainFfmpegExportBatchHostAccess | null = null

export function configureMainFfmpegExportBatchHost(next: MainFfmpegExportBatchHostAccess): void {
  access = next
}

function requireAccess(): MainFfmpegExportBatchHostAccess {
  if (!access) {
    throw new Error('main-ffmpeg-export-batch-host: configureMainFfmpegExportBatchHost not called')
  }
  return access
}

export function launchFfmpegExportBatchRunner(
  rawExportOverrides?: unknown,
  progressTargetWin?: BrowserWindow | null
): boolean {
  const host = requireAccess()
  if (host.isExportBusy() || isFfmpegExportBatchActive()) {
    return false
  }
  const snap = getFfmpegExportBatchSnapshot()
  if (!snap.rows.some((r) => r.status === 'waiting')) {
    return false
  }
  const paths = resolveAppPaths()
  const ffmpeg = resolveEngineExecutablePath(paths, 'ffmpeg', host.getEnginePathOverrides())
  if (!ffmpeg) {
    return false
  }
  const loc = host.mainDownloadsUiLocale()
  const settings = host.getSettings()
  void runFfmpegExportBatchQueue({
    ffmpegPath: ffmpeg,
    settings,
    lutResourcesRoot: paths.resources,
    rawExportOverrides,
    userDataRoot: paths.userData,
    rememberExportOutputPath: host.rememberExportOutputPath,
    rememberFfmpegExportDirectory: host.rememberFfmpegExportDirectory,
    uiLocale: loc,
    pushRowProgress: (rowId, p) => {
      if (progressTargetWin && !progressTargetWin.isDestroyed()) {
        progressTargetWin.webContents.send(mw.exportProgress, { ...p, batchRowId: rowId })
        return
      }
      for (const w of BrowserWindow.getAllWindows()) {
        if (!w.isDestroyed()) {
          w.webContents.send(mw.exportProgress, { ...p, batchRowId: rowId })
        }
      }
    }
  }).finally(() => {
    host.broadcastBatchSnapshot(progressTargetWin ?? undefined)
  })
  host.broadcastBatchSnapshot(progressTargetWin ?? undefined)
  return true
}

export function scheduleEnqueueBatchAfterDownload(absoluteFile: string, rowId: number): void {
  void (async () => {
    const host = requireAccess()
    const loc = host.mainDownloadsUiLocale()
    grantMediaPath(absoluteFile)
    if (!isFfmpegExportBatchVideoPath(absoluteFile)) {
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: fluxLogBatchEnqueueSkippedNotVideo(loc)
      })
      return
    }
    const granted = filterExistingVideoPathsForBatch([absoluteFile])
    if (granted.length === 0) {
      return
    }
    const { added } = addFfmpegExportBatchPaths(granted)
    if (added > 0) {
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: formatFluxLogBatchEnqueueAdded(loc, absoluteFile)
      })
      host.revealMainWindowBatchExportPanel()
    }
    host.broadcastBatchSnapshot()
    const cli = getYtdlpRunOptionsSnapshot()
    if (!cli.autoStartBatchAfterEnqueue) {
      return
    }
    if (host.isExportBusy() || isFfmpegExportBatchActive()) {
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: fluxLogBatchAutoStartSkippedBusy(loc)
      })
      return
    }
    const paths = resolveAppPaths()
    const ffmpeg = resolveEngineExecutablePath(paths, 'ffmpeg', host.getEnginePathOverrides())
    if (!ffmpeg) {
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: fluxLogBatchAutoStartFfmpegMissing(loc)
      })
      return
    }
    if (launchFfmpegExportBatchRunner(undefined)) {
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: fluxLogBatchAutoStartLaunched(loc)
      })
    }
  })()
}
