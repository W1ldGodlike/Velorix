import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { parseAppSessionJson } from '../shared/app-session-parse'
import {
  createDefaultAppSessionJson,
  type AppSessionJsonV1,
  type AppSessionMiniPlayerState
} from '../shared/app-session-contract'

let cached: AppSessionJsonV1 = createDefaultAppSessionJson()
let sessionFilePath: string | null = null

export function configureAppSessionStore(userData: string): void {
  sessionFilePath = join(userData, 'session.json')
  cached = loadAppSessionFromDisk(sessionFilePath)
}

export function getCachedAppSession(): AppSessionJsonV1 {
  return cached
}

export function getCachedMiniPlayerSession(): AppSessionMiniPlayerState {
  return cached.miniPlayer
}

function loadAppSessionFromDisk(filePath: string): AppSessionJsonV1 {
  if (!existsSync(filePath)) {
    return createDefaultAppSessionJson()
  }
  try {
    const raw = JSON.parse(readFileSync(filePath, 'utf8')) as unknown
    return parseAppSessionJson(raw)
  } catch {
    return createDefaultAppSessionJson()
  }
}

export function saveAppSessionToDisk(): void {
  if (sessionFilePath === null) {
    return
  }
  mkdirSync(join(sessionFilePath, '..'), { recursive: true })
  const tmp = `${sessionFilePath}.tmp`
  writeFileSync(tmp, `${JSON.stringify(cached, null, 2)}\n`, 'utf8')
  try {
    renameSync(tmp, sessionFilePath)
  } catch {
    try {
      unlinkSync(tmp)
    } catch {
      /* ignore */
    }
    throw new Error('saveAppSessionToDisk: rename failed')
  }
}

export function patchMiniPlayerSession(patch: Partial<AppSessionMiniPlayerState>): void {
  cached = {
    ...cached,
    miniPlayer: {
      ...cached.miniPlayer,
      ...patch
    }
  }
  saveAppSessionToDisk()
}
