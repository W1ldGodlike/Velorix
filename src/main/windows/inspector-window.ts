import { existsSync } from 'fs'
import { join, normalize, resolve } from 'path'

import { BrowserWindow, ipcMain } from 'electron'
import { is } from '@electron-toolkit/utils'

import { grantMediaPath, isGrantedMediaPath } from '../core/media-protocol'
import { installExternalNavigationGuard, openAllowedExternalUrl } from '../core/external-url'
import { resolvePreloadOutFile } from '../core/preload-resolve'
import type { StoredWindowRect } from '../services/settings/settings-store'
import { boundsFromBrowserWindow, rectifyBoundsForRestore } from './window-bounds'
import {
  defaultInspectorWindowSize,
  displayMatchingRestoreRect,
  inspectorWindowMinLogicalSize,
  logicalScaleFactor
} from './window-hidpi'
import { getInspectorWindowTitle } from '../../shared/app-ui-locale'
import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import { mainDownloadsUiLocale } from '../bootstrap/main-bootstrap-ipc-helpers'

/** Стартовый путь для `inspectorBootstrap`; не одноразовый из-за двойного mount в React StrictMode. */
let pendingInspectorInitialPath: string | null = null

let inspectorWindow: BrowserWindow | null = null

let ipcRegistered = false

interface InspectorWindowHooks {
  getSavedInspectorBounds?: () => StoredWindowRect | undefined
  persistInspectorBounds?: (rect: StoredWindowRect) => void
  /** Последний путь превью из settings — подставляем при открытии окна без явного пути. */
  getDefaultInspectorMediaPath?: () => string | undefined
}

let inspectorHooks: InspectorWindowHooks = {}

export function configureInspectorWindowHooks(hooks: InspectorWindowHooks): void {
  inspectorHooks = hooks
}

function isInspectorSender(senderId: number): boolean {
  return (
    inspectorWindow !== null &&
    !inspectorWindow.isDestroyed() &&
    inspectorWindow.webContents.id === senderId
  )
}

export function isInspectorWindow(win: BrowserWindow | null | undefined): boolean {
  return (
    win !== null &&
    win !== undefined &&
    inspectorWindow !== null &&
    !inspectorWindow.isDestroyed() &&
    !win.isDestroyed() &&
    win.id === inspectorWindow.id
  )
}

function grantAndNormalizeExistingPath(abs: string): string | null {
  const normalized = resolve(normalize(abs.trim()))
  if (!existsSync(normalized)) {
    return null
  }
  const mediaUrl = grantMediaPath(normalized)
  return mediaUrl ? normalized : null
}

function normalizeAlreadyGrantedPath(abs: string): string | null {
  const normalized = resolve(normalize(abs.trim()))
  if (!existsSync(normalized) || !isGrantedMediaPath(normalized)) {
    return null
  }
  return normalized
}

function resolveRequestedOrDefaultPath(raw: unknown): string | null {
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return normalizeAlreadyGrantedPath(raw)
  }
  const fb = inspectorHooks.getDefaultInspectorMediaPath?.()
  if (typeof fb === 'string' && fb.trim().length > 0) {
    return grantAndNormalizeExistingPath(fb)
  }
  return null
}

/**
 * §9 §363 — отдельное окно инспектора на том же renderer entry, preload и IPC, что главное окно.
 * При повторном вызове с явным путём отправляет событие в уже открытое окно.
 */
export function focusOrCreateInspectorWindow(requestedMediaPath?: unknown): void {
  const resolved = resolveRequestedOrDefaultPath(requestedMediaPath)

  if (inspectorWindow && !inspectorWindow.isDestroyed()) {
    if (resolved) {
      inspectorWindow.webContents.send(mw.inspectorTargetMediaPath, resolved)
    }
    inspectorWindow.focus()
    return
  }

  pendingInspectorInitialPath = resolved

  const saved = inspectorHooks.getSavedInspectorBounds?.()
  const rect = saved ? rectifyBoundsForRestore(saved) : null
  const inspDisp = displayMatchingRestoreRect(rect)
  const inspScale = logicalScaleFactor(inspDisp)
  const inspMin = inspectorWindowMinLogicalSize(inspScale)
  const inspDefault = defaultInspectorWindowSize(
    inspDisp.workAreaSize.width,
    inspDisp.workAreaSize.height,
    inspMin.minWidth,
    inspMin.minHeight
  )

  inspectorWindow = new BrowserWindow({
    width: rect?.width ?? inspDefault.width,
    height: rect?.height ?? inspDefault.height,
    minWidth: inspMin.minWidth,
    minHeight: inspMin.minHeight,
    ...(rect ? { x: rect.x, y: rect.y } : {}),
    show: false,
    title: getInspectorWindowTitle(mainDownloadsUiLocale()),
    webPreferences: {
      preload: resolvePreloadOutFile('index', __dirname),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  let boundsTimer: ReturnType<typeof setTimeout> | null = null
  const flushInspectorBounds = (): void => {
    if (!inspectorWindow || inspectorWindow.isDestroyed()) {
      return
    }
    inspectorHooks.persistInspectorBounds?.(boundsFromBrowserWindow(inspectorWindow))
  }
  const scheduleInspectorBounds = (): void => {
    if (boundsTimer !== null) {
      clearTimeout(boundsTimer)
    }
    boundsTimer = setTimeout(() => {
      boundsTimer = null
      flushInspectorBounds()
    }, 480)
  }

  inspectorWindow.on('resize', scheduleInspectorBounds)
  inspectorWindow.on('move', scheduleInspectorBounds)
  inspectorWindow.on('close', () => {
    if (boundsTimer !== null) {
      clearTimeout(boundsTimer)
      boundsTimer = null
    }
    flushInspectorBounds()
  })

  inspectorWindow.on('closed', () => {
    inspectorWindow = null
    pendingInspectorInitialPath = null
  })

  inspectorWindow.webContents.setWindowOpenHandler((details) => {
    openAllowedExternalUrl(details.url)
    return { action: 'deny' }
  })
  installExternalNavigationGuard(inspectorWindow.webContents)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    const base = process.env['ELECTRON_RENDERER_URL'].replace(/\/$/, '')
    void inspectorWindow.loadURL(`${base}#inspector`)
  } else {
    void inspectorWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'inspector' })
  }

  inspectorWindow.once('ready-to-show', () => {
    inspectorWindow?.show()
  })
}

export function registerInspectorWindowIpcHandlers(): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  ipcMain.handle(mw.openInspectorWindow, (_, raw?: unknown) => {
    focusOrCreateInspectorWindow(raw)
  })

  ipcMain.handle(mw.inspectorBootstrap, (event): { initialMediaPath: string | null } => {
    if (!isInspectorSender(event.sender.id)) {
      return { initialMediaPath: null }
    }
    return { initialMediaPath: pendingInspectorInitialPath }
  })
}
