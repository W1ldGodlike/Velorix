import { ipcRenderer } from 'electron'

/** Push IPC без payload — единый subscribe/unsubscribe для preload bridge. */
export function subscribeVoidIpc(channel: string, listener: () => void): () => void {
  const handler = (): void => {
    listener()
  }
  ipcRenderer.on(channel, handler)
  return (): void => {
    ipcRenderer.removeListener(channel, handler)
  }
}
