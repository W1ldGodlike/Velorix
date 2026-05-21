/**
 * §4.3 — ручной smoke Mini Player (не CI UI).
 * Канон: locales/ru/mini-player-manual-smoke.json
 */

import ruMiniPlayerManualSmoke from '../../locales/ru/mini-player-manual-smoke.json'
import { buildMiniPlayerManualSmokeChecklistFromLocaleShard } from './mini-player-manual-smoke-checklist-build'
import { formatPackagedManualSmokeChecklistLines } from './packaged-manual-smoke-checklist-format'

export { buildMiniPlayerManualSmokeChecklistFromLocaleShard } from './mini-player-manual-smoke-checklist-build'

export const MINI_PLAYER_MANUAL_SMOKE_CHECKLIST =
  buildMiniPlayerManualSmokeChecklistFromLocaleShard(
    ruMiniPlayerManualSmoke as Record<string, string>
  )

export function formatMiniPlayerManualSmokeChecklistLines(): string[] {
  return formatPackagedManualSmokeChecklistLines(MINI_PLAYER_MANUAL_SMOKE_CHECKLIST, {
    ownerLine: 'ручной smoke Mini Player §4.3 (owner, не CI UI)',
    automatedLine: 'Vitest mini-player-snapshot-build / main-window-focus',
    docLine: 'Help/ru/owner-manual-smoke.md',
    uiLine: 'Сервис → Мини-плеер; Настройки → Owner smoke'
  })
}
