/**
 * Ключи locales (settings.json) для визуального HiDPI-smoke (§1.1 / §5).
 * Канон для AppSettingsHidpiStatusPanel, owner bundle и проверок локалей.
 */

export const APP_SETTINGS_HIDPI_CHECKLIST_KEYS = [
  'appSettingsHidpiCheckEditor',
  'appSettingsHidpiCheckDownloads',
  'appSettingsHidpiCheckModals',
  'appSettingsHidpiCheckStatusbar'
] as const

export type AppSettingsHidpiChecklistKey = (typeof APP_SETTINGS_HIDPI_CHECKLIST_KEYS)[number]
