import { join } from 'path'

import { BrowserWindow, dialog } from 'electron'
import { is } from '@electron-toolkit/utils'

import icon from '../../../resources/icon.png?asset'
import { installExternalNavigationGuard, openAllowedExternalUrl } from '../core/external-url'
import { resolvePreloadOutFile } from '../core/preload-resolve'
import type { WindowBoundsConfig } from '../services/settings/settings-store'
import {
  defaultMainEditorSize,
  displayMatchingRestoreRect,
  logicalScaleFactor,
  mainEditorMinLogicalSize
} from './window-hidpi'
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

export function createMainWindow(deps: MainWindowCreateDeps): BrowserWindow {
  const savedMain = deps.getSavedMainBounds()
  const rect = savedMain ? rectifyBoundsForRestore(savedMain) : null
  const mainDisp = displayMatchingRestoreRect(rect)
  const mainScale = logicalScaleFactor(mainDisp)
  const mainMin = mainEditorMinLogicalSize(mainScale)
  const mainDefault = defaultMainEditorSize(
    mainDisp.size.width,
    mainDisp.size.height,
    mainMin.minWidth,
    mainMin.minHeight
  )

  const mainWindow = new BrowserWindow({
    width: rect?.width ?? mainDefault.width,
    height: rect?.height ?? mainDefault.height,
    minWidth: mainMin.minWidth,
    minHeight: mainMin.minHeight,
    ...(rect ? { x: rect.x, y: rect.y } : {}),
    show: false,
    autoHideMenuBar: false,
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

  const finishConfirmedQuit = (): void => {
    deps.onPrepareMainWindowQuit()
    deps.setAllowMainWindowClose(true)
    mainWindow.close()
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

    if (needsBusyDialog) {
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
      return
    }

    const waitingCount = deps.countDownloadsQueueWaiting()
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
