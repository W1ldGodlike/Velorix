import { existsSync } from 'fs'
import { basename, normalize, resolve } from 'path'

import { ipcMain } from 'electron'

import { grantMediaPath, isGrantedMediaPath } from '../core/media-protocol'
import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import { mainWindowRef } from './main-window-runtime-state'

let ipcRegistered = false

interface InspectorWindowHooks {
  /** Последний путь превью из settings — подставляем при открытии route без явного пути. */
  getDefaultInspectorMediaPath?: () => string | undefined
}

let inspectorHooks: InspectorWindowHooks = {}

export function configureInspectorWindowHooks(hooks: InspectorWindowHooks): void {
  inspectorHooks = hooks
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

function focusMainInspectorRoute(requestedMediaPath?: unknown): void {
  const target = mainWindowRef && !mainWindowRef.isDestroyed() ? mainWindowRef : null
  if (!target) {
    return
  }
  const resolved = resolveRequestedOrDefaultPath(requestedMediaPath)
  if (resolved) {
    const mediaUrl = grantMediaPath(resolved)
    if (mediaUrl) {
      target.webContents.send(mw.previewOpened, {
        ok: true,
        path: resolved,
        mediaUrl,
        name: basename(resolved)
      })
    }
  }
  target.show()
  target.focus()
  target.webContents.send(mw.openInspectorRoute)
}

/**
 * Variant A: `Инспектор` живёт внутри main shell.
 * Внешние вызовы IPC сохраняются, но фокусируют main window и route `inspector`.
 */
export function focusOrCreateInspectorWindow(requestedMediaPath?: unknown): void {
  focusMainInspectorRoute(requestedMediaPath)
}

export function registerInspectorWindowIpcHandlers(): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  ipcMain.handle(mw.openInspectorWindow, (_, raw?: unknown) => {
    focusOrCreateInspectorWindow(raw)
  })
}
