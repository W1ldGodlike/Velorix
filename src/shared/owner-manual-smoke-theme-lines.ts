/**
 * §5 — строки визуального theme-smoke для Support ZIP / owner bundle (канон ru settings).
 */

import ruSettings from '../../locales/ru/settings.json'
import { APP_SETTINGS_THEME_CHECKLIST_KEYS } from './app-settings-visual-smoke-checklists'
import { formatOwnerManualSmokeChecklistSectionLines } from './owner-manual-smoke-checklist-lines'

export type OwnerManualSmokeThemeLocaleShard = Record<string, string>

/** Строки theme-smoke из shard settings.json (ru/en). */
export function formatOwnerManualSmokeThemeChecklistLinesFromShard(
  shard: OwnerManualSmokeThemeLocaleShard
): string[] {
  return formatOwnerManualSmokeChecklistSectionLines({
    shard,
    label: 'owner-manual-smoke-theme',
    headerKey: 'ownerManualSmokeThemeHeader',
    uiKey: 'ownerManualSmokeThemeUiLine',
    introKey: 'appSettingsThemeManualHint',
    checkIntroKey: 'appSettingsThemeChecklistIntro',
    checklistKeys: APP_SETTINGS_THEME_CHECKLIST_KEYS
  })
}

/** Строки ручного theme-smoke для `ownerManualSmoke:` / копирования владельцу (канон ru). */
export function formatOwnerManualSmokeThemeChecklistLines(): string[] {
  return formatOwnerManualSmokeThemeChecklistLinesFromShard(
    ruSettings as OwnerManualSmokeThemeLocaleShard
  )
}
