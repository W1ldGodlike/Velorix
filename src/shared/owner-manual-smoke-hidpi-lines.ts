/**
 * §1.1 — строки HiDPI-чеклиста для Support ZIP / owner bundle (канон ru settings).
 */

import ruSettings from '../../locales/ru/settings.json'
import { APP_SETTINGS_HIDPI_CHECKLIST_KEYS } from './app-settings-hidpi-checklist-keys'
import { formatOwnerManualSmokeChecklistSectionLines } from './owner-manual-smoke-checklist-lines'

/** Строки ручного HiDPI-smoke для `ownerManualSmoke:` / копирования владельцу. */
export function formatOwnerManualSmokeHidpiChecklistLines(): string[] {
  return formatOwnerManualSmokeChecklistSectionLines({
    shard: ruSettings as Record<string, string>,
    label: 'owner-manual-smoke-hidpi',
    headerLine: 'owner: HiDPI / масштаб окна 100–200% (не CI)',
    uiLine: 'ui: Настройки → Общие → HiDPI; Help appearance-language-theme',
    introKey: 'appSettingsHidpiManualHint',
    checkIntroKey: 'appSettingsHidpiChecklistIntro',
    checklistKeys: APP_SETTINGS_HIDPI_CHECKLIST_KEYS
  })
}
