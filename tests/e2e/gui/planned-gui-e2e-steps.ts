/**
 * §21 deferred Playwright GUI e2e — canonical planned step ids (runner not wired).
 * Re-export only; Vitest locks order against `PACKAGED_E2E_SMOKE_REGISTRY`.
 */
import {
  PACKAGED_E2E_SMOKE_REGISTRY,
  type PackagedE2eSmokeScenario
} from '../../../src/shared/packaged-e2e-smoke-registry'

export { PACKAGED_E2E_PLANNED_GUI_STEP_IDS as PLANNED_GUI_E2E_STEP_IDS } from '../../../src/shared/packaged-e2e-smoke-scenarios'

/** Registry rows for planned-gui-e2e (future Playwright spec file names / notes). */
export const PLANNED_GUI_E2E_SCENARIOS: readonly PackagedE2eSmokeScenario[] =
  PACKAGED_E2E_SMOKE_REGISTRY.filter((row) => row.automation === 'planned-gui-e2e')

/** stepId → registry `note` (future Playwright describe titles / handoff). */
export const PLANNED_GUI_E2E_STEP_BY_ID: Readonly<Record<string, string>> = Object.fromEntries(
  PLANNED_GUI_E2E_SCENARIOS.map((row) => [row.stepId, row.note])
)
