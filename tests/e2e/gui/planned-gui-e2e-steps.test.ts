import { existsSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import {
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT
} from '../../../src/shared/packaged-gui-e2e-playwright-meta'
import { PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_SCENARIOS_MODULE } from '../../../src/shared/packaged-e2e-help-workflow-crosslinks-meta'
import { PACKAGED_E2E_SMOKE_REGISTRY } from '../../../src/shared/packaged-e2e-smoke-registry'
import { PACKAGED_E2E_PLANNED_GUI_STEP_IDS } from '../../../src/shared/packaged-e2e-smoke-scenarios'

import {
  PLANNED_GUI_E2E_SCENARIOS,
  PLANNED_GUI_E2E_STEP_BY_ID,
  PLANNED_GUI_E2E_STEP_IDS,
  plannedGuiE2eStepNeedsSampleMp4
} from './planned-gui-e2e-steps'

describe('planned-gui-e2e-steps (§21 Playwright registry)', () => {
  it('re-exports registry planned-gui-e2e step ids', () => {
    expect(PLANNED_GUI_E2E_STEP_IDS).toEqual(PACKAGED_E2E_PLANNED_GUI_STEP_IDS)
    expect(PLANNED_GUI_E2E_STEP_IDS).toHaveLength(PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT)
  })

  it('step runners module exists for planned-gui-e2e.spec', () => {
    expect(existsSync('tests/e2e/gui/planned-gui-e2e-step-runners.ts')).toBe(true)
  })

  it('plannedGuiE2eStepNeedsSampleMp4 flags media steps', () => {
    expect(plannedGuiE2eStepNeedsSampleMp4('open-file')).toBe(true)
    expect(plannedGuiE2eStepNeedsSampleMp4('ytdlp')).toBe(false)
  })

  it('registry module path matches crosslinks-meta sync constant', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_SCENARIOS_MODULE).toBe(
      PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE
    )
  })

  it('matches PACKAGED_E2E_SMOKE_REGISTRY planned-gui-e2e rows', () => {
    const registryIds = PACKAGED_E2E_SMOKE_REGISTRY.filter(
      (row) => row.automation === 'planned-gui-e2e'
    ).map((row) => row.stepId)
    expect([...PLANNED_GUI_E2E_STEP_IDS]).toEqual(registryIds)
  })

  it('exports PLANNED_GUI_E2E_SCENARIOS registry rows', () => {
    expect(PLANNED_GUI_E2E_SCENARIOS.map((row) => row.stepId)).toEqual([
      ...PLANNED_GUI_E2E_STEP_IDS
    ])
    expect(PLANNED_GUI_E2E_SCENARIOS.every((row) => row.automation === 'planned-gui-e2e')).toBe(
      true
    )
  })

  it('exports PLANNED_GUI_E2E_STEP_BY_ID notes for each planned step', () => {
    expect(Object.keys(PLANNED_GUI_E2E_STEP_BY_ID)).toEqual([...PLANNED_GUI_E2E_STEP_IDS])
    for (const row of PLANNED_GUI_E2E_SCENARIOS) {
      expect(PLANNED_GUI_E2E_STEP_BY_ID[row.stepId]).toBe(row.note)
      expect(PLANNED_GUI_E2E_STEP_BY_ID[row.stepId]?.length).toBeGreaterThan(0)
    }
  })
})
