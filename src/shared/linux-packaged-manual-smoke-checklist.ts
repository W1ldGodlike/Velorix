/**
 * §3 — ручной smoke packaged Linux (не CI UI).
 * Канон: locales/ru/linux-packaged-manual-smoke.json + docs/RELEASE.md §4.1.
 */

import ruLinuxPackagedManualSmoke from '../../locales/ru/linux-packaged-manual-smoke.json'
import { buildLinuxPackagedManualSmokeChecklistFromLocaleShard } from './linux-packaged-manual-smoke-checklist-build'
import { formatPackagedManualSmokeChecklistLines } from './packaged-manual-smoke-checklist-format'

export { buildLinuxPackagedManualSmokeChecklistFromLocaleShard } from './linux-packaged-manual-smoke-checklist-build'

export const LINUX_PACKAGED_MANUAL_SMOKE_CHECKLIST =
  buildLinuxPackagedManualSmokeChecklistFromLocaleShard(
    ruLinuxPackagedManualSmoke as Record<string, string>
  )

export function formatLinuxPackagedManualSmokeChecklistLines(): string[] {
  return formatPackagedManualSmokeChecklistLines(LINUX_PACKAGED_MANUAL_SMOKE_CHECKLIST, {
    ownerLine: 'ручной smoke packaged Linux (dist/linux-unpacked), не автоматизируется в CI UI',
    automatedLine: 'npm run verify:linux-unpacked',
    docLine: 'docs/RELEASE.md §4.1',
    uiLine: 'Настройки → Зависимости → Ручной smoke Linux (pack:linux:dir)'
  })
}
