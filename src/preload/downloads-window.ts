import { contextBridge, ipcRenderer } from 'electron'

import type { DownloadsLogPayload } from '../shared/downloads-log-contract'
import type {
  YtdlpDownloadOptionsPatch,
  YtdlpDownloadOptionsPayload,
  YtdlpGetCliOptionsParams
} from '../shared/ytdlp-download-contract'
import { sanitizeDownloadsOutputDirectorySnapshot } from '../shared/downloads-output-directory-snapshot'
import type { DownloadsOutputDirectorySnapshot } from '../shared/downloads-output-directory-snapshot'
import type { DownloadsWindowUiPanelState, ResolvedAppTheme } from '../shared/settings-contract'
import type { YtdlpDownloadHistoryEntry } from '../shared/ytdlp-history-contract'
import { downloadsIpc as d, mainWindowIpc as mw } from '../shared/ipc-channels'

function isDownloadsLogPayload(raw: unknown): raw is DownloadsLogPayload {
  if (!raw || typeof raw !== 'object') {
    return false
  }
  const o = raw as { kind?: unknown }
  if (o.kind === 'reset') {
    const rowId = (raw as { rowId?: unknown }).rowId
    return typeof rowId === 'number' && Number.isFinite(rowId)
  }
  if (o.kind === 'line') {
    const rowId = (raw as { rowId?: unknown }).rowId
    const stream = (raw as { stream?: unknown }).stream
    const text = (raw as { text?: unknown }).text
    return (
      typeof rowId === 'number' &&
      Number.isFinite(rowId) &&
      (stream === 'stdout' || stream === 'stderr') &&
      typeof text === 'string'
    )
  }
  return false
}

const DOWNLOADS_WINDOW_UI_PANEL_KEYS: (keyof DownloadsWindowUiPanelState)[] = [
  'history',
  'log',
  'format',
  'metadata',
  'saving',
  'network',
  'expert',
  'hints'
]

function sanitizeDownloadsWindowUiPanelState(raw: unknown): DownloadsWindowUiPanelState {
  if (!raw || typeof raw !== 'object') {
    return {}
  }
  const src = raw as Record<string, unknown>
  const out: DownloadsWindowUiPanelState = {}
  for (const key of DOWNLOADS_WINDOW_UI_PANEL_KEYS) {
    if (typeof src[key] === 'boolean') {
      out[key] = src[key]
    }
  }
  return out
}

/**
 * Узкий API только для второго окна (data-document + sandbox).
 * Основное приложение этот объект не экспонирует.
 */
