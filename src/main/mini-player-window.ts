import { join } from 'node:path'

import { BrowserWindow, ipcMain } from 'electron'
import { is } from '@electron-toolkit/utils'

import { getMiniPlayerWindowTitle } from '../shared/app-ui-locale'
import { mainWindowIpc as mw } from '../shared/ipc-channels'
import { MINI_PLAYER_SNAPSHOT_PUSH_CHANNEL } from '../shared/mini-player-snapshot-contract'
import { getCachedMiniPlayerSession, patchMiniPlayerSession } from './app-session-store'
import { installExternalNavigationGuard, openAllowedExternalUrl } from './external-url'
import { buildMiniPlayerSnapshotFromMain } from './mini-player-snapshot-host'
import { mainDownloadsUiLocale } from './main-bootstrap-ipc-helpers'
import { resolvePreloadOutFile } from './preload-resolve'
import { boundsFromBrowserWindow, rectifyBoundsForRestore } from './window-bounds'
import {
  getMiniPlayerSnapshotTimer,
  getMiniPlayerWindow,
  isMiniPlayerWindow,
  setLastMiniPlayerResolvedUiLocale,
  setMiniPlayerSnapshotTimer,
  setMiniPlayerWindow
} from './mini-player-window-runtime'
import { focusMainBrowserWindow } from './main-window-focus'
import { syncBrowserWindowTitlesToLocale } from './window-title-locale'

const MINI_PLAYER_WIDTH = 360
const MINI_PLAYER_HEIGHT = 88

let ipcRegistered = false

function stopMiniPlayerSnapshotPush(): void {
  const timer = getMiniPlayerSnapshotTimer()
  if (timer !== null) {
    clearInterval(timer)
    setMiniPlayerSnapshotTimer(null)
  }
}

function pushMiniPlayerSnapshot(): void {
  const win = getMiniPlayerWindow()
  if (!win || win.isDestroyed()) {
    return
  }
  win.webContents.send(MINI_PLAYER_SNAPSHOT_PUSH_CHANNEL, buildMiniPlayerSnapshotFromMain())
}

function startMiniPlayerSnapshotPush(): void {
  stopMiniPlayerSnapshotPush()
  pushMiniPlayerSnapshot()
  setMiniPlayerSnapshotTimer(setInterval(() => pushMiniPlayerSnapshot(), 500))
}

export function focusOrCreateMiniPlayerWindow(
  uiLocale?: Parameters<typeof getMiniPlayerWindowTitle>[0]
): void {
  const resolvedLocale = uiLocale ?? mainDownloadsUiLocale()
  setLastMiniPlayerResolvedUiLocale(resolvedLocale)

  const existing = getMiniPlayerWindow()
  if (existing && !existing.isDestroyed()) {
    existing.focus()
    syncBrowserWindowTitlesToLocale(resolvedLocale)
    startMiniPlayerSnapshotPush()
    return
  }

  const session = getCachedMiniPlayerSession()
  const rect = session.bounds ? rectifyBoundsForRestore(session.bounds) : null

  const win = new BrowserWindow({
    width: rect?.width ?? MINI_PLAYER_WIDTH,
    height: rect?.height ?? MINI_PLAYER_HEIGHT,
    minWidth: 280,
    minHeight: 72,
    ...(rect ? { x: rect.x, y: rect.y } : {}),
    show: false,
    alwaysOnTop: session.alwaysOnTop,
    frame: true,
    resizable: true,
    skipTaskbar: false,
    title: getMiniPlayerWindowTitle(resolvedLocale),
    webPreferences: {
      preload: resolvePreloadOutFile('index', __dirname),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  setMiniPlayerWindow(win)

  let boundsTimer: ReturnType<typeof setTimeout> | null = null
  const flushBounds = (): void => {
    if (win.isDestroyed()) {
      return
    }
    patchMiniPlayerSession({
      bounds: boundsFromBrowserWindow(win),
      alwaysOnTop: win.isAlwaysOnTop()
    })
  }
  const scheduleBounds = (): void => {
    if (boundsTimer !== null) {
      clearTimeout(boundsTimer)
    }
    boundsTimer = setTimeout(() => {
      boundsTimer = null
      flushBounds()
    }, 480)
  }

  win.on('resize', scheduleBounds)
  win.on('move', scheduleBounds)
  win.on('close', () => {
    if (boundsTimer !== null) {
      clearTimeout(boundsTimer)
      boundsTimer = null
    }
    flushBounds()
    stopMiniPlayerSnapshotPush()
  })
  win.on('closed', () => {
    setMiniPlayerWindow(null)
  })

  win.webContents.setWindowOpenHandler((details) => {
    openAllowedExternalUrl(details.url)
    return { action: 'deny' }
  })
  installExternalNavigationGuard(win.webContents)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    const base = process.env['ELECTRON_RENDERER_URL'].replace(/\/$/, '')
    void win.loadURL(`${base}#mini-player`)
  } else {
    void win.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'mini-player' })
  }

  win.once('ready-to-show', () => {
    if (!win.isDestroyed()) {
      win.show()
      startMiniPlayerSnapshotPush()
    }
  })
}

export function hideMiniPlayerWindow(): void {
  const win = getMiniPlayerWindow()
  if (win && !win.isDestroyed()) {
    win.close()
  }
}

export function registerMiniPlayerWindowIpcHandlers(): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  ipcMain.handle(mw.miniPlayerShow, () => {
    focusOrCreateMiniPlayerWindow()
  })
  ipcMain.handle(mw.miniPlayerHide, () => {
    hideMiniPlayerWindow()
  })
  ipcMain.handle(mw.miniPlayerGetSnapshot, () => buildMiniPlayerSnapshotFromMain())
  ipcMain.handle(mw.miniPlayerSetAlwaysOnTop, (_, enabled: unknown) => {
    const on = enabled === true
    const win = getMiniPlayerWindow()
    if (win && !win.isDestroyed()) {
      win.setAlwaysOnTop(on)
    }
    patchMiniPlayerSession({ alwaysOnTop: on })
    pushMiniPlayerSnapshot()
    return { ok: true as const, alwaysOnTop: on }
  })
  ipcMain.handle(mw.miniPlayerFocusMain, () => {
    focusMainBrowserWindow()
  })
}

export { isMiniPlayerWindow }
