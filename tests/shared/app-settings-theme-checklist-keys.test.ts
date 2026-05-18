import { describe, expect, it } from 'vitest'

import { APP_SETTINGS_THEME_CHECKLIST_KEYS } from '../../src/shared/app-settings-theme-checklist-keys'
import enSettings from '../../locales/en/settings.json'
import ruSettings from '../../locales/ru/settings.json'

describe('app-settings-theme-checklist-keys', () => {
  it.each(['en', 'ru'] as const)('settings shard defines every theme checklist key (%s)', (locale) => {
    const shard = (locale === 'en' ? enSettings : ruSettings) as Record<string, string>
    for (const key of APP_SETTINGS_THEME_CHECKLIST_KEYS) {
      expect(shard[key]?.trim().length ?? 0, key).toBeGreaterThan(0)
    }
  })

  it('has seven visual checks aligned with owner bundle', () => {
    expect(APP_SETTINGS_THEME_CHECKLIST_KEYS).toHaveLength(7)
  })
})
