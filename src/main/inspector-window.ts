import { existsSync } from 'fs'
import { join, normalize, resolve } from 'path'

import { BrowserWindow, ipcMain, shell } from 'electron'
import { is } from '@electron-toolkit/utils'

import { grantMediaPath, isGrantedMediaPath } from './media-protocol'
import { resolvePreloadOutFile } from './preload-resolve'
import type { StoredWindowRect } from './settings-store'
import { boundsFromBrowserWindow, rectifyBoundsForRestore } from './window-bounds'
import { mainWindowIpc as mw } from '../shared/ipc-channels'

/** Стартовый путь для первого `inspectorBootstrap` после создания окна. */
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

  inspectorWindow = new BrowserWindow({
    width: rect?.width ?? 920,
    height: rect?.height ?? 720,
    minWidth: 440,
    minHeight: 400,
    ...(rect ? { x: rect.x, y: rect.y } : {}),
    show: false,
    title: 'FluxAlloy — инспектор',
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
  })

  inspectorWindow.webContents.setWindowOpenHandler((details) => {
    void shell.openExternal(details.url)
    return { action: 'deny' }
  })

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
    const p = pendingInspectorInitialPath
    pendingInspectorInitialPath = null
    return { initialMediaPath: p }
  })
}
