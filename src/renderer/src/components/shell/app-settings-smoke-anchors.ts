import type { AppSettingsDialogSection } from '../../../../shared/app-settings-dialog-section'
import type { OwnerManualSmokePackagedPlatform } from '../../../../shared/owner-manual-smoke-packaged-section'

export const APP_SETTINGS_OWNER_SMOKE_BUNDLE_ANCHOR = 'app-settings-deps-owner-smoke'
export const APP_SETTINGS_HW_SMOKE_ANCHOR = 'app-settings-deps-hw-smoke'
export const APP_SETTINGS_HIDPI_ANCHOR = 'app-settings-general-hidpi'
export const APP_SETTINGS_WIN_SHELL_ANCHOR = 'app-settings-general-win-shell'

export const APP_SETTINGS_PACKAGED_SMOKE_ANCHOR: Record<OwnerManualSmokePackagedPlatform, string> = {
  win: 'app-settings-deps-packaged-win',
  linux: 'app-settings-deps-packaged-linux',
  macos: 'app-settings-deps-packaged-macos'
}

export type AppSettingsSmokeJumpTarget = {
  section: AppSettingsDialogSection
  anchorId: string
}

export function scrollToSettingsAnchor(anchorId: string): void {
  document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function jumpToAppSettingsSmokeTarget(
  target: AppSettingsSmokeJumpTarget,
  currentSection: AppSettingsDialogSection,
  onSectionChange: (section: AppSettingsDialogSection) => void
): void {
  if (currentSection !== target.section) {
    onSectionChange(target.section)
  }
  window.setTimeout(() => {
    scrollToSettingsAnchor(target.anchorId)
  }, currentSection === target.section ? 0 : 48)
}
