import { ipcRenderer } from 'electron'

import type { MiniPlayerSnapshot } from '../shared/mini-player-snapshot-contract'
import { MINI_PLAYER_SNAPSHOT_PUSH_CHANNEL } from '../shared/mini-player-snapshot-contract'
import { mainWindowIpc as mw } from '../shared/ipc-channels'

/** §4.3 — компактное окно прогресса (`#mini-player`). */
export const fluxalloyMiniPlayer = {
  show: (): Promise<void> => ipcRenderer.invoke(mw.miniPlayerShow),
  hide: (): Promise<void> => ipcRenderer.invoke(mw.miniPlayerHide),
  getSnapshot: (): Promise<MiniPlayerSnapshot> => ipcRenderer.invoke(mw.miniPlayerGetSnapshot),
  setAlwaysOnTop: (enabled: boolean): Promise<{ ok: true; alwaysOnTop: boolean }> =>
    ipcRenderer.invoke(mw.miniPlayerSetAlwaysOnTop, enabled),
  focusMain: (): Promise<void> => ipcRenderer.invoke(mw.miniPlayerFocusMain),
  onSnapshot: (listener: (snapshot: MiniPlayerSnapshot) => void): (() => void) => {
    const handler = (_event: unknown, raw: unknown): void => {
      if (typeof raw === 'object' && raw !== null) {
        listener(raw as MiniPlayerSnapshot)
      }
    }
    ipcRenderer.on(MINI_PLAYER_SNAPSHOT_PUSH_CHANNEL, handler)
    return (): void => {
      ipcRenderer.removeListener(MINI_PLAYER_SNAPSHOT_PUSH_CHANNEL, handler)
    }
  }
}
