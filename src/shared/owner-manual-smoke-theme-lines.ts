/**
 * §5 — строки визуального theme-smoke для Support ZIP / owner bundle (канон ru settings).
 */

import ruSettings from '../../locales/ru/settings.json'
import { APP_SETTINGS_THEME_CHECKLIST_KEYS } from './app-settings-theme-checklist-keys'
import { formatOwnerManualSmokeChecklistSectionLines } from './owner-manual-smoke-checklist-lines'

/** Строки ручного theme-smoke для `ownerManualSmoke:` / копирования владельцу. */
export function formatOwnerManualSmokeThemeChecklistLines(): string[] {
  return formatOwnerManualSmokeChecklistSectionLines({
    shard: ruSettings as Record<string, string>,
    label: 'owner-manual-smoke-theme',
    headerLine: 'owner: Theme / тёмная·светлая·система (не CI)',
    uiLine: 'ui: Настройки → Общие → Тема; меню «Вид → Тема»; Help appearance-language-theme',
    introKey: 'appSettingsThemeManualHint',
    checkIntroKey: 'appSettingsThemeChecklistIntro',
    checklistKeys: APP_SETTINGS_THEME_CHECKLIST_KEYS
  })
}
