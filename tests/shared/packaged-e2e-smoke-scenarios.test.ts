import { describe, expect, it } from 'vitest'

import { PACKAGED_MANUAL_SMOKE_STEPS } from '../../src/shared/packaged-manual-smoke-step-ids'
import {
  PACKAGED_E2E_SMOKE_SCENARIOS,
  formatPackagedE2eSmokeDiagnosticLines
} from '../../src/shared/packaged-e2e-smoke-scenarios'

describe('packaged-e2e-smoke-scenarios §21', () => {
  it('covers every manual smoke step id exactly once', () => {
    const manualIds = PACKAGED_MANUAL_SMOKE_STEPS.map((s) => s.id)
    const registryIds = PACKAGED_E2E_SMOKE_SCENARIOS.map((s) => s.stepId)
    expect(registryIds).toEqual(manualIds)
  })

  it('launch and engines map to ci headless smoke scripts', () => {
    const launch = PACKAGED_E2E_SMOKE_SCENARIOS.find((s) => s.stepId === 'launch')
    const engines = PACKAGED_E2E_SMOKE_SCENARIOS.find((s) => s.stepId === 'engines')
    expect(launch?.ciSmokeScript).toBe('smoke:packaged-app')
    expect(engines?.ciSmokeScript).toBe('smoke:packaged-engines')
  })

  it('diagnostic lines mention registry check', () => {
    const lines = formatPackagedE2eSmokeDiagnosticLines()
    expect(lines.join('\n')).toContain('check:packaged-e2e-scenarios-registry')
  })
})
