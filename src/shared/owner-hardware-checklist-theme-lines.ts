/**
 * §5 — строки визуального theme-smoke для Support ZIP / owner bundle (канон ru settings).
 */

import ruSettings from '../../locales/ru/settings.json'
import { APP_SETTINGS_THEME_CHECKLIST_KEYS } from './app-settings-visual-smoke-checklists'
import { formatOwnerHardwareChecklistSectionLines } from './owner-hardware-checklist-lines'

export type OwnerHardwareChecklistThemeLocaleShard = Record<string, string>

/** Строки theme-smoke из shard settings.json (ru/en). */
export function formatOwnerHardwareChecklistThemeChecklistLinesFromShard(
  shard: OwnerHardwareChecklistThemeLocaleShard
): string[] {
  return formatOwnerHardwareChecklistSectionLines({
    shard,
    label: 'owner-hardware-checklist-theme',
    headerKey: 'ownerHardwareChecklistThemeHeader',
    uiKey: 'ownerHardwareChecklistThemeUiLine',
    introKey: 'appSettingsThemeManualHint',
    checkIntroKey: 'appSettingsThemeChecklistIntro',
    checklistKeys: APP_SETTINGS_THEME_CHECKLIST_KEYS
  })
}

/** Строки ручного theme-smoke для `ownerHardwareChecklist:` / копирования владельцу (канон ru). */
export function formatOwnerHardwareChecklistThemeChecklistLines(): string[] {
  return formatOwnerHardwareChecklistThemeChecklistLinesFromShard(
    ruSettings as OwnerHardwareChecklistThemeLocaleShard
  )
}
