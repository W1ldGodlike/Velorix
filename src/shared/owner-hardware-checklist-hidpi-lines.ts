/**
 * §1.1 — строки HiDPI-чеклиста для Support ZIP / owner bundle (канон ru settings).
 */

import ruSettings from './post-purge-manual-smoke/ru/settings.json'
import { APP_SETTINGS_HIDPI_CHECKLIST_KEYS } from './app-settings-visual-smoke-checklists'
import { formatOwnerHardwareChecklistSectionLines } from './owner-hardware-checklist-lines'

export type OwnerHardwareChecklistHidpiLocaleShard = Record<string, string>

/** Строки HiDPI-smoke из shard settings.json (ru/en). */
export function formatOwnerHardwareChecklistHidpiChecklistLinesFromShard(
  shard: OwnerHardwareChecklistHidpiLocaleShard
): string[] {
  return formatOwnerHardwareChecklistSectionLines({
    shard,
    label: 'owner-hardware-checklist-hidpi',
    headerKey: 'ownerHardwareChecklistHidpiHeader',
    uiKey: 'ownerHardwareChecklistHidpiUiLine',
    introKey: 'appSettingsHidpiManualHint',
    checkIntroKey: 'appSettingsHidpiChecklistIntro',
    checklistKeys: APP_SETTINGS_HIDPI_CHECKLIST_KEYS
  })
}

/** Строки ручного HiDPI-smoke для `ownerHardwareChecklist:` / копирования владельцу (канон ru). */
export function formatOwnerHardwareChecklistHidpiChecklistLines(): string[] {
  return formatOwnerHardwareChecklistHidpiChecklistLinesFromShard(
    ruSettings as OwnerHardwareChecklistHidpiLocaleShard
  )
}
