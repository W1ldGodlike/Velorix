/** §4.6 — вкладки единого окна настроек (main push + renderer). */
export const APP_SETTINGS_DIALOG_SECTIONS = [
  'general',
  'defaults',
  'dependencies',
  'system',
  'hotkeys',
  'logs',
  'reset'
] as const

export type AppSettingsDialogSection = (typeof APP_SETTINGS_DIALOG_SECTIONS)[number]

export const DEFAULT_APP_SETTINGS_DIALOG_SECTION: AppSettingsDialogSection = 'general'

export function parseAppSettingsDialogSection(raw: unknown): AppSettingsDialogSection | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  return APP_SETTINGS_DIALOG_SECTIONS.includes(raw as AppSettingsDialogSection)
    ? (raw as AppSettingsDialogSection)
    : undefined
}
