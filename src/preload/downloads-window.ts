import { contextBridge, ipcRenderer } from 'electron'

const QUEUE_SNAPSHOT_CHANNEL = 'fluxalloy-downloads-state'

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
    ipcRenderer.invoke('fluxalloy-downloads-cancel-run')
})
