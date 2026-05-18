import { join } from 'path'

import { BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'

import { appendUrlsFromMultilineBlock } from './downloads-queue'
import { setDownloadsLogSink } from './downloads-log-ipc'
import type { AppUiLocale } from '../shared/app-ui-locale'
import { getDownloadsPopoutWindowTitle } from '../shared/app-ui-locale'
import { syncBrowserWindowTitlesToLocale } from './window-title-locale'
import { resolvePreloadOutFile } from './preload-resolve'
import { installExternalNavigationGuard, openAllowedExternalUrl } from './external-url'
import {
  defaultDownloadsWindowLogicalSize,
  displayMatchingRestoreRect,
  downloadsWindowMinLogicalSize,
  logicalScaleFactor
} from './window-hidpi'
import { boundsFromBrowserWindow, rectifyBoundsForRestore } from './window-bounds'
import {
  broadcastDownloadsSnapshot,
  broadcastDownloadsLogPayload,
  getDownloadsBoundsHooks,
  getDownloadsPopoutWindow,
  setDownloadsPopoutWindow,
  setLastDownloadsPopoutResolvedUiLocale
} from './downloads-window-runtime'
export {
  configureDownloadsWindowBoundsHooks,
  isDownloadsWindow,
  broadcastDownloadsSnapshot,
  broadcastDownloadsWindowUiPanelsSnapshot,
  broadcastDownloadsCliOptionsChanged,
  broadcastDownloadsOutputDirectorySnapshot,
  DOWNLOADS_QUEUE_SNAPSHOT_CHANNEL
} from './downloads-window-runtime'
export { registerDownloadsWindowIpcHandlers } from './register-downloads-window-ipc'

/**
 * Синхронизировать язык pop-out загрузок: React-слой слушает `uiLocaleChanged`;
 * здесь обновляем кэш IPC и заголовок окна.
 */
export function syncDownloadsPopoutHtmlToLocale(resolvedLocale: AppUiLocale): void {
  setLastDownloadsPopoutResolvedUiLocale(resolvedLocale)
  syncBrowserWindowTitlesToLocale(resolvedLocale)
}

/**
 * Открыть или сфокусировать окно менеджера загрузок (`index.html#downloads`).
 * Непустой `mergeText` добавляет распознанные URL-строки в очередь.
 */
export function focusOrCreateDownloadsWindow(
  mergeText?: string | null,
  uiLocale?: AppUiLocale
): void {
  const chunk = mergeText?.trim() ?? ''
  if (chunk.length > 0) {
    appendUrlsFromMultilineBlock(chunk)
  }

  const resolvedLocale = uiLocale ?? getDownloadsBoundsHooks().getDownloadsUiLocale?.() ?? 'ru'

  const popoutFocus = getDownloadsPopoutWindow()
  if (popoutFocus && !popoutFocus.isDestroyed()) {
    popoutFocus.focus()
    syncDownloadsPopoutHtmlToLocale(resolvedLocale)
    broadcastDownloadsSnapshot()
    return
  }

  setLastDownloadsPopoutResolvedUiLocale(resolvedLocale)
  const winTitle = getDownloadsPopoutWindowTitle(resolvedLocale)

  const savedDl = getDownloadsBoundsHooks().getSavedDownloadsBounds?.()
  const dlRect = savedDl ? rectifyBoundsForRestore(savedDl) : null

  const targetDisp = displayMatchingRestoreRect(dlRect)
  const dispScale = logicalScaleFactor(targetDisp)
  const { minWidth: minDownloadsW, minHeight: minDownloadsH } =
    downloadsWindowMinLogicalSize(dispScale)
  const areaW = targetDisp.workAreaSize.width
  const areaH = targetDisp.workAreaSize.height
  const dlDefault = defaultDownloadsWindowLogicalSize(areaW, areaH)

  const popoutWin = new BrowserWindow({
    width: dlRect?.width ?? dlDefault.width,
    height: dlRect?.height ?? dlDefault.height,
    minWidth: minDownloadsW,
    minHeight: minDownloadsH,
    ...(dlRect ? { x: dlRect.x, y: dlRect.y } : {}),
    show: false,
    title: winTitle,
    webPreferences: {
      contextIsolation: true,
      sandbox: false,
      nodeIntegration: false,
      preload: resolvePreloadOutFile('index', __dirname)
    }
  })

  let downloadsBoundsTimer: ReturnType<typeof setTimeout> | null = null
  const flushDownloadsBounds = (): void => {
    const popout = getDownloadsPopoutWindow()
    if (!popout || popout.isDestroyed()) {
      return
    }
    getDownloadsBoundsHooks().persistDownloadsBounds?.(boundsFromBrowserWindow(popout))
  }
  const scheduleDownloadsBounds = (): void => {
    if (downloadsBoundsTimer !== null) {
      clearTimeout(downloadsBoundsTimer)
    }
    downloadsBoundsTimer = setTimeout(() => {
      downloadsBoundsTimer = null
      flushDownloadsBounds()
    }, 480)
  }

  popoutWin.on('resize', scheduleDownloadsBounds)
  popoutWin.on('move', scheduleDownloadsBounds)
  popoutWin.on('close', () => {
    if (downloadsBoundsTimer !== null) {
      clearTimeout(downloadsBoundsTimer)
      downloadsBoundsTimer = null
    }
    flushDownloadsBounds()
  })

  popoutWin.on('closed', () => {
    setDownloadsPopoutWindow(null)
  })

  popoutWin.webContents.setWindowOpenHandler((details) => {
    openAllowedExternalUrl(details.url)
    return { action: 'deny' }
  })
  installExternalNavigationGuard(popoutWin.webContents)

  setDownloadsPopoutWindow(popoutWin)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    const base = process.env['ELECTRON_RENDERER_URL'].replace(/\/$/, '')
    void popoutWin.loadURL(`${base}#downloads`)
  } else {
    void popoutWin.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'downloads' })
  }

  popoutWin.once('ready-to-show', () => {
    if (popoutWin && !popoutWin.isDestroyed()) {
      setDownloadsLogSink(broadcastDownloadsLogPayload)
    }
    popoutWin?.show()
    broadcastDownloadsSnapshot()
  })
}
