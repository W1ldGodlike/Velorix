import { BrowserWindow, shell, type WebContents } from 'electron'

import { resolveAppPaths } from './app-paths'
import type { DownloadsOutputDirectorySnapshot } from '../shared/downloads-output-directory-snapshot'
import type { DownloadsWindowUiPanelState, ResolvedAppTheme } from '../shared/settings-contract'
import type { StoredWindowRect } from './settings-store'
import { getDownloadsQueueSnapshot } from './downloads-queue'
import { getActiveDownloadsRunnerRowId } from './downloads-queue-runner'
import { DOWNLOADS_LOG_CHANNEL, type DownloadsLogPayload } from './downloads-log-ipc'
import { schedulePersistDownloadsQueueDebounced } from './ytdlp-download-queue-persist'
import { downloadsIpc as d, mainWindowIpc as mw } from '../shared/ipc-channels'
import {
  isYtdlpDownloadDirectoryDefault,
  resolveAllowedYtdlpDownloadOutputFile,
  resolveYtdlpOutputDirectory
} from './ytdlp-download-output'
import { getActiveYtdlpPauseState } from './ytdlp-download-service'
import type {
  YtdlpDownloadOptionsPayload,
  YtdlpDownloadOptionsPatch
} from './ytdlp-download-options'
import { isInspectorWindow } from './inspector-window'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
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
    uiLocale?: DownloadsWindowUiLocale
  ) => YtdlpDownloadOptionsPayload
  applyYtdlpDownloadCliPatch?: (
    patch: YtdlpDownloadOptionsPatch,
    uiLocale?: DownloadsWindowUiLocale
  ) => { ok: true } | { ok: false; error: string }
  /** §6.4 — открыть готовый файл из yt-dlp в основном обработчике/preview FluxAlloy. */
  openDownloadedFileInHandler?: (
    absoluteFile: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>
  /** §4.1 — снимок раскрытых секций для первичной разметки `buildDownloadsHtml`. */
  getDownloadsWindowUiPanelsSnapshot?: () => DownloadsWindowUiPanelState | undefined
  /** §4.1 — сохранить частичное состояние раскрытых секций в `settings.json`. */
  mergeDownloadsWindowUiPanelsPatch?: (patch: Partial<DownloadsWindowUiPanelState>) => void
  /** Текущая тема приложения — начальное `data-theme` и синхрон с меню главного окна. */
  getAppTheme?: () => ResolvedAppTheme
  /** UI locale when renderer does not pass `uiLocale` in `openDownloadsWindow`. */
  getDownloadsUiLocale?: () => DownloadsWindowUiLocale
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
let lastDownloadsWindowResolvedUiLocale: DownloadsWindowUiLocale = 'ru'

export function ipcUiLocale(sender: WebContents): DownloadsWindowUiLocale {
  if (isDownloadsSender(sender)) {
    return lastDownloadsWindowResolvedUiLocale
  }
  return downloadsBoundsHooks.getDownloadsUiLocale?.() ?? 'ru'
}

export function ipcStr(sender: WebContents): DownloadsWindowIpcStrings {
  return getDownloadsWindowIpcStrings(ipcUiLocale(sender))
}

let broadcastThrottleTimer: ReturnType<typeof setTimeout> | null = null

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

type DownloadOutputOpenMode = 'file' | 'folder'

export function isDownloadOutputOpenMode(raw: unknown): raw is DownloadOutputOpenMode {
  return raw === 'file' || raw === 'folder'
}

export function resolveAllowedDownloadOutputPath(raw: unknown): string | null {
  const paths = resolveAppPaths()
  return resolveAllowedYtdlpDownloadOutputFile(raw, paths.userData)
}

export async function openDownloadOutputPath(
  rawPath: unknown,
  mode: DownloadOutputOpenMode,
  ipc: DownloadsWindowIpcStrings
): Promise<{ ok: true } | { ok: false; error: string }> {
  const file = resolveAllowedDownloadOutputPath(rawPath)
  if (!file) {
    return { ok: false, error: ipc.fileOutsideDownloadDir }
  }
  try {
    if (mode === 'folder') {
      shell.showItemInFolder(file)
      return { ok: true }
    }
    const err = await shell.openPath(file)
    return err ? { ok: false, error: err } : { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

export async function openDownloadOutputInHandler(
  rawPath: unknown,
  ipc: DownloadsWindowIpcStrings
): Promise<{ ok: true } | { ok: false; error: string }> {
  const file = resolveAllowedDownloadOutputPath(rawPath)
  if (!file) {
    return { ok: false, error: ipc.fileOutsideDownloadDir }
  }
  const fn = downloadsBoundsHooks.openDownloadedFileInHandler
  if (!fn) {
    return { ok: false, error: ipc.handlerNotConnected }
  }
  return fn(file)
}

export function getDownloadsQueueSnapshotForRenderer(): Array<Record<string, unknown>> {
  const activeId = getActiveDownloadsRunnerRowId()
  const ps = getActiveYtdlpPauseState()
  return getDownloadsQueueSnapshot().map((r) => {
    const isActive = r.id === activeId
    const row: Record<string, unknown> = { ...r, isActiveRunner: isActive }
    if (isActive) {
      row['ytdlpPauseSupported'] = ps.supported
      row['ytdlpPauseChildActive'] = ps.active
      row['ytdlpPaused'] = ps.paused
    }
    return row
  })
}

/** Отправить очередь во все UI-представления загрузок без полной перезагрузки документа. */
export function broadcastDownloadsSnapshot(): void {
  schedulePersistDownloadsQueueDebounced()
  if (broadcastThrottleTimer !== null) {
    return
  }
  broadcastThrottleTimer = setTimeout(() => {
    broadcastThrottleTimer = null
    try {
      const rows = getDownloadsQueueSnapshotForRenderer()
      if (downloadsWindow && !downloadsWindow.isDestroyed()) {
        downloadsWindow.webContents.send(DOWNLOADS_QUEUE_SNAPSHOT_CHANNEL, rows)
      }
      const mainWindow = resolveMainEditorWindow()
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(DOWNLOADS_QUEUE_SNAPSHOT_CHANNEL, rows)
      }
    } catch {
      /* окно закрывается */
    }
  }, 120)
}

export function broadcastDownloadsLogPayload(payload: DownloadsLogPayload): void {
  const targets = [downloadsWindow, resolveMainEditorWindow()]
  for (const win of targets) {
    if (!win || win.isDestroyed()) {
      continue
    }
    try {
      win.webContents.send(DOWNLOADS_LOG_CHANNEL, payload)
    } catch {
      /* окно закрывается */
    }
  }
}

/** §6.1 — раскрытие секций rail / история / лог: pop-out ↔ вкладка «Загрузки» в главном окне. */
export function broadcastDownloadsWindowUiPanelsSnapshot(
  snap: DownloadsWindowUiPanelState = {}
): void {
  const targets: BrowserWindow[] = []
  if (downloadsWindow && !downloadsWindow.isDestroyed()) {
    targets.push(downloadsWindow)
  }
  const mainEditor = resolveMainEditorWindow()
  if (mainEditor && !mainEditor.isDestroyed()) {
    targets.push(mainEditor)
  }
  for (const w of targets) {
    try {
      w.webContents.send(mw.downloadsWindowUiPanelsChanged, snap)
    } catch {
      /* окно закрывается */
    }
  }
}

/** §6.2 — yt-dlp CLI/options: вкладка «Загрузки» ↔ pop-out после persist patch/cookies. */
export function broadcastDownloadsCliOptionsChanged(): void {
  const targets: BrowserWindow[] = []
  if (downloadsWindow && !downloadsWindow.isDestroyed()) {
    targets.push(downloadsWindow)
  }
  const mainEditor = resolveMainEditorWindow()
  if (mainEditor && !mainEditor.isDestroyed()) {
    targets.push(mainEditor)
  }
  for (const w of targets) {
    try {
      w.webContents.send(mw.downloadsCliOptionsChanged)
    } catch {
      /* окно закрывается */
    }
  }
}

/** §6.2 — каталог вывода yt-dlp: вкладка «Загрузки» ↔ pop-out после pick/clear. */
export function broadcastDownloadsOutputDirectorySnapshot(
  snap?: DownloadsOutputDirectorySnapshot
): void {
  const paths = resolveAppPaths()
  const payload: DownloadsOutputDirectorySnapshot =
    snap ??
    ({
      path: resolveYtdlpOutputDirectory(paths.userData),
      isDefault: isYtdlpDownloadDirectoryDefault()
    } as const)
  const targets: BrowserWindow[] = []
  if (downloadsWindow && !downloadsWindow.isDestroyed()) {
    targets.push(downloadsWindow)
  }
  const mainEditor = resolveMainEditorWindow()
  if (mainEditor && !mainEditor.isDestroyed()) {
    targets.push(mainEditor)
  }
  for (const w of targets) {
    try {
      w.webContents.send(mw.downloadsOutputDirectoryChanged, payload)
    } catch {
      /* окно закрывается */
    }
  }
}

export function sanitizeDownloadsUiPanelPatch(raw: unknown): Partial<DownloadsWindowUiPanelState> {
  if (!raw || typeof raw !== 'object') {
    return {}
  }
  const keys: (keyof DownloadsWindowUiPanelState)[] = [
    'history',
    'log',
    'format',
    'metadata',
    'saving',
    'network',
    'expert',
    'hints'
  ]
  const o = raw as Record<string, unknown>
  const out: Partial<DownloadsWindowUiPanelState> = {}
  for (const k of keys) {
    if (typeof o[k] === 'boolean') {
      out[k] = o[k]
    }
  }
  return out
}

export function getDownloadsPopoutWindow(): BrowserWindow | null {
  return downloadsWindow
}

export function setDownloadsPopoutWindow(win: BrowserWindow | null): void {
  downloadsWindow = win
}

export function getLastDownloadsWindowResolvedUiLocale(): DownloadsWindowUiLocale {
  return lastDownloadsWindowResolvedUiLocale
}

export function setLastDownloadsWindowResolvedUiLocale(loc: DownloadsWindowUiLocale): void {
  lastDownloadsWindowResolvedUiLocale = loc
}
