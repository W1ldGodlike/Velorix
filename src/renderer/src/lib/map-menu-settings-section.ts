import type { AppSettingsDialogSection } from '../../../shared/app-settings-dialog-section'

import type { SettingsSectionId } from '../stores/app-shell-store'

/** Меню main §4.6 → вкладки full-screen настроек NEON. */
export function mapMenuSettingsSection(section: AppSettingsDialogSection): SettingsSectionId {
  if (section === 'dependencies') {
    return 'processing'
  }
  if (section === 'system' || section === 'reset' || section === 'logs') {
    return 'cache'
  }
  return 'app'
}
