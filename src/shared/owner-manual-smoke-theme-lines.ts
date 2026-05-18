/**
 * §5 — строки визуального theme-smoke для Support ZIP / owner bundle (канон ru settings).
 */

import ruSettings from '../../locales/ru/settings.json'

function t(shard: Record<string, string>, key: string): string {
  const v = shard[key]
  if (typeof v !== 'string' || v.trim().length === 0) {
    throw new Error(`owner-manual-smoke-theme missing key: ${key}`)
  }
  return v
}

/** Строки ручного theme-smoke для `ownerManualSmoke:` / копирования владельцу. */
export function formatOwnerManualSmokeThemeChecklistLines(): string[] {
  const shard = ruSettings as Record<string, string>
  return [
    'owner: Theme / тёмная·светлая·система (не CI)',
    'ui: Настройки → Общие → Тема; меню «Вид → Тема»; Help appearance-language-theme',
    `intro: ${t(shard, 'appSettingsThemeManualHint')}`,
    `check: ${t(shard, 'appSettingsThemeChecklistIntro')}`,
    `  - ${t(shard, 'appSettingsThemeCheckAccent')}`,
    `  - ${t(shard, 'appSettingsThemeCheckFocus')}`,
    `  - ${t(shard, 'appSettingsThemeCheckDisabled')}`,
    `  - ${t(shard, 'appSettingsThemeCheckModals')}`,
    `  - ${t(shard, 'appSettingsThemeCheckWorkflow')}`,
    `  - ${t(shard, 'appSettingsThemeCheckDownloadsPopout')}`,
    `  - ${t(shard, 'appSettingsThemeCheckInspector')}`
  ]
}
