import { describe, expect, it } from 'vitest'

import {
  APP_SETTINGS_HIDPI_CHECKLIST_KEYS,
  APP_SETTINGS_THEME_CHECKLIST_KEYS
} from '../../src/shared/app-settings-visual-smoke-checklists'

describe('app-settings-visual-smoke-checklists', () => {
  it('re-exports theme and hidpi checklist registries', () => {
    expect(APP_SETTINGS_THEME_CHECKLIST_KEYS).toHaveLength(7)
    expect(APP_SETTINGS_HIDPI_CHECKLIST_KEYS).toHaveLength(4)
  })
})
