import { contextBridge, ipcRenderer } from 'electron'

import type { DownloadsLogPayload } from '../main/downloads-log-ipc'
import { DOWNLOADS_LOG_CHANNEL } from '../main/downloads-log-ipc'
import type {
  YtdlpDownloadOptionsPatch,
  YtdlpDownloadOptionsPayload
} from '../main/ytdlp-download-options'
import type { YtdlpDownloadHistoryEntry } from '../main/ytdlp-download-history'

const QUEUE_SNAPSHOT_CHANNEL = 'fluxalloy-downloads-state'

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
  addLines: (text: string): Promise<number> =>
    ipcRenderer.invoke('fluxalloy-downloads-add-lines', text),
  clearQueue: (): Promise<void> => ipcRenderer.invoke('fluxalloy-downloads-clear'),
  removeRow: (id: number): Promise<void> => ipcRenderer.invoke('fluxalloy-downloads-remove', id),
  moveRow: (id: number, direction: number): Promise<void> =>
    ipcRenderer.invoke('fluxalloy-downloads-move', id, direction),

  getSnapshot: (): Promise<unknown[]> => ipcRenderer.invoke('fluxalloy-downloads-get-snapshot'),

  /** §6.4 — последние записи истории (newest first). */
  getHistory: (): Promise<YtdlpDownloadHistoryEntry[]> =>
    ipcRenderer.invoke('fluxalloy-downloads-get-history'),

  clearHistory: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke('fluxalloy-downloads-clear-history'),

  onSnapshot: (listener: (rows: unknown[]) => void): (() => void) => {
    const handler = (_event: unknown, rows: unknown): void => {
      listener(Array.isArray(rows) ? rows : [])
    }
    ipcRenderer.on(QUEUE_SNAPSHOT_CHANNEL, handler)
    return (): void => {
      ipcRenderer.removeListener(QUEUE_SNAPSHOT_CHANNEL, handler)
    }
  },

  startQueue: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke('fluxalloy-downloads-start-queue'),

  startRow: (id: number): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke('fluxalloy-downloads-start-row', id),

  cancelQueue: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke('fluxalloy-downloads-cancel-run'),

  getOutputDirectory: (): Promise<{ path: string; isDefault: boolean }> =>
    ipcRenderer.invoke('fluxalloy-downloads-get-output-dir'),

  openOutputDirectory: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke('fluxalloy-downloads-open-output-dir'),

  pickOutputDirectory: (): Promise<
    { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
  > => ipcRenderer.invoke('fluxalloy-downloads-pick-output-dir'),

  clearOutputDirectory: (): Promise<void> =>
    ipcRenderer.invoke('fluxalloy-downloads-clear-output-dir'),

  pickCookiesFile: (): Promise<
    { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
  > => ipcRenderer.invoke('fluxalloy-downloads-pick-cookies-file'),

  clearCookiesFile: (): Promise<void> =>
    ipcRenderer.invoke('fluxalloy-downloads-clear-cookies-file'),

  getCliOptions: (): Promise<
    { ok: true; payload: YtdlpDownloadOptionsPayload } | { ok: false; error: string }
  > => ipcRenderer.invoke('fluxalloy-downloads-get-cli-options'),

  setCliOptions: (
    patch: YtdlpDownloadOptionsPatch
  ): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke('fluxalloy-downloads-set-cli-options', patch),

  onLog: (listener: (payload: DownloadsLogPayload) => void): (() => void) => {
    const handler = (_event: unknown, raw: unknown): void => {
      if (!isDownloadsLogPayload(raw)) {
        return
      }
      listener(raw)
    }
    ipcRenderer.on(DOWNLOADS_LOG_CHANNEL, handler)
    return (): void => {
      ipcRenderer.removeListener(DOWNLOADS_LOG_CHANNEL, handler)
    }
  }
})
