import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import {
  PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_ORCHESTRATOR_MODULE,
  PACKAGED_GUI_E2E_PLAYWRIGHT_RUNNER_MODULE
} from '../../src/shared/packaged-gui-e2e-playwright-meta'
import { PLANNED_GUI_E2E_STEP_IDS } from '../e2e/gui/planned-gui-e2e-steps'

describe('run-planned-gui-e2e-gui (§21)', () => {
  it('locks planned step count', () => {
    expect(PLANNED_GUI_E2E_STEP_IDS.length).toBe(PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT)
  })

  it('package.json wires test:e2e:gui to orchestrator', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
      scripts: Record<string, string>
    }
    const script = pkg.scripts[PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT]
    expect(script).toContain('run-planned-gui-e2e-playwright.mjs')
    expect(script).toContain(PACKAGED_GUI_E2E_PLAYWRIGHT_ORCHESTRATOR_MODULE)
    expect(script).not.toContain(PACKAGED_GUI_E2E_PLAYWRIGHT_RUNNER_MODULE)
  })
})