contextBridge.exposeInMainWorld('fluxalloyDownloads', {
  addLines: (text: string): Promise<{ ok: true; added: number } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.addLines, text),
  clearQueue: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.clear),
  clearFinishedRows: (): Promise<{ ok: true; removed: number } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.clearFinished),
  removeRow: (id: number): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.remove, id),
  moveRow: (id: number, direction: number): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.move, id, direction),

  getSnapshot: (): Promise<unknown[]> => ipcRenderer.invoke(d.getSnapshot),

  /** §6.4 — последние записи истории (newest first). */
  getHistory: (): Promise<YtdlpDownloadHistoryEntry[]> => ipcRenderer.invoke(d.getHistory),

  clearHistory: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.clearHistory),

  onSnapshot: (listener: (rows: unknown[]) => void): (() => void) => {
    const handler = (_event: unknown, rows: unknown): void => {
      listener(Array.isArray(rows) ? rows : [])
    }
    ipcRenderer.on(d.queueSnapshot, handler)
    return (): void => {
      ipcRenderer.removeListener(d.queueSnapshot, handler)
    }
  },

  startQueue: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.startQueue),

  startRow: (id: number): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.startRow, id),

  retryRow: (id: number): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.retryRow, id),

  cancelQueue: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.cancelRun),

  getYtdlpPauseState: (): Promise<{
    supported: boolean
    active: boolean
    paused: boolean
  }> => ipcRenderer.invoke(d.getYtdlpPauseState),

  pauseYtdlp: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.pauseYtdlp),

  resumeYtdlp: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.resumeYtdlp),

  getOutputDirectory: (): Promise<{ path: string; isDefault: boolean }> =>
    ipcRenderer.invoke(d.getOutputDir),

  openOutputDirectory: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.openOutputDir),

  pickOutputDirectory: (): Promise<
    { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
  > => ipcRenderer.invoke(d.pickOutputDir),

  clearOutputDirectory: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.clearOutputDir),

  pickCookiesFile: (): Promise<
    { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
  > => ipcRenderer.invoke(d.pickCookiesFile),

  clearCookiesFile: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.clearCookiesFile),

  getCliOptions: (
    params?: YtdlpGetCliOptionsParams
  ): Promise<{ ok: true; payload: YtdlpDownloadOptionsPayload } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.getCliOptions, params),

  setCliOptions: (
    patch: YtdlpDownloadOptionsPatch
  ): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.setCliOptions, patch),

  saveVisibleLog: (
    text: string
  ): Promise<{ ok: true; path: string } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.saveVisibleLog, text),

  openQueueOutput: (
    id: number,
    mode: 'file' | 'folder'
  ): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.openQueueOutput, id, mode),

  openHistoryOutput: (
    id: string,
    mode: 'file' | 'folder'
  ): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.openHistoryOutput, id, mode),

  openQueueOutputInHandler: (id: number): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.openQueueOutputInHandler, id),

  openHistoryOutputInHandler: (id: string): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.openHistoryOutputInHandler, id),

  onLog: (listener: (payload: DownloadsLogPayload) => void): (() => void) => {
    const handler = (_event: unknown, raw: unknown): void => {
      if (!isDownloadsLogPayload(raw)) {
        return
      }
      listener(raw)
    }
    ipcRenderer.on(d.log, handler)
    return (): void => {
      ipcRenderer.removeListener(d.log, handler)
    }
  },

  /** §4.1 — сохранить раскрытие секций окна загрузок (debounce со стороны UI не нужен — редкие события). */
  mergeUiPanels: (
    patch: Partial<DownloadsWindowUiPanelState>
  ): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.mergeUiPanels, patch),

  /** Main → pop-out: полный снимок панелей после merge (вкладка «Загрузки» ↔ pop-out). */
  onDownloadsWindowUiPanelsChanged: (
    listener: (panels: DownloadsWindowUiPanelState) => void
  ): (() => void) => {
    const channel = mw.downloadsWindowUiPanelsChanged
    const handler = (_: unknown, raw: unknown): void => {
      listener(sanitizeDownloadsWindowUiPanelState(raw))
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },

  onDownloadsOutputDirectoryChanged: (
    listener: (snap: DownloadsOutputDirectorySnapshot) => void
  ): (() => void) => {
    const channel = mw.downloadsOutputDirectoryChanged
    const handler = (_: unknown, raw: unknown): void => {
      listener(sanitizeDownloadsOutputDirectorySnapshot(raw))
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },

  /** §1.1 — broadcast эффективной палитры из main (`persistThemePreference` / `nativeTheme`): как у главного окна. */
  onThemeChanged: (listener: (theme: ResolvedAppTheme) => void): (() => void) => {
    const handler = (_event: unknown, raw: unknown): void => {
      if (raw === 'light' || raw === 'dark') {
        listener(raw)
      }
    }
    ipcRenderer.on(mw.themeChanged, handler)
    return (): void => {
      ipcRenderer.removeListener(mw.themeChanged, handler)
    }
  },

  /** IPC-мост во главное окно / инспектор (строгая проверка отправителя в main). */
  bridgeOpenInspector: (
    mediaPath?: string | null
  ): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.bridgeOpenInspector, mediaPath ?? null),

  bridgeFocusMainEditor: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.bridgeFocusMainEditor),

  bridgeOpenEnginePaths: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.bridgeOpenEnginePaths),

  bridgeOpenAbout: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.bridgeOpenAbout)
})
