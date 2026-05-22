import {
  SETTINGS_BACKUP_FORMAT_VERSION,
  type SettingsBackupFileV1
} from './settings-backup-contract'

/**
 * Извлекает объект `settings` из JSON файла экспорта или «голого» settings.json.
 * Гидратация — в main (`hydrateAppSettingsFromPartial`).
 */
export function extractSettingsPayloadFromBackupJson(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const record = raw as Record<string, unknown>
  if (record['velorixSettingsBackup'] === true) {
    const version =
      typeof record['formatVersion'] === 'number'
        ? record['formatVersion']
        : SETTINGS_BACKUP_FORMAT_VERSION
    if (version > SETTINGS_BACKUP_FORMAT_VERSION) {
      return null
    }
    const settings = record['settings']
    if (settings && typeof settings === 'object' && !Array.isArray(settings)) {
      return settings as Record<string, unknown>
    }
    return null
  }
  if (
    'theme' in record ||
    'uiLocale' in record ||
    'windowBounds' in record ||
    'ffmpegExportEncodePreset' in record ||
    'ytdlpDownloadDirectory' in record
  ) {
    return record
  }
  return null
}

export function buildSettingsBackupFileV1(
  settings: SettingsBackupFileV1['settings']
): SettingsBackupFileV1 {
  return {
    velorixSettingsBackup: true,
    formatVersion: SETTINGS_BACKUP_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    settings
  }
}
