import type { MiniPlayerSnapshot } from '../shared/mini-player-snapshot-contract'

export type VelorixApiMiniPlayerBlock = {
  miniPlayer: {
    show: () => Promise<void>
    hide: () => Promise<void>
    getSnapshot: () => Promise<MiniPlayerSnapshot>
    setAlwaysOnTop: (enabled: boolean) => Promise<{ ok: true; alwaysOnTop: boolean }>
    focusMain: () => Promise<void>
    onSnapshot: (listener: (snapshot: MiniPlayerSnapshot) => void) => () => void
  }
}
