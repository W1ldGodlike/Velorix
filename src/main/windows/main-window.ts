import { join } from 'path'

import { BrowserWindow, dialog, ipcMain } from 'electron'
import { is } from '@electron-toolkit/utils'

import icon from '../../../resources/icon.png?asset'
import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import {
  parseQuitConfirmResponsePayload,
  type QuitConfirmRequestPayload
} from '../../shared/quit-confirm-contract'
import { installExternalNavigationGuard, openAllowedExternalUrl } from '../core/external-url'
import { resolvePreloadOutFile } from '../core/preload-resolve'
import type { WindowBoundsConfig } from '../services/settings/settings-store'
import { displayMatchingRestoreRect, mainEditorWorkAreaBounds } from './window-hidpi'
import { isNativeMainBrowserWindowNeedsIcon } from '../platform'
import { rectifyBoundsForRestore } from './window-bounds'

export type MainWindowQuitStrings = {
  quitConfirmBoth: string
  quitConfirmExport: string
  quitConfirmDownloads: string
  quitConfirmIdle: string
  quitConfirmIdleWithQueue: string
  quitStay: string
  quitAbort: string
  quitYes: string
  quitNo: string
  quitDialogTitle: string
}

export type MainWindowCreateDeps = {
  mainDirname: string
  getSavedMainBounds: () => WindowBoundsConfig['main'] | undefined
  attachBoundsPersistence: (win: BrowserWindow) => void
  onMainWindowCreated: (win: BrowserWindow, webContentsId: number) => void
  onMainWindowClosed: (win: BrowserWindow, webContentsId: number) => void
  getAllowMainWindowClose: () => boolean
  setAllowMainWindowClose: (value: boolean) => void
  getConfirmCloseOnQuit: () => boolean
  isExportBusy: () => boolean
  isDownloadsBusy: () => boolean
  countDownloadsQueueWaiting: () => number
  onPrepareMainWindowQuit: () => void
  onQuitAbortConfirmed: () => void
  mainAppStr: () => MainWindowQuitStrings
  buildApplicationMenu: () => void
}

function formatIdleQuitMessage(q: MainWindowQuitStrings, waitingCount: number): string {
  if (waitingCount <= 0) {
    return q.quitConfirmIdle
  }
  return q.quitConfirmIdleWithQueue.replace('{n}', String(waitingCount))
}

function busyQuitMessage(
  q: MainWindowQuitStrings,
  exportBusy: boolean,
  downloadsBusy: boolean
): string {
  if (exportBusy && downloadsBusy) {
    return q.quitConfirmBoth
  }
  if (exportBusy) {
    return q.quitConfirmExport
  }
  return q.quitConfirmDownloads
}

function buildQuitConfirmRequestPayload(
  requestId: number,
  exportBusy: boolean,
  downloadsBusy: boolean,
  waitingCount: number
): QuitConfirmRequestPayload {
  return {
    requestId,
    mode: exportBusy || downloadsBusy ? 'busy' : 'idle',
    exportBusy,
    downloadsBusy,
    waitingCount
  }
}

