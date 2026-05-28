/**
 * §3 — ручная проверка packaged Linux (не CI UI).
 * Канон: locales/ru/linux-packaged-manual-smoke.json + docs/RELEASE.md §4.1.
 */

import ruLinuxPackagedManualSmoke from './post-purge-manual-smoke/ru/linux-packaged-manual-smoke.json'
import { formatPackagedManualSmokeChecklistLinesFromLocaleShard } from './packaged-manual-smoke-locale-lines'
import { buildLinuxPackagedManualSmokeChecklistFromLocaleShard } from './linux-packaged-manual-smoke-checklist-build'

export { buildLinuxPackagedManualSmokeChecklistFromLocaleShard } from './linux-packaged-manual-smoke-checklist-build'

export const LINUX_PACKAGED_MANUAL_SMOKE_CHECKLIST =
  buildLinuxPackagedManualSmokeChecklistFromLocaleShard(
    ruLinuxPackagedManualSmoke as Record<string, string>
  )

export function formatLinuxPackagedManualSmokeChecklistLinesFromShard(
  shard: Record<string, string>
): string[] {
  return formatPackagedManualSmokeChecklistLinesFromLocaleShard(
    shard,
    'linuxPackagedSmoke',
    buildLinuxPackagedManualSmokeChecklistFromLocaleShard(shard)
  )
}

export function formatLinuxPackagedManualSmokeChecklistLines(): string[] {
  return formatLinuxPackagedManualSmokeChecklistLinesFromShard(
    ruLinuxPackagedManualSmoke as Record<string, string>
  )
}
