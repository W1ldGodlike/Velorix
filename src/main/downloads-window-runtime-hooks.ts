import { BrowserWindow, type WebContents } from 'electron'

import type { DownloadsWindowUiPanelState, ResolvedAppTheme } from '../shared/settings-contract'
import type { StoredWindowRect } from './settings-store'
import { downloadsIpc as d } from '../shared/ipc-channels'
import type {
  YtdlpDownloadOptionsPayload,
  YtdlpDownloadOptionsPatch
} from './ytdlp-download-options'
import { isInspectorWindow } from './inspector-window'
import type { AppUiLocale } from '../shared/app-ui-locale'
import {
  getDownloadsWindowIpcStrings,
  type DownloadsWindowIpcStrings
} from '../shared/downloads-window-ipc-locale'

/** Совпадает с preload подпиской на снимок очереди. */
export const DOWNLOADS_QUEUE_SNAPSHOT_CHANNEL = d.queueSnapshot

export interface DownloadsWindowBoundsHooks {
  /** §4.A — главное окно тоже может управлять embedded вкладкой `Загрузки`. */
  isMainWindowSender?: (sender: WebContents) => boolean
  getSavedDownloadsBounds?: () => StoredWindowRect | undefined
  persistDownloadsBounds?: (rect: StoredWindowRect) => void
  /** §6.2 — диалог выбора каталога и сохранение в settings.json (реализуется в index.ts). */
  pickYtdlpOutputDirectory?: (
    win: BrowserWindow
  ) => Promise<
    { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
  >
  clearYtdlpOutputDirectoryOverride?: () => void
  /** §6.2 — файл Netscape cookies (`--cookies`), сохраняется сразу после диалога. */
  pickYtdlpCookiesFile?: (
    win: BrowserWindow
  ) => Promise<
    { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
  >
  clearYtdlpCookiesFile?: () => void
  /** §6.2 — шаблон `-o` и пресет `-f`; persisted в `settings.json` из index.ts; raw — опции превью argv §6.3. */
  getYtdlpDownloadCliOptions?: (
    raw?: unknown,
    uiLocale?: AppUiLocale
  ) => YtdlpDownloadOptionsPayload
  applyYtdlpDownloadCliPatch?: (
    patch: YtdlpDownloadOptionsPatch,
    uiLocale?: AppUiLocale
  ) => { ok: true } | { ok: false; error: string }
  /** §6.4 — открыть готовый файл из yt-dlp в основном обработчике/preview FluxAlloy. */
  openDownloadedFileInHandler?: (
    absoluteFile: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>
  /** §4.1 — снимок раскрытых секций для React pop-out / вкладки «Загрузки». */
  getDownloadsWindowUiPanelsSnapshot?: () => DownloadsWindowUiPanelState | undefined
  /** §4.1 — сохранить частичное состояние раскрытых секций в `settings.json`. */
  mergeDownloadsWindowUiPanelsPatch?: (patch: Partial<DownloadsWindowUiPanelState>) => void
  /** Текущая тема приложения — начальное `data-theme` и синхрон с меню главного окна. */
  getAppTheme?: () => ResolvedAppTheme
  /** UI locale when renderer does not pass `uiLocale` in `openDownloadsWindow`. */
  getDownloadsUiLocale?: () => AppUiLocale
}

let downloadsBoundsHooks: DownloadsWindowBoundsHooks = {}

export function getDownloadsBoundsHooks(): DownloadsWindowBoundsHooks {
  return downloadsBoundsHooks
}

/** Вызывается из main после загрузки `settings.json`, чтобы не тянуть замыкание из `index.ts` в этот модуль. */
export function configureDownloadsWindowBoundsHooks(hooks: DownloadsWindowBoundsHooks): void {
  downloadsBoundsHooks = hooks
}

let downloadsWindow: BrowserWindow | null = null

/** Locale last used when opening the pop-out; drives IPC copy for downloads-window sender. */
let lastDownloadsPopoutResolvedUiLocale: AppUiLocale = 'ru'

export function ipcUiLocale(sender: WebContents): AppUiLocale {
  if (isDownloadsSender(sender)) {
    return lastDownloadsPopoutResolvedUiLocale
  }
  return downloadsBoundsHooks.getDownloadsUiLocale?.() ?? 'ru'
}

export function ipcStr(sender: WebContents): DownloadsWindowIpcStrings {
  return getDownloadsWindowIpcStrings(ipcUiLocale(sender))
}

export function isDownloadsSender(sender: WebContents): boolean {
  return (
    downloadsWindow !== null &&
    !downloadsWindow.isDestroyed() &&
    sender.id === downloadsWindow.webContents.id
  )
}

export function isDownloadsOrMainSender(sender: WebContents): boolean {
  return isDownloadsSender(sender) || downloadsBoundsHooks.isMainWindowSender?.(sender) === true
}

export function isDownloadsWindow(win: BrowserWindow | null | undefined): boolean {
  return (
    win !== null &&
    win !== undefined &&
    downloadsWindow !== null &&
    !downloadsWindow.isDestroyed() &&
    !win.isDestroyed() &&
    win.id === downloadsWindow.id
  )
}

/** Главное окно редактора — любое живое окно кроме менеджера загрузок и инспектора §9. */
export function resolveMainEditorWindow(): BrowserWindow | null {
  const wins = BrowserWindow.getAllWindows()
  for (let i = 0; i < wins.length; i++) {
    const win = wins[i]
    if (win === undefined || win.isDestroyed()) {
      continue
    }
    if (isDownloadsWindow(win) || isInspectorWindow(win)) {
      continue
    }
    return win
  }
  return null
}

export function getDownloadsPopoutWindow(): BrowserWindow | null {
  return downloadsWindow
}

export function setDownloadsPopoutWindow(win: BrowserWindow | null): void {
  downloadsWindow = win
}

export function getDownloadsPopoutWebContents(): WebContents | null {
  if (downloadsWindow === null || downloadsWindow.isDestroyed()) {
    return null
  }
  return downloadsWindow.webContents
}

export function getLastDownloadsPopoutResolvedUiLocale(): AppUiLocale {
  return lastDownloadsPopoutResolvedUiLocale
}

export function setLastDownloadsPopoutResolvedUiLocale(loc: AppUiLocale): void {
  lastDownloadsPopoutResolvedUiLocale = loc
}