export function createMainWindow(deps: MainWindowCreateDeps): BrowserWindow {
  const savedMain = deps.getSavedMainBounds()
  const rect = savedMain ? rectifyBoundsForRestore(savedMain) : null
  const mainDisp = displayMatchingRestoreRect(rect)
  const workArea = mainEditorWorkAreaBounds(mainDisp)

  const mainWindow = new BrowserWindow({
    x: workArea.x,
    y: workArea.y,
    width: workArea.width,
    height: workArea.height,
    minWidth: workArea.width,
    minHeight: workArea.height,
    maxWidth: workArea.width,
    maxHeight: workArea.height,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(isNativeMainBrowserWindowNeedsIcon() ? { icon } : {}),
    webPreferences: {
      preload: resolvePreloadOutFile('index', deps.mainDirname),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  const mainWebContentsId = mainWindow.webContents.id
  deps.onMainWindowCreated(mainWindow, mainWebContentsId)

  mainWindow.on('closed', () => {
    deps.onMainWindowClosed(mainWindow, mainWebContentsId)
  })

  deps.setAllowMainWindowClose(false)
  let quitConfirmRequestSeq = 0
  let quitConfirmPending = false

  const finishConfirmedQuit = (): void => {
    deps.onPrepareMainWindowQuit()
    deps.setAllowMainWindowClose(true)
    mainWindow.close()
  }

  const showNativeBusyQuitDialog = (
    q: MainWindowQuitStrings,
    exportBusy: boolean,
    downloadsBusy: boolean
  ): void => {
    void dialog
      .showMessageBox(mainWindow, {
        type: 'warning',
        buttons: [q.quitStay, q.quitAbort],
        defaultId: 0,
        cancelId: 0,
        title: q.quitDialogTitle,
        message: busyQuitMessage(q, exportBusy, downloadsBusy),
        noLink: true
      })
      .then(({ response }) => {
        if (response !== 1) {
          return
        }
        deps.onQuitAbortConfirmed()
        finishConfirmedQuit()
      })
  }

  const showNativeIdleQuitDialog = (q: MainWindowQuitStrings, waitingCount: number): void => {
    void dialog
      .showMessageBox(mainWindow, {
        type: 'question',
        buttons: [q.quitNo, q.quitYes],
        defaultId: 0,
        cancelId: 0,
        title: q.quitDialogTitle,
        message: formatIdleQuitMessage(q, waitingCount),
        noLink: true
      })
      .then(({ response }) => {
        if (response !== 1) {
          return
        }
        finishConfirmedQuit()
      })
  }

  const requestRendererQuitConfirm = (
    payload: QuitConfirmRequestPayload
  ): Promise<boolean | null> => {
    if (
      mainWindow.isDestroyed() ||
      mainWindow.webContents.isDestroyed() ||
      mainWindow.webContents.isLoadingMainFrame()
    ) {
      return Promise.resolve(null)
    }
    return new Promise((resolve) => {
      const onResponse = (event: Electron.IpcMainEvent, raw: unknown): void => {
        if (event.sender.id !== mainWindow.webContents.id) {
          return
        }
        const parsed = parseQuitConfirmResponsePayload(raw)
        if (!parsed || parsed.requestId !== payload.requestId) {
          return
        }
        ipcMain.removeListener(mw.quitConfirmRespond, onResponse)
        resolve(parsed.confirmed)
      }
      ipcMain.on(mw.quitConfirmRespond, onResponse)
      try {
        mainWindow.webContents.send(mw.quitConfirmRequested, payload)
      } catch {
        ipcMain.removeListener(mw.quitConfirmRespond, onResponse)
        resolve(null)
      }
    })
  }

  mainWindow.on('close', (e) => {
    if (deps.getAllowMainWindowClose()) {
      return
    }
    const exportBusy = deps.isExportBusy()
    const downloadsBusy = deps.isDownloadsBusy()
    const confirmOnQuit = deps.getConfirmCloseOnQuit()
    const needsBusyDialog = exportBusy || downloadsBusy
    const needsIdleConfirm = confirmOnQuit && !needsBusyDialog

    if (!needsBusyDialog && !needsIdleConfirm) {
      deps.onPrepareMainWindowQuit()
      return
    }

    e.preventDefault()
    const q = deps.mainAppStr()
    const waitingCount = deps.countDownloadsQueueWaiting()
    if (quitConfirmPending) {
      return
    }
    quitConfirmPending = true
    const requestId = ++quitConfirmRequestSeq
    const request = buildQuitConfirmRequestPayload(
      requestId,
      exportBusy,
      downloadsBusy,
      waitingCount
    )

    void requestRendererQuitConfirm(request).then((confirmed) => {
      quitConfirmPending = false
      if (confirmed === null) {
        if (needsBusyDialog) {
          showNativeBusyQuitDialog(q, exportBusy, downloadsBusy)
          return
        }
        showNativeIdleQuitDialog(q, waitingCount)
        return
      }
      if (!confirmed) {
        return
      }
      if (needsBusyDialog) {
        deps.onQuitAbortConfirmed()
      }
      finishConfirmedQuit()
    })
  })

  deps.attachBoundsPersistence(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    deps.buildApplicationMenu()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    openAllowedExternalUrl(details.url)
    return { action: 'deny' }
  })
  installExternalNavigationGuard(mainWindow.webContents)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(deps.mainDirname, '../renderer/index.html'))
  }

  return mainWindow
}
