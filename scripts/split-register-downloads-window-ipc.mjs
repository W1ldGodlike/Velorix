import fs from 'node:fs'
import path from 'node:path'

const srcPath = path.join('src/main/register-downloads-window-ipc.ts')
const outDir = path.join('src/main')
const lines = fs.readFileSync(srcPath, 'utf8').split(/\r?\n/)

const slices = [
  {
    file: 'register-downloads-snapshot-ipc.ts',
    fn: 'registerDownloadsSnapshotIpcHandlers',
    start: 99,
    end: 168,
    imports: `import { ipcMain } from 'electron'

import { isYtdlpQueueStatusDone } from '../shared/ytdlp-queue-status'
import { downloadsIpc as d } from '../shared/ipc-channels'
import {
  appendUrlsFromMultilineBlock,
  enqueueFirstWaitingUrlFromBlock,
  getDownloadsQueueRowById
} from './downloads-queue'
import { isDownloadsRunnerBusy, startDownloadSingleRow } from './downloads-queue-runner'
import {
  broadcastDownloadsSnapshot,
  getDownloadsQueueSnapshotForRenderer,
  ipcStr,
  ipcUiLocale,
  isDownloadsOrMainSender,
  openDownloadOutputInHandler,
  resolveAllowedDownloadOutputPath,
  getDownloadsBoundsHooks
} from './downloads-window-runtime'
`
  },
  {
    file: 'register-downloads-options-ipc.ts',
    fn: 'registerDownloadsOptionsIpcHandlers',
    start: 170,
    end: 455,
    imports: `import { BrowserWindow, ipcMain, shell } from 'electron'

import { resolveAppPaths } from './app-paths'
import {
  isYtdlpDownloadDirectoryDefault,
  resolveYtdlpOutputDirectory
} from './ytdlp-download-output'
import {
  parseYtdlpCookiesBrowser,
  parseYtdlpFormatPreset,
  parseYtdlpImpersonate,
  parseYtdlpSubtitlePreset,
  type YtdlpDownloadOptionsPatch
} from './ytdlp-download-options'
import { validateYtdlpCookiesBrowserProfile } from './ytdlp-extra-args'
import { parseYtdlpQueueRetryProfile } from './ytdlp-queue-retry'
import { downloadsIpc as d } from '../shared/ipc-channels'
import {
  getDownloadsBoundsHooks,
  ipcStr,
  ipcUiLocale,
  isDownloadsOrMainSender
} from './downloads-window-runtime'
`
  },
  {
    file: 'register-downloads-queue-ipc.ts',
    fn: 'registerDownloadsQueueIpcHandlers',
    start: 457,
    end: 716,
    imports: `import { mkdirSync } from 'fs'
import { ipcMain, shell } from 'electron'

import { resolveAppPaths } from './app-paths'
import { isYtdlpQueueStatusRunningLike } from '../shared/ytdlp-queue-status'
import { deleteIncompleteDownloadArtifactsForQueueRow } from './ytdlp-download-output'
import { forceKillActiveYtdlpForDownloadsCancel } from './ytdlp-download-service'
import {
  clearFinishedDownloadsQueueRows,
  clearDownloadsQueue,
  getDownloadsQueueRowById,
  getDownloadsQueueSnapshot,
  moveDownloadsQueueRow,
  removeDownloadsQueueRow,
  resetDownloadsQueueRowForRetry
} from './downloads-queue'
import {
  cancelDownloadsRunner,
  getActiveDownloadsRunnerRowId,
  startDownloadSingleRow,
  startDownloadsSequential,
  waitUntilRowNotActiveRunner
} from './downloads-queue-runner'
import { readYtdlpDownloadHistoryNewestFirst } from './ytdlp-download-history'
import { logError, logWarn } from './logger-service'
import { downloadsIpc as d } from '../shared/ipc-channels'
import {
  broadcastDownloadsSnapshot,
  ipcStr,
  ipcUiLocale,
  isDownloadsOrMainSender,
  isDownloadOutputOpenMode,
  openDownloadOutputInHandler,
  openDownloadOutputPath
} from './downloads-window-runtime'
import { resolveYtdlpOutputDirectory } from './ytdlp-download-output'
`
  },
  {
    file: 'register-downloads-history-ipc.ts',
    fn: 'registerDownloadsHistoryIpcHandlers',
    start: 481,
    end: 505,
    imports: `import { ipcMain } from 'electron'

import { resolveAppPaths } from './app-paths'
import {
  clearYtdlpDownloadHistory,
  getYtdlpDownloadHistoryWeeklySummary,
  readYtdlpDownloadHistoryNewestFirst
} from './ytdlp-download-history'
import { downloadsIpc as d } from '../shared/ipc-channels'
import { ipcStr, isDownloadsOrMainSender } from './downloads-window-runtime'
`
  },
  {
    file: 'register-downloads-runner-ipc.ts',
    fn: 'registerDownloadsRunnerIpcHandlers',
    start: 718,
    end: 840,
    imports: `import { ipcMain } from 'electron'

import { pauseActiveYtdlpProcess, resumeActiveYtdlpProcess, getActiveYtdlpPauseState } from './ytdlp-download-service'
import { downloadsIpc as d } from '../shared/ipc-channels'
import { emitDownloadsLog } from './downloads-log-ipc'
import {
  cancelDownloadsRunner,
  getActiveDownloadsRunnerRowId,
  startDownloadSingleRow,
  startDownloadsSequential
} from './downloads-queue-runner'
import { getDownloadsQueueSnapshot, resetDownloadsQueueRowForRetry } from './downloads-queue'
import { isYtdlpQueueStatusRunningLike } from '../shared/ytdlp-queue-status'
import { logError } from './logger-service'
import {
  broadcastDownloadsSnapshot,
  ipcStr,
  ipcUiLocale,
  isDownloadsOrMainSender,
  sanitizeDownloadsUiPanelPatch,
  getDownloadsBoundsHooks
} from './downloads-window-runtime'
`
  },
  {
    file: 'register-downloads-bridge-ipc.ts',
    fn: 'registerDownloadsBridgeIpcHandlers',
    start: 842,
    end: 917,
    imports: `import { ipcMain } from 'electron'

import { downloadsIpc as d, mainWindowIpc as mw } from '../shared/ipc-channels'
import { focusOrCreateInspectorWindow } from './inspector-window'
import {
  ipcStr,
  isDownloadsOrMainSender,
  resolveMainEditorWindow
} from './downloads-window-runtime'
`
  }
]

