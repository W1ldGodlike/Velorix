/**
 * Preload → renderer contract (post UI PURGE v3).
 */
import type { ElectronAPI } from '@electron-toolkit/preload'

import type { QuitConfirmRequestPayload } from '../shared/quit-confirm-contract'

export interface VelorixApi {
  shell: {
    requestClose: () => Promise<void>
    requestMinimize: () => Promise<void>
  }
  log: {
    fromRenderer: (payload: unknown) => void
  }
  quit: {
    onConfirmRequested: (listener: (payload: QuitConfirmRequestPayload) => void) => () => void
    respond: (payload: { requestId: number; confirmed: boolean }) => void
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    velorix: VelorixApi
  }
}
