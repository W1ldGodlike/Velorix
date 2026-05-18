import { describe, expect, it } from 'vitest'

import {
  APP_SETTINGS_DIALOG_SECTIONS,
  DEFAULT_APP_SETTINGS_DIALOG_SECTION,
  parseAppSettingsDialogSection
} from '../../src/shared/app-settings-dialog-section'

describe('app-settings-dialog-section', () => {
  it('parses known section ids', () => {
    for (const id of APP_SETTINGS_DIALOG_SECTIONS) {
      expect(parseAppSettingsDialogSection(id)).toBe(id)
    }
  })

  it('rejects unknown values', () => {
    expect(parseAppSettingsDialogSection('unknown')).toBeUndefined()
    expect(parseAppSettingsDialogSection(null)).toBeUndefined()
  })

  it('default section is general', () => {
    expect(DEFAULT_APP_SETTINGS_DIALOG_SECTION).toBe('general')
  })
})
