import { BrowserWindow } from 'electron'

import { cancelDownloadsRunner, isDownloadsRunnerBusy } from './downloads-queue-runner'
import { getMainWindowTitle } from '../shared/app-ui-locale'
import { clearRendererLogBucket, mainAppStr, mainDownloadsUiLocale } from './main-bootstrap-ipc-helpers'
import { attachMainWindowBoundsPersistence, getCachedSettings } from './main-cached-settings-host'
import { buildApplicationMenu } from './main-application-menu'
import { createMainWindow } from './main-window'

export let mainWindowRef: BrowserWindow | null = null

export let mainWindowWebContentsId: number | null = null

/** Обход диалога §4.2 после явного подтверждения «Закрыть и прервать». */
export let allowMainWindowClose = false

export let activeExportAbort: AbortController | null = null

/** §7.4 — push `batchExportSnapshot` после enqueue из downloads-runner (до createWindow IPC). */
export let broadcastFfmpegExportBatchSnapshot: ((win?: BrowserWindow | null) => void) | null = null

export function setActiveExportAbort(ac: AbortController | null): void {
  activeExportAbort = ac
}

export function bindFfmpegExportBatchSnapshotBroadcast(
  fn: ((win?: BrowserWindow | null) => void) | null
): void {
  broadcastFfmpegExportBatchSnapshot = fn
}

export function createMainApplicationWindow(): void {
  createMainWindow({
    mainDirname: __dirname,
    getSavedMainBounds: () => getCachedSettings().windowBounds?.main,
    attachBoundsPersistence: attachMainWindowBoundsPersistence,
    onMainWindowCreated: (win, webContentsId) => {
      mainWindowRef = win
      allowMainWindowClose = false
      mainWindowWebContentsId = webContentsId
      win.setTitle(getMainWindowTitle(mainDownloadsUiLocale()))
    },
    onMainWindowClosed: (win, webContentsId) => {
      if (mainWindowRef?.id === win.id) {
        mainWindowRef = null
      }
      if (mainWindowWebContentsId === webContentsId) {
        mainWindowWebContentsId = null
      }
      clearRendererLogBucket(webContentsId)
    },
    getAllowMainWindowClose: () => allowMainWindowClose,
    setAllowMainWindowClose: (value) => {
      allowMainWindowClose = value
    },
    isExportBusy: () => activeExportAbort !== null,
    isDownloadsBusy: () => isDownloadsRunnerBusy(),
    onQuitAbortConfirmed: () => {
      activeExportAbort?.abort()
      cancelDownloadsRunner()
    },
    mainAppStr,
    buildApplicationMenu
  })
}
