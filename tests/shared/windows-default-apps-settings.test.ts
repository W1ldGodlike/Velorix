import { describe, expect, it } from 'vitest'

import { WINDOWS_DEFAULT_APPS_SETTINGS_URI } from '../../src/shared/windows-default-apps-settings'

describe('windows-default-apps-settings §14', () => {
  it('uses ms-settings default apps URI', () => {
    expect(WINDOWS_DEFAULT_APPS_SETTINGS_URI).toBe('ms-settings:defaultapps')
  })
})
