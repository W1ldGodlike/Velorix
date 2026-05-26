/**
 * Ключи locales (settings.json) для визуального theme-smoke (§5).
 * NB: имя `appSettingsThemeCheckDownloadsPopout` оставлено legacy-совместимым,
 * но в copy уже означает shell-surface, а не целевой pop-out UX.
 * Канон для AppSettingsThemePanel, owner bundle и проверок локалей.
 */

export const APP_SETTINGS_THEME_CHECKLIST_KEYS = [
  'appSettingsThemeCheckAccent',
  'appSettingsThemeCheckFocus',
  'appSettingsThemeCheckDisabled',
  'appSettingsThemeCheckModals',
  'appSettingsThemeCheckWorkflow',
  'appSettingsThemeCheckDownloadsPopout',
  'appSettingsThemeCheckInspector'
] as const

export type AppSettingsThemeChecklistKey = (typeof APP_SETTINGS_THEME_CHECKLIST_KEYS)[number]
