import type { AppSettings } from '../../src/shared/settings-contract'

/** Минимальные `AppSettings` для main/resolve unit-тестов. */
export function createAppSettingsBase(overrides: Partial<AppSettings> = {}): AppSettings {
  return {
    uiLocale: 'ru',
    theme: 'dark',
    ...overrides
  }
}
