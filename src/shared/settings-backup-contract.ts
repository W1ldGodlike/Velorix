import type { AppSettings } from './settings-contract'

/** Версия обёртки экспорта; при импорте более новой — отказ. */
export const SETTINGS_BACKUP_FORMAT_VERSION = 1 as const

export type SettingsBackupFormatVersion = typeof SETTINGS_BACKUP_FORMAT_VERSION

/** Единый JSON экспорта из меню «Сервис». */
export type SettingsBackupFileV1 = {
  velorixSettingsBackup: true
  formatVersion: SettingsBackupFormatVersion
  /** ISO-8601 */
  exportedAt: string
  settings: AppSettings
}
