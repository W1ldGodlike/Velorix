import { describe, expect, it } from 'vitest'

import { SETTINGS_BACKUP_FORMAT_VERSION } from '../../src/shared/settings-backup-contract'
import {
  buildSettingsBackupFileV1,
  extractSettingsPayloadFromBackupJson
} from '../../src/shared/settings-backup-parse'

describe('settings-backup-parse', () => {
  it('extractSettingsPayloadFromBackupJson reads wrapped export', () => {
    const file = buildSettingsBackupFileV1({ theme: 'dark', uiLocale: 'ru' })
    const payload = extractSettingsPayloadFromBackupJson(file)
    expect(payload).toEqual({ theme: 'dark', uiLocale: 'ru' })
  })

  it('extractSettingsPayloadFromBackupJson reads plain settings fragment', () => {
    const payload = extractSettingsPayloadFromBackupJson({
      theme: 'light',
      ffmpegExportEncodePreset: 'quality'
    })
    expect(payload?.['theme']).toBe('light')
  })

  it('rejects unknown format version', () => {
    const payload = extractSettingsPayloadFromBackupJson({
      velorixSettingsBackup: true,
      formatVersion: SETTINGS_BACKUP_FORMAT_VERSION + 1,
      settings: { theme: 'dark' }
    })
    expect(payload).toBeNull()
  })
})
