/**
 * §21 — planned GUI e2e scaffold runner (`npm run test:e2e:gui`).
 * Lists 8 registry steps as todo; full Playwright specs after `npm install` adds `@playwright/test`.
 */
import {
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE
} from '../../src/shared/packaged-gui-e2e-playwright-meta.ts'
import { PACKAGED_E2E_SMOKE_REGISTRY } from '../../src/shared/packaged-e2e-smoke-registry.ts'

const LOG_PREFIX = 'test:e2e:gui'

const planned = PACKAGED_E2E_SMOKE_REGISTRY.filter((row) => row.automation === 'planned-gui-e2e')

if (planned.length !== PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT) {
  console.error(
    `[${LOG_PREFIX}] registry planned-gui-e2e ${planned.length} !== ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT}`
  )
  process.exit(1)
}

for (const row of planned) {
  console.log(`[todo] ${row.stepId}: ${row.note}`)
}

console.log(
  `[${LOG_PREFIX}] OK (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned-gui-e2e; scaffold ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}; Playwright specs pending @playwright/test install)`
)
