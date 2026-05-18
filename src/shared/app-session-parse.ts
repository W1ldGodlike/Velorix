import {
  APP_SESSION_JSON_VERSION,
  createDefaultAppSessionJson,
  type AppSessionJsonV1,
  type AppSessionMiniPlayerState
} from './app-session-contract'
import type { StoredWindowRect } from './settings-contract'

function parseBounds(raw: unknown): StoredWindowRect | null {
  if (raw === null || raw === undefined) {
    return null
  }
  if (typeof raw !== 'object' || raw === null) {
    return null
  }
  const o = raw as Record<string, unknown>
  const x = o['x']
  const y = o['y']
  const width = o['width']
  const height = o['height']
  if (
    typeof x === 'number' &&
    typeof y === 'number' &&
    typeof width === 'number' &&
    typeof height === 'number' &&
    Number.isFinite(x) &&
    Number.isFinite(y) &&
    width > 0 &&
    height > 0
  ) {
    return { x, y, width, height }
  }
  return null
}

function parseMiniPlayer(raw: unknown): AppSessionMiniPlayerState {
  const base = createDefaultAppSessionJson().miniPlayer
  if (typeof raw !== 'object' || raw === null) {
    return base
  }
  const o = raw as Record<string, unknown>
  return {
    alwaysOnTop: o['alwaysOnTop'] === false ? false : true,
    bounds: parseBounds(o['bounds'])
  }
}

/** §4.3 — parse `app-data/session.json` (whitelist). */
export function parseAppSessionJson(raw: unknown): AppSessionJsonV1 {
  if (typeof raw !== 'object' || raw === null) {
    return createDefaultAppSessionJson()
  }
  const o = raw as Record<string, unknown>
  if (o['version'] !== APP_SESSION_JSON_VERSION) {
    return createDefaultAppSessionJson()
  }
  return {
    version: APP_SESSION_JSON_VERSION,
    miniPlayer: parseMiniPlayer(o['miniPlayer'])
  }
}
