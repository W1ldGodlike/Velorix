import type { AppSettingsDialogSection } from '../../../../shared/app-settings-dialog-section'
import type { UiTextKey } from '../../locales/ui-text-strings'

export const APP_SETTINGS_SECTION_HINT_KEYS: Record<AppSettingsDialogSection, UiTextKey> = {
  general: 'appSettingsSectionHintGeneral',
  defaults: 'appSettingsSectionHintDefaults',
  dependencies: 'appSettingsSectionHintDependencies',
  system: 'appSettingsSectionHintSystem',
  hotkeys: 'appSettingsSectionHintHotkeys',
  logs: 'appSettingsSectionHintLogs',
  reset: 'appSettingsSectionHintReset'
}

export const APP_SETTINGS_SECTION_LABEL_KEYS: Record<AppSettingsDialogSection, UiTextKey> = {
  general: 'appSettingsSectionGeneral',
  defaults: 'appSettingsSectionDefaults',
  dependencies: 'appSettingsSectionDependencies',
  system: 'appSettingsSectionSystem',
  hotkeys: 'appSettingsSectionHotkeys',
  logs: 'appSettingsSectionLogs',
  reset: 'appSettingsSectionReset'
}
