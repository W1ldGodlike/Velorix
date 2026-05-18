/**
 * §1.1 — строки HiDPI-чеклиста для Support ZIP / owner bundle (канон ru settings).
 */

import ruSettings from '../../locales/ru/settings.json'

function t(shard: Record<string, string>, key: string): string {
  const v = shard[key]
  if (typeof v !== 'string' || v.trim().length === 0) {
    throw new Error(`owner-manual-smoke-hidpi missing key: ${key}`)
  }
  return v
}

/** Строки ручного HiDPI-smoke для `ownerManualSmoke:` / копирования владельцу. */
export function formatOwnerManualSmokeHidpiChecklistLines(): string[] {
  const shard = ruSettings as Record<string, string>
  return [
    'owner: HiDPI / масштаб окна 100–200% (не CI)',
    'ui: Настройки → Общие → HiDPI; Help appearance-language-theme',
    `intro: ${t(shard, 'appSettingsHidpiManualHint')}`,
    `check: ${t(shard, 'appSettingsHidpiChecklistIntro')}`,
    `  - ${t(shard, 'appSettingsHidpiCheckEditor')}`,
    `  - ${t(shard, 'appSettingsHidpiCheckDownloads')}`,
    `  - ${t(shard, 'appSettingsHidpiCheckModals')}`,
    `  - ${t(shard, 'appSettingsHidpiCheckStatusbar')}`
  ]
}
