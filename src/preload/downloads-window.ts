import { contextBridge, ipcRenderer } from 'electron'

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
    ipcRenderer.invoke('fluxalloy-downloads-move', id, direction)
})
