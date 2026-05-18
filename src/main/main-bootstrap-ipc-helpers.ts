import { basename } from 'path'

import { BrowserWindow, app, ipcMain } from 'electron'
import type { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import { mainWindowIpc as mw } from '../shared/ipc-channels'
import {
  appUiLocaleFromSystemLocale,
  parseAppUiLocale,
  type AppUiLocale
} from '../shared/app-ui-locale'
import { getMainApplicationStrings } from '../shared/main-application-locale'
import { isInspectorWindow } from './inspector-window'
import { logFromRendererSafe } from './logger-service'

/** Совпадает с лимитом буфера обмена в main: защита от огромных строк из renderer. */
const SAVE_TEXT_DIALOG_MAX_CHARS = 24 * 1024 * 1024

const RENDERER_LOG_BUCKET_CAPACITY = 30
const RENDERER_LOG_REFILL_PER_SECOND = 10

interface RendererLogBucket {
  tokens: number
  updatedAtMs: number
}

const rendererLogBuckets = new Map<number, RendererLogBucket>()

export type MainBootstrapIpcHelpersAccess = {
  getMainWindowWebContentsId: () => number | null
  getUiLocaleFromSettings: () => string | undefined
}

let access: MainBootstrapIpcHelpersAccess | null = null

export function configureMainBootstrapIpcHelpers(next: MainBootstrapIpcHelpersAccess): void {
  access = next
}

function requireAccess(): MainBootstrapIpcHelpersAccess {
  if (!access) {
    throw new Error('main-bootstrap-ipc-helpers: configureMainBootstrapIpcHelpers not called')
  }
  return access
}

export function mainDownloadsUiLocale(): AppUiLocale {
  try {
    const fromSettings = parseAppUiLocale(requireAccess().getUiLocaleFromSettings())
    if (fromSettings !== undefined) {
      return fromSettings
    }
    return appUiLocaleFromSystemLocale(app.getLocale())
  } catch {
    return 'ru'
  }
}

export function mainAppStr(): ReturnType<typeof getMainApplicationStrings> {
  return getMainApplicationStrings(mainDownloadsUiLocale())
}

export function ipcDownloadsUiLocale(raw: unknown): AppUiLocale {
  return raw === 'en' || raw === 'ru' ? raw : mainDownloadsUiLocale()
}

export function parseDownloadsOpenRequest(raw: unknown): {
  mergeText: string | null
  uiLocale?: AppUiLocale
} {
  if (raw === null || raw === undefined) {
    return { mergeText: null }
  }
  if (typeof raw === 'string') {
    const t = raw.trim()
    return { mergeText: t.length > 0 ? t : null }
  }
  if (typeof raw === 'object' && raw !== null) {
    const o = raw as Record<string, unknown>
    let mergeText: string | null = null
    if (typeof o['text'] === 'string') {
      const t = o['text'].trim()
      if (t.length > 0) {
        mergeText = t
      }
    }
    const parsed = parseAppUiLocale(o['uiLocale'])
    const out: { mergeText: string | null; uiLocale?: AppUiLocale } = { mergeText }
    if (parsed !== undefined) {
      out.uiLocale = parsed
    }
    return out
  }
  return { mergeText: null }
}

export function parseSaveTextDialogPayload(
  raw: unknown,
  locale: AppUiLocale
):
  | { ok: true; title: string; defaultFileName: string; content: string }
  | { ok: false; error: string } {
  const S = getMainApplicationStrings(locale)
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: S.saveTextInvalidRequest }
  }
  const o = raw as Record<string, unknown>
  const titleRaw = typeof o['title'] === 'string' ? o['title'].trim() : ''
  const title = titleRaw.length > 0 ? titleRaw : S.saveFileDefaultTitle
  const fnRaw = typeof o['defaultFileName'] === 'string' ? o['defaultFileName'].trim() : ''
  const baseFromPayload = basename(fnRaw.replace(/\\/g, '/'))
  let safeName =
    baseFromPayload.length > 0 && baseFromPayload !== '.' && baseFromPayload !== '..'
      ? baseFromPayload
      : 'fluxalloy-export.json'
  if (!/\.[a-z0-9]+$/i.test(safeName)) {
    safeName = `${safeName}.json`
  }
  if (typeof o['content'] !== 'string') {
    return { ok: false, error: S.saveTextInvalidContent }
  }
  const content = o['content']
  if (content.length > SAVE_TEXT_DIALOG_MAX_CHARS) {
    return { ok: false, error: S.saveTextTooLarge }
  }
  return { ok: true, title, defaultFileName: safeName, content }
}

function consumeRendererLogToken(senderId: number): boolean {
  const now = Date.now()
  const bucket = rendererLogBuckets.get(senderId) ?? {
    tokens: RENDERER_LOG_BUCKET_CAPACITY,
    updatedAtMs: now
  }
  const elapsedMs = Math.max(0, now - bucket.updatedAtMs)
  bucket.tokens = Math.min(
    RENDERER_LOG_BUCKET_CAPACITY,
    bucket.tokens + (elapsedMs / 1000) * RENDERER_LOG_REFILL_PER_SECOND
  )
  bucket.updatedAtMs = now
  if (bucket.tokens < 1) {
    rendererLogBuckets.set(senderId, bucket)
    return false
  }
  bucket.tokens -= 1
  rendererLogBuckets.set(senderId, bucket)
  return true
}

export function isMainWindowSender(event: IpcMainEvent): boolean {
  const id = requireAccess().getMainWindowWebContentsId()
  return id !== null && event.sender.id === id
}

export function isMainWindowUiPanelSender(event: IpcMainInvokeEvent): boolean {
  const id = requireAccess().getMainWindowWebContentsId()
  if (id !== null && event.sender.id === id) {
    return true
  }
  return isInspectorWindow(BrowserWindow.fromWebContents(event.sender))
}

export function clearRendererLogBucket(webContentsId: number): void {
  rendererLogBuckets.delete(webContentsId)
}

export function registerMainRendererLogIpcHandler(): void {
  ipcMain.on(mw.logRenderer, (event, raw: unknown) => {
    if (!isMainWindowSender(event) || !consumeRendererLogToken(event.sender.id)) {
      return
    }
    logFromRendererSafe(raw)
  })
}
