/**
 * §3 — ручной smoke packaged macOS (не CI UI).
 * Канон: locales/ru/macos-packaged-manual-smoke.json + docs/RELEASE.md §4.2.
 */

import ruMacosPackagedManualSmoke from '../../locales/ru/macos-packaged-manual-smoke.json'
import { formatPackagedManualSmokeChecklistLinesFromLocaleShard } from './packaged-manual-smoke-locale-lines'
import { buildMacosPackagedManualSmokeChecklistFromLocaleShard } from './macos-packaged-manual-smoke-checklist-build'

export { buildMacosPackagedManualSmokeChecklistFromLocaleShard } from './macos-packaged-manual-smoke-checklist-build'

export const MACOS_PACKAGED_MANUAL_SMOKE_CHECKLIST =
  buildMacosPackagedManualSmokeChecklistFromLocaleShard(
    ruMacosPackagedManualSmoke as Record<string, string>
  )

export function formatMacosPackagedManualSmokeChecklistLinesFromShard(
  shard: Record<string, string>
): string[] {
  return formatPackagedManualSmokeChecklistLinesFromLocaleShard(
    shard,
    'macosPackagedSmoke',
    buildMacosPackagedManualSmokeChecklistFromLocaleShard(shard)
  )
}

export function formatMacosPackagedManualSmokeChecklistLines(): string[] {
  return formatMacosPackagedManualSmokeChecklistLinesFromShard(
    ruMacosPackagedManualSmoke as Record<string, string>
  )
}
