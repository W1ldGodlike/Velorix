/**
 * §3 — ручной smoke packaged macOS (не CI UI).
 * Канон: locales/ru/macos-packaged-manual-smoke.json + docs/RELEASE.md §4.2.
 */

import ruMacosPackagedManualSmoke from '../../locales/ru/macos-packaged-manual-smoke.json'
import { buildMacosPackagedManualSmokeChecklistFromLocaleShard } from './macos-packaged-manual-smoke-checklist-build'
import { formatPackagedManualSmokeChecklistLines } from './packaged-manual-smoke-checklist-format'

export {
  buildMacosPackagedManualSmokeChecklistFromLocaleShard
} from './macos-packaged-manual-smoke-checklist-build'

export const MACOS_PACKAGED_MANUAL_SMOKE_CHECKLIST =
  buildMacosPackagedManualSmokeChecklistFromLocaleShard(
    ruMacosPackagedManualSmoke as Record<string, string>
  )

export function formatMacosPackagedManualSmokeChecklistLines(): string[] {
  return formatPackagedManualSmokeChecklistLines(MACOS_PACKAGED_MANUAL_SMOKE_CHECKLIST, {
    ownerLine: 'ручной smoke packaged macOS (FluxAlloy.app), не автоматизируется в CI UI',
    automatedLine: 'npm run verify:mac-unpacked',
    docLine: 'docs/RELEASE.md §4.2',
    uiLine: 'Настройки → Зависимости → Ручной smoke macOS (pack:mac:dir)'
  })
}
