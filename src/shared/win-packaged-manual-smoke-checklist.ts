/**
 * §3 — ручная проверка packaged Windows (не CI UI).
 * Канон: locales/ru/win-packaged-manual-smoke.json + docs/RELEASE.md §4.
 */

import ruWinPackagedManualSmoke from '../../locales/ru/win-packaged-manual-smoke.json'
import { formatPackagedManualSmokeChecklistLinesFromLocaleShard } from './packaged-manual-smoke-locale-lines'
import { buildWinPackagedManualSmokeChecklistFromLocaleShard } from './win-packaged-manual-smoke-checklist-build'

export { buildWinPackagedManualSmokeChecklistFromLocaleShard } from './win-packaged-manual-smoke-checklist-build'

export { formatFfmpegHwManualSmokeChecklistPlainText as formatWinPackagedManualSmokeChecklistPlainText } from './ffmpeg-hw-manual-smoke-checklist-build'

export const WIN_PACKAGED_MANUAL_SMOKE_CHECKLIST =
  buildWinPackagedManualSmokeChecklistFromLocaleShard(
    ruWinPackagedManualSmoke as Record<string, string>
  )

/** Строки для Support ZIP (winPackagedSmoke:) и копирования владельцу (канон ru). */
export function formatWinPackagedManualSmokeChecklistLinesFromShard(
  shard: Record<string, string>
): string[] {
  return formatPackagedManualSmokeChecklistLinesFromLocaleShard(
    shard,
    'winPackagedSmoke',
    buildWinPackagedManualSmokeChecklistFromLocaleShard(shard)
  )
}

export function formatWinPackagedManualSmokeChecklistLines(): string[] {
  return formatWinPackagedManualSmokeChecklistLinesFromShard(
    ruWinPackagedManualSmoke as Record<string, string>
  )
}
