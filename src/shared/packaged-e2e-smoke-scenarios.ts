/**
 * §21 — реестр сценариев packaged e2e (ручной owner-smoke vs CI headless).
 * Канон шагов: `packaged-manual-smoke-step-ids.ts` (`PACKAGED_MANUAL_SMOKE_STEPS`).
 */

import { PACKAGED_MANUAL_SMOKE_STEPS } from './packaged-manual-smoke-step-ids'
import {
  PACKAGED_E2E_CI_SMOKE_SCRIPT_EXPANSIONS,
  PACKAGED_E2E_SMOKE_REGISTRY,
  type PackagedE2eAutomationKind,
  type PackagedE2eSmokeScenario
} from './packaged-e2e-smoke-registry'

export type { PackagedE2eAutomationKind, PackagedE2eSmokeScenario }

export const PACKAGED_E2E_SMOKE_SCENARIOS: readonly PackagedE2eSmokeScenario[] =
  PACKAGED_E2E_SMOKE_REGISTRY

/** Уникальные npm-скрипты из реестра (для CI guard и диагностики). */
export const PACKAGED_E2E_CI_SMOKE_SCRIPTS: readonly string[] = [
  ...new Set(
    PACKAGED_E2E_SMOKE_SCENARIOS.map((s) => s.ciSmokeScript).filter(
      (script): script is string => script !== null
    )
  )
]

export { PACKAGED_E2E_CI_SMOKE_SCRIPT_EXPANSIONS }

export function expandPackagedE2eCiSmokeScriptsForWorkflow(
  scripts: readonly string[] = PACKAGED_E2E_CI_SMOKE_SCRIPTS
): string[] {
  const out: string[] = []
  for (const script of scripts) {
    const expanded = PACKAGED_E2E_CI_SMOKE_SCRIPT_EXPANSIONS[script]
    if (expanded) {
      out.push(...expanded)
    } else {
      out.push(script)
    }
  }
  return [...new Set(out)]
}

const manualIds = PACKAGED_MANUAL_SMOKE_STEPS.map((s) => s.id)
const registryIds = PACKAGED_E2E_SMOKE_SCENARIOS.map((s) => s.stepId)
if (registryIds.join('|') !== manualIds.join('|')) {
  throw new Error(
    'packaged-e2e-smoke-registry out of sync with PACKAGED_MANUAL_SMOKE_STEPS (run check:packaged-e2e-scenarios-registry)'
  )
}

function formatPackagedE2eStepDiagnosticLine(scenario: PackagedE2eSmokeScenario): string {
  const script = scenario.ciSmokeScript ? ` script=${scenario.ciSmokeScript}` : ''
  return `e2e ${scenario.stepId}: ${scenario.automation}${script}`
}

/** Per-step lines for Support ZIP `releaseSmoke:` / owner bundle §21 appendix. */
export function formatPackagedE2ePerStepDiagnosticLines(): string[] {
  return PACKAGED_E2E_SMOKE_SCENARIOS.map(formatPackagedE2eStepDiagnosticLine)
}

/** stepId для одного вида automation (§21 registry). */
export function listPackagedE2eStepIdsByAutomation(
  automation: PackagedE2eAutomationKind
): string[] {
  return PACKAGED_E2E_SMOKE_SCENARIOS.filter((s) => s.automation === automation).map(
    (s) => s.stepId
  )
}

/** Канон stepId по automation (Playwright §21 roadmap, guards, UI). */
export const PACKAGED_E2E_CI_HEADLESS_STEP_IDS: readonly string[] =
  listPackagedE2eStepIdsByAutomation('ci-headless')
export const PACKAGED_E2E_PLANNED_GUI_STEP_IDS: readonly string[] =
  listPackagedE2eStepIdsByAutomation('planned-gui-e2e')
export const PACKAGED_E2E_MANUAL_OWNER_STEP_IDS: readonly string[] =
  listPackagedE2eStepIdsByAutomation('manual-owner')

export function formatPackagedE2eSmokeDiagnosticLines(): string[] {
  const headless = PACKAGED_E2E_CI_HEADLESS_STEP_IDS
  const planned = PACKAGED_E2E_PLANNED_GUI_STEP_IDS
  const manual = PACKAGED_E2E_MANUAL_OWNER_STEP_IDS
  return [
    `§21 packaged e2e registry: ${PACKAGED_E2E_SMOKE_SCENARIOS.length} steps (aligned with packaged manual smoke)`,
    `ci-headless (${headless.length}): ${headless.join(', ')}`,
    `planned-gui-e2e (${planned.length}): ${planned.join(', ')}`,
    `manual-owner (${manual.length}): ${manual.join(', ')}`,
    `ciSmokeScript npm (${PACKAGED_E2E_CI_SMOKE_SCRIPTS.length}): ${PACKAGED_E2E_CI_SMOKE_SCRIPTS.join(', ')}`,
    ...formatPackagedE2ePerStepDiagnosticLines(),
    'manual owner-smoke: Help/owner-manual-smoke.md + Settings copy (not automated GUI yet)',
    `planned GUI e2e scope: ${PACKAGED_E2E_PLANNED_GUI_STEP_IDS.join(', ')} (Playwright later; ytdlp/export have partial CLI smokes)`,
    'Help crosslinks: npm run check:help-workflow-smoke-crosslinks (28 articles ↔ owner/packaged §21)',
    'check: npm run check:packaged-e2e-scenarios-registry'
  ]
}
