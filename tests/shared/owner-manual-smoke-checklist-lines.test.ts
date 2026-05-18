import { describe, expect, it } from 'vitest'

import { APP_SETTINGS_HIDPI_CHECKLIST_KEYS } from '../../src/shared/app-settings-hidpi-checklist-keys'
import { APP_SETTINGS_THEME_CHECKLIST_KEYS } from '../../src/shared/app-settings-theme-checklist-keys'
import { formatOwnerManualSmokeChecklistSectionLines } from '../../src/shared/owner-manual-smoke-checklist-lines'
import ruSettings from '../../locales/ru/settings.json'

describe('owner-manual-smoke-checklist-lines', () => {
  it('formats theme section with one line per checklist key', () => {
    const lines = formatOwnerManualSmokeChecklistSectionLines({
      shard: ruSettings as Record<string, string>,
      label: 'test-theme',
      headerKey: 'ownerManualSmokeThemeHeader',
      uiKey: 'ownerManualSmokeThemeUiLine',
      introKey: 'appSettingsThemeManualHint',
      checkIntroKey: 'appSettingsThemeChecklistIntro',
      checklistKeys: APP_SETTINGS_THEME_CHECKLIST_KEYS
    })
    expect(lines[0]).toContain('Theme')
    expect(lines.filter((l) => l.startsWith('  - '))).toHaveLength(
      APP_SETTINGS_THEME_CHECKLIST_KEYS.length
    )
  })

  it('formats hidpi section with one line per checklist key', () => {
    const lines = formatOwnerManualSmokeChecklistSectionLines({
      shard: ruSettings as Record<string, string>,
      label: 'test-hidpi',
      headerKey: 'ownerManualSmokeHidpiHeader',
      uiKey: 'ownerManualSmokeHidpiUiLine',
      introKey: 'appSettingsHidpiManualHint',
      checkIntroKey: 'appSettingsHidpiChecklistIntro',
      checklistKeys: APP_SETTINGS_HIDPI_CHECKLIST_KEYS
    })
    expect(lines.filter((l) => l.startsWith('  - '))).toHaveLength(
      APP_SETTINGS_HIDPI_CHECKLIST_KEYS.length
    )
  })
})
