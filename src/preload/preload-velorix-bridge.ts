import { ipcRenderer } from 'electron'

import { mainWindowIpc as mw } from '../shared/ipc-channels'
import { parseQuitConfirmRequestPayload } from '../shared/quit-confirm-contract'

/** Post PURGE v3: shell, logs, quit confirm only. */
export const velorix = {
  shell: {
    requestClose: (): Promise<void> => ipcRenderer.invoke(mw.shellRequestClose),
    requestMinimize: (): Promise<void> => ipcRenderer.invoke(mw.shellRequestMinimize)
  },
  log: {
    fromRenderer: (payload: unknown): void => {
      ipcRenderer.send(mw.logRenderer, payload)
    }
  },
  quit: {
    onConfirmRequested: (
      listener: (payload: NonNullable<ReturnType<typeof parseQuitConfirmRequestPayload>>) => void
    ): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, raw: unknown): void => {
        const parsed = parseQuitConfirmRequestPayload(raw)
        if (parsed) {
          listener(parsed)
        }
      }
      ipcRenderer.on(mw.quitConfirmRequested, handler)
      return () => {
        ipcRenderer.removeListener(mw.quitConfirmRequested, handler)
      }
    },
    respond: (payload: { requestId: number; confirmed: boolean }): void => {
      ipcRenderer.send(mw.quitConfirmRespond, payload)
    }
  }
}
