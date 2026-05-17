import { BrowserWindow } from 'electron'

import { appendUrlsFromMultilineBlock } from './downloads-queue'
import { setDownloadsLogSink } from './downloads-log-ipc'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { getDownloadsWindowUiStrings } from '../shared/downloads-window-ui-locale'
import { buildDownloadsHtml } from './downloads-window-html'
import { resolvePreloadOutFile } from './preload-resolve'
import { installExternalNavigationGuard, openAllowedExternalUrl } from './external-url'
import {
  defaultDownloadsWindowLogicalSize,
  displayMatchingRestoreRect,
  downloadsWindowMinLogicalSize,
  logicalScaleFactor
} from './window-hidpi'
import { boundsFromBrowserWindow, rectifyBoundsForRestore } from './window-bounds'
import { logError } from './logger-service'
import {
  broadcastDownloadsSnapshot,
  broadcastDownloadsLogPayload,
  getDownloadsBoundsHooks,
  getDownloadsPopoutWindow,
  getLastDownloadsWindowResolvedUiLocale,
  setDownloadsPopoutWindow,
  setLastDownloadsWindowResolvedUiLocale
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
export type { DownloadsWindowBoundsHooks } from './downloads-window-runtime'



/**
 * Обновить язык статического HTML pop-out загрузок: при открытом окне — `loadURL` с новой разметкой;
 * при закрытом — только `lastDownloadsWindowResolvedUiLocale` для согласованности с `settings.json`.
 */
export function syncDownloadsPopoutHtmlToLocale(resolvedLocale: DownloadsWindowUiLocale): void {
  const popoutEarly = getDownloadsPopoutWindow()
  if (!popoutEarly || popoutEarly.isDestroyed()) {
    setLastDownloadsWindowResolvedUiLocale(resolvedLocale)
    return
  }
  if (resolvedLocale === getLastDownloadsWindowResolvedUiLocale()) {
    return
  }
  setLastDownloadsWindowResolvedUiLocale(resolvedLocale)
  const winTitle = getDownloadsWindowUiStrings(resolvedLocale).windowTitle
  popoutEarly.setTitle(winTitle)
  const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(
    buildDownloadsHtml(
      getDownloadsBoundsHooks().getDownloadsWindowUiPanelsSnapshot?.(),
      getDownloadsBoundsHooks().getAppTheme?.() ?? 'dark',
      resolvedLocale
    )
  )}`
  void popoutEarly.loadURL(dataUrl).catch((err: unknown) => {
    logError('downloads-window', 'syncDownloadsPopoutHtmlToLocale loadURL failed', err)
  })
}

/**
 * Открыть или сфокусировать окно менеджера загрузок.
 * Непустой `mergeText` добавляет распознанные URL-строки в очередь (как при вставке из буфера).
 * `uiLocale` задаёт язык при первом создании; при повторном фокусе HTML пересобирается, если язык
 * (явный аргумент или `getDownloadsUiLocale`) отличается от последнего загруженного в pop-out.
 */
export function focusOrCreateDownloadsWindow(
  mergeText?: string | null,
  uiLocale?: DownloadsWindowUiLocale
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

  setLastDownloadsWindowResolvedUiLocale(resolvedLocale)
  const winTitle = getDownloadsWindowUiStrings(resolvedLocale).windowTitle

  const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(
    buildDownloadsHtml(
      getDownloadsBoundsHooks().getDownloadsWindowUiPanelsSnapshot?.(),
      getDownloadsBoundsHooks().getAppTheme?.() ?? 'dark',
      resolvedLocale
    )
  )}`

  const savedDl = getDownloadsBoundsHooks().getSavedDownloadsBounds?.()
  const dlRect = savedDl ? rectifyBoundsForRestore(savedDl) : null

  const targetDisp = displayMatchingRestoreRect(dlRect)
  const dispScale = logicalScaleFactor(targetDisp)
  /** На 125%+ логические px уже «мельче» физически — поднимаем минимум, чтобы таблица очереди не ломалась при первом открытии. */
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
      sandbox: true,
      nodeIntegration: false,
      preload: resolvePreloadOutFile('downloadsWindow', __dirname)
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
  void popoutWin.loadURL(dataUrl)
  popoutWin.once('ready-to-show', () => {
    if (popoutWin && !popoutWin.isDestroyed()) {
      setDownloadsLogSink(broadcastDownloadsLogPayload)
    }
    popoutWin?.show()
    broadcastDownloadsSnapshot()
  })
}
