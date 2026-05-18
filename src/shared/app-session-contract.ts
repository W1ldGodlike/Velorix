import type { StoredWindowRect } from './settings-contract'

export const APP_SESSION_JSON_VERSION = 1 as const

export type AppSessionMiniPlayerState = {
  alwaysOnTop: boolean
  bounds: StoredWindowRect | null
}

export type AppSessionJsonV1 = {
  version: typeof APP_SESSION_JSON_VERSION
  miniPlayer: AppSessionMiniPlayerState
}

export type AppSessionJson = AppSessionJsonV1

export function createDefaultAppSessionJson(): AppSessionJsonV1 {
  return {
    version: APP_SESSION_JSON_VERSION,
    miniPlayer: {
      alwaysOnTop: true,
      bounds: null
    }
  }
}
