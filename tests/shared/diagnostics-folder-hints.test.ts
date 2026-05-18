import { describe, expect, it } from 'vitest'

import type { DiagnosticsFolderId } from '../../src/shared/diagnostics-contract'
import { getMainApplicationStrings } from '../../src/shared/main-application-locale'

const FOLDER_IDS: DiagnosticsFolderId[] = [
  'userData',
  'logs',
  'ytdlpDownloads',
  'systemTemp',
  'userBin',
  'bundledBin',
  'resources'
]

const HINT_KEYS = {
  userData: 'diagFolderHintUserData',
  logs: 'diagFolderHintLogs',
  ytdlpDownloads: 'diagFolderHintYtdlpDownloads',
  systemTemp: 'diagFolderHintSystemTemp',
  userBin: 'diagFolderHintUserBin',
  bundledBin: 'diagFolderHintBundledBin',
  resources: 'diagFolderHintResources'
} as const satisfies Record<DiagnosticsFolderId, keyof ReturnType<typeof getMainApplicationStrings>>

describe('diagnostics folder hints (main locale)', () => {
  it.each(['ru', 'en'] as const)('%s — non-empty hints for all folders', (locale) => {
    const s = getMainApplicationStrings(locale)
    expect(s.menuOpenFolderHint.length).toBeGreaterThan(10)
    for (const id of FOLDER_IDS) {
      const hint = s[HINT_KEYS[id]]
      expect(hint.length, id).toBeGreaterThan(10)
    }
  })
})
