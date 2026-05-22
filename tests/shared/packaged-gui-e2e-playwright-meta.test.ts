import { describe, expect, it } from 'vitest'

import {
  PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_STEP_RUNNERS_MODULE
} from '../../src/shared/packaged-gui-e2e-playwright-meta'
import { listPackagedE2eStepIdsByAutomation } from '../../src/shared/packaged-e2e-smoke-scenarios'

describe('packaged-gui-e2e-playwright-meta §21', () => {
  it('planned step count matches registry planned-gui-e2e rows', () => {
    const ids = listPackagedE2eStepIdsByAutomation('planned-gui-e2e')
    expect(ids.length).toBe(PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT)
    expect(PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT).toBe(8)
  })

  it('exports wired npm script and step-runners module path', () => {
    expect(PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT).toBe('test:e2e:gui')
    expect(PACKAGED_GUI_E2E_PLAYWRIGHT_STEP_RUNNERS_MODULE).toContain(
      'planned-gui-e2e-step-runners'
    )
  })
})
