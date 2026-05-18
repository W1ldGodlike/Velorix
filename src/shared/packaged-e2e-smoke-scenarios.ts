/**
 * §21 — реестр сценариев packaged e2e (ручной owner-smoke vs CI headless).
 * Канон шагов: `packaged-manual-smoke-step-ids.ts` (`PACKAGED_MANUAL_SMOKE_STEPS`).
 */

import { PACKAGED_MANUAL_SMOKE_STEPS } from './packaged-manual-smoke-step-ids'
import {
  PACKAGED_E2E_SMOKE_REGISTRY,
  type PackagedE2eAutomationKind,
  type PackagedE2eSmokeScenario
} from './packaged-e2e-smoke-registry'

export type { PackagedE2eAutomationKind, PackagedE2eSmokeScenario }

export const PACKAGED_E2E_SMOKE_SCENARIOS: readonly PackagedE2eSmokeScenario[] =
  PACKAGED_E2E_SMOKE_REGISTRY

const manualIds = PACKAGED_MANUAL_SMOKE_STEPS.map((s) => s.id)
const registryIds = PACKAGED_E2E_SMOKE_SCENARIOS.map((s) => s.stepId)
if (registryIds.join('|') !== manualIds.join('|')) {
  throw new Error(
    'packaged-e2e-smoke-registry out of sync with PACKAGED_MANUAL_SMOKE_STEPS (run check:packaged-e2e-scenarios-registry)'
  )
}

export function formatPackagedE2eSmokeDiagnosticLines(): string[] {
  const headless = PACKAGED_E2E_SMOKE_SCENARIOS.filter((s) => s.automation === 'ci-headless')
  const planned = PACKAGED_E2E_SMOKE_SCENARIOS.filter((s) => s.automation === 'planned-gui-e2e')
  const manual = PACKAGED_E2E_SMOKE_SCENARIOS.filter((s) => s.automation === 'manual-owner')
  return [
    `§21 packaged e2e registry: ${PACKAGED_E2E_SMOKE_SCENARIOS.length} steps (aligned with packaged manual smoke)`,
    `ci-headless (${headless.length}): ${headless.map((s) => s.stepId).join(', ')}`,
    `planned-gui-e2e (${planned.length}): ${planned.map((s) => s.stepId).join(', ')}`,
    `manual-owner (${manual.length}): ${manual.map((s) => s.stepId).join(', ')}`,
    'manual owner-smoke: Help/owner-manual-smoke.md + Settings copy (not automated GUI yet)',
    'check: npm run check:packaged-e2e-scenarios-registry'
  ]
}
