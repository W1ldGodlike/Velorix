/**
 * Ключи locales (settings.json) для визуального theme-smoke (§5).
 * Ключ `appSettingsThemeCheckDownloadsShell` — поверхность «Загрузки» в shell (§5 smoke).
 * Канон для owner bundle, help и проверок локалей single-NEON UI.
 */

export const APP_SETTINGS_THEME_CHECKLIST_KEYS = [
  'appSettingsThemeCheckAccent',
  'appSettingsThemeCheckFocus',
  'appSettingsThemeCheckDisabled',
  'appSettingsThemeCheckModals',
  'appSettingsThemeCheckWorkflow',
  'appSettingsThemeCheckDownloadsShell',
  'appSettingsThemeCheckInspector'
] as const

export type AppSettingsThemeChecklistKey = (typeof APP_SETTINGS_THEME_CHECKLIST_KEYS)[number]