// history slice overlaps queue — merge history into queue file instead
const queueSlice = slices.find((s) => s.file === 'register-downloads-queue-ipc.ts')
const historySlice = slices.find((s) => s.file === 'register-downloads-history-ipc.ts')
queueSlice.start = 457
queueSlice.end = 716
queueSlice.imports += `import { dialog, BrowserWindow } from 'electron'
import { writeFileSync } from 'fs'
import { DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED } from '../shared/downloads-log-contract'
import {
  clearYtdlpDownloadHistory,
  getYtdlpDownloadHistoryWeeklySummary,
  readYtdlpDownloadHistoryNewestFirst
} from './ytdlp-download-history'
`
slices.splice(slices.indexOf(historySlice), 1)

// queue 457-479, 507-716 — gap 481-505 history inside 457-716?
// Original: 457-479 clear, 481-505 history, 507-546 log, 548-716 rest
// queue slice 457-716 already includes history — good, remove duplicate history file

for (const { file, fn, start, end, imports } of slices) {
  const body = lines.slice(start - 1, end).join('\n')
  const content = `${imports}
export function ${fn}(): void {
${body}
}
`
  fs.writeFileSync(path.join(outDir, file), content)
}

const orchestrator = `import { app } from 'electron'

import { resolveAppPaths } from './app-paths'
import {
  attachDownloadsQueuePersistOnQuitOnce,
  hydrateDownloadsQueueFromDisk
} from './ytdlp-download-queue-persist'
import { setDownloadsRunnerNotifier } from './downloads-queue-runner'
import { setDownloadsLogSink } from './downloads-log-ipc'
import {
  broadcastDownloadsSnapshot,
  broadcastDownloadsLogPayload
} from './downloads-window-runtime'
import { registerDownloadsSnapshotIpcHandlers } from './register-downloads-snapshot-ipc'
import { registerDownloadsOptionsIpcHandlers } from './register-downloads-options-ipc'
import { registerDownloadsQueueIpcHandlers } from './register-downloads-queue-ipc'
import { registerDownloadsRunnerIpcHandlers } from './register-downloads-runner-ipc'
import { registerDownloadsBridgeIpcHandlers } from './register-downloads-bridge-ipc'

let ipcRegistered = false

export function registerDownloadsWindowIpcHandlers(): void {
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

  registerDownloadsSnapshotIpcHandlers()
  registerDownloadsOptionsIpcHandlers()
  registerDownloadsQueueIpcHandlers()
  registerDownloadsRunnerIpcHandlers()
  registerDownloadsBridgeIpcHandlers()
}
`

fs.writeFileSync(srcPath, orchestrator)
console.log('split register-downloads-window-ipc OK')
