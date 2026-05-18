import { join } from 'path'

import { BrowserWindow, dialog } from 'electron'
import { is } from '@electron-toolkit/utils'

import icon from '../../resources/icon.png?asset'
import { installExternalNavigationGuard, openAllowedExternalUrl } from './external-url'
import { resolvePreloadOutFile } from './preload-resolve'
import type { WindowBoundsConfig } from './settings-store'
import {
  defaultMainEditorSize,
  displayMatchingRestoreRect,
  logicalScaleFactor,
  mainEditorMinLogicalSize
} from './window-hidpi'
import { isNativeMainBrowserWindowNeedsIcon } from './platform'
import { rectifyBoundsForRestore } from './window-bounds'

export type MainWindowCreateDeps = {
  mainDirname: string
  getSavedMainBounds: () => WindowBoundsConfig['main'] | undefined
  attachBoundsPersistence: (win: BrowserWindow) => void
  onMainWindowCreated: (win: BrowserWindow, webContentsId: number) => void
  onMainWindowClosed: (win: BrowserWindow, webContentsId: number) => void
  getAllowMainWindowClose: () => boolean
  setAllowMainWindowClose: (value: boolean) => void
  isExportBusy: () => boolean
  isDownloadsBusy: () => boolean
  onQuitAbortConfirmed: () => void
  mainAppStr: () => {
    quitConfirmBoth: string
    quitConfirmExport: string
    quitConfirmDownloads: string
    quitStay: string
    quitAbort: string
    quitDialogTitle: string
  }
  buildApplicationMenu: () => void
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

  mainWindow.on('close', (e) => {
    if (deps.getAllowMainWindowClose()) {
      return
    }
    const exportBusy = deps.isExportBusy()
    const downloadsBusy = deps.isDownloadsBusy()
    if (!exportBusy && !downloadsBusy) {
      return
    }
    e.preventDefault()
    const q = deps.mainAppStr()
    const msg =
      exportBusy && downloadsBusy
        ? q.quitConfirmBoth
        : exportBusy
          ? q.quitConfirmExport
          : q.quitConfirmDownloads

    void dialog
      .showMessageBox(mainWindow, {
        type: 'warning',
        buttons: [q.quitStay, q.quitAbort],
        defaultId: 0,
        cancelId: 0,
        title: q.quitDialogTitle,
        message: msg,
        noLink: true
      })
      .then(({ response }) => {
        if (response !== 1) {
          return
        }
        deps.onQuitAbortConfirmed()
        deps.setAllowMainWindowClose(true)
        mainWindow.close()
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
