/**
 * §1.1 — строки HiDPI-чеклиста для Support ZIP / owner bundle (канон ru settings).
 */

import ruSettings from '../../locales/ru/settings.json'
import { APP_SETTINGS_HIDPI_CHECKLIST_KEYS } from './app-settings-visual-smoke-checklists'
import { formatOwnerManualSmokeChecklistSectionLines } from './owner-manual-smoke-checklist-lines'

export type OwnerManualSmokeHidpiLocaleShard = Record<string, string>

/** Строки HiDPI-smoke из shard settings.json (ru/en). */
export function formatOwnerManualSmokeHidpiChecklistLinesFromShard(
  shard: OwnerManualSmokeHidpiLocaleShard
): string[] {
  return formatOwnerManualSmokeChecklistSectionLines({
    shard,
    label: 'owner-manual-smoke-hidpi',
    headerKey: 'ownerManualSmokeHidpiHeader',
    uiKey: 'ownerManualSmokeHidpiUiLine',
    introKey: 'appSettingsHidpiManualHint',
    checkIntroKey: 'appSettingsHidpiChecklistIntro',
    checklistKeys: APP_SETTINGS_HIDPI_CHECKLIST_KEYS
  })
}

/** Строки ручного HiDPI-smoke для `ownerManualSmoke:` / копирования владельцу (канон ru). */
export function formatOwnerManualSmokeHidpiChecklistLines(): string[] {
  return formatOwnerManualSmokeHidpiChecklistLinesFromShard(
    ruSettings as OwnerManualSmokeHidpiLocaleShard
  )
}
