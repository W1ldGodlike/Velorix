import { contextBridge, ipcRenderer } from 'electron'

import type { DownloadsLogPayload } from '../shared/downloads-log-contract'
import type {
  YtdlpDownloadOptionsPatch,
  YtdlpDownloadOptionsPayload
} from '../shared/ytdlp-download-contract'
import type { YtdlpDownloadHistoryEntry } from '../shared/ytdlp-history-contract'
import { downloadsIpc as d } from '../shared/ipc-channels'

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

/**
 * Узкий API только для второго окна (data-document + sandbox).
 * Основное приложение этот объект не экспонирует.
 */
contextBridge.exposeInMainWorld('fluxalloyDownloads', {
  addLines: (text: string): Promise<number> => ipcRenderer.invoke(d.addLines, text),
  clearQueue: (): Promise<void> => ipcRenderer.invoke(d.clear),
  clearFinishedRows: (): Promise<number> => ipcRenderer.invoke(d.clearFinished),
  removeRow: (id: number): Promise<void> => ipcRenderer.invoke(d.remove, id),
  moveRow: (id: number, direction: number): Promise<void> =>
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

  getOutputDirectory: (): Promise<{ path: string; isDefault: boolean }> =>
    ipcRenderer.invoke(d.getOutputDir),

  openOutputDirectory: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.openOutputDir),

  pickOutputDirectory: (): Promise<
    { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
  > => ipcRenderer.invoke(d.pickOutputDir),

  clearOutputDirectory: (): Promise<void> => ipcRenderer.invoke(d.clearOutputDir),

  pickCookiesFile: (): Promise<
    { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
  > => ipcRenderer.invoke(d.pickCookiesFile),

  clearCookiesFile: (): Promise<void> => ipcRenderer.invoke(d.clearCookiesFile),

  getCliOptions: (): Promise<
    { ok: true; payload: YtdlpDownloadOptionsPayload } | { ok: false; error: string }
  > => ipcRenderer.invoke(d.getCliOptions),

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
  }
})
