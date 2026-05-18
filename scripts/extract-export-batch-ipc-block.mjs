/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * One-shot helper: builds src/main/ipc/register-export-batch-ipc.ts body from index.ts IPC block.
 * Run: node scripts/extract-export-batch-ipc-block.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const indexPath = 'src/main/index.ts'
const outPath = 'src/main/ipc/register-export-batch-ipc.ts'
const lines = readFileSync(indexPath, 'utf8').split(/\r?\n/)
const start = lines.findIndex((l) => l.includes('ipcMain.handle(mw.openDownloadsWindow'))
const end = lines.findIndex((l) => l.includes('ipcMain.on(mw.logRenderer'))
if (start < 0 || end < 0) {
  console.error('markers not found', { start, end })
  process.exit(1)
}
let block = lines.slice(start, end).join('\n')
block = block.replace(/^\s{2}/gm, '')

const subs = [
  [/broadcastFfmpegExportBatchSnapshot = pushBatchExportSnapshot\n\n/g, ''],
  [/cachedSettings/g, 'host.getSettings()'],
  [/activeExportAbort = null/g, 'host.setActiveExportAbort(null)'],
  [/activeExportAbort = ac/g, 'host.setActiveExportAbort(ac)'],
  [/activeExportAbort\?\.abort\(\)/g, 'host.getActiveExportAbort()?.abort()'],
  [/activeExportAbort !== null/g, 'host.getActiveExportAbort() !== null'],
  [/activeExportAbort === null/g, 'host.getActiveExportAbort() === null'],
  [/mainAppStr\(\)/g, 'host.mainAppStr()'],
  [/mainDownloadsUiLocale\(\)/g, 'host.mainDownloadsUiLocale()'],
  [/previewOpenDialogOptsFromSettings\(\)/g, 'host.previewOpenDialogOptsFromSettings()'],
  [/batchExportOutputFolderPickOptsFromSettings\(\)/g, 'host.batchExportOutputFolderPickOptsFromSettings()'],
  [/rememberedExportDefaultPath\(/g, 'host.rememberedExportDefaultPath('],
  [/rememberExportOutputPath\(/g, 'host.rememberExportOutputPath('],
  [/rememberFfmpegExportDirectory\(/g, 'host.rememberFfmpegExportDirectory('],
  [/rememberedSnapshotDefaultPath\(/g, 'host.rememberedSnapshotDefaultPath('],
  [/rememberFfmpegSnapshotDirectory\(/g, 'host.rememberFfmpegSnapshotDirectory('],
  [/openExportOutputPath\(/g, 'host.openExportOutputPath('],
  [/openDownloadedFileInMainHandler/g, 'host.openDownloadedFileInMainHandler'],
  [/parseDownloadsOpenRequest\(/g, 'host.parseDownloadsOpenRequest('],
  [/focusOrCreateDownloadsWindow\(/g, 'host.focusOrCreateDownloadsWindow('],
  [/launchFfmpegExportBatchRunner\(/g, 'host.launchFfmpegExportBatchRunner(']
]

for (const [re, rep] of subs) {
  block = block.replace(re, rep)
}

const header = `import { existsSync, statSync } from 'fs'
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
  parseAppUiLocale,
  type AppUiLocale
} from '../../shared/app-ui-locale'
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
import {
  ensureFfmpegExportExtension,
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
  mainDownloadsUiLocale: () => AppUiLocale
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
    uiLocale?: AppUiLocale
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

`

const footer = '\n}\n'
writeFileSync(outPath, header + block + footer)
console.log(`[extract-export-batch-ipc] wrote ${outPath} (${end - start} lines)`)
