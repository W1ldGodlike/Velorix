import { BrowserWindow, type WebContents } from 'electron'

import type { DownloadsWindowUiPanelState } from '../../shared/settings-contract'
import { downloadsIpc as d } from '../../shared/ipc-channels'
import type {
  YtdlpDownloadOptionsPayload,
  YtdlpDownloadOptionsPatch
} from '../services/ytdlp/ytdlp-download-options'
import type { AppUiLocale } from '../../shared/app-ui-locale'
import { mainWindowRef } from './main-window-runtime-state'
import {
  getDownloadsWindowIpcStrings,
  type DownloadsWindowIpcStrings
} from '../../shared/downloads-window-ipc-locale'

/** Совпадает с preload подпиской на снимок очереди. */
export const DOWNLOADS_QUEUE_SNAPSHOT_CHANNEL = d.queueSnapshot

export interface DownloadsWindowBoundsHooks {
  /** §4.A — главное окно управляет shell-вкладкой `Загрузки`. */
  isMainWindowSender?: (sender: WebContents) => boolean
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
  /** §6.4 — открыть готовый файл из yt-dlp в основном обработчике/preview Velorix. */
  openDownloadedFileInHandler?: (
    absoluteFile: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>
  /** §4.1 — снимок раскрытых секций shell-вкладки `Загрузки`. */
  getDownloadsWindowUiPanelsSnapshot?: () => DownloadsWindowUiPanelState | undefined
  /** §4.1 — сохранить частичное состояние раскрытых секций в `settings.json`. */
  mergeDownloadsWindowUiPanelsPatch?: (patch: Partial<DownloadsWindowUiPanelState>) => void
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

export function ipcUiLocale(sender: WebContents): AppUiLocale {
  void sender
  return downloadsBoundsHooks.getDownloadsUiLocale?.() ?? 'ru'
}

export function ipcStr(sender: WebContents): DownloadsWindowIpcStrings {
  return getDownloadsWindowIpcStrings(ipcUiLocale(sender))
}

export function isDownloadsOrMainSender(sender: WebContents): boolean {
  return downloadsBoundsHooks.isMainWindowSender?.(sender) === true
}

/** Главное shell-окно для broadcast/downloads IPC (Variant A — одно окно). */
export function resolveMainEditorWindow(): BrowserWindow | null {
  const ref = mainWindowRef
  if (ref && !ref.isDestroyed()) {
    return ref
  }
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) {
      return win
    }
  }
  return null
}
