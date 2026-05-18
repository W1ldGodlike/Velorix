import { describe, expect, it } from 'vitest'

import { PACKAGED_MANUAL_SMOKE_STEPS } from '../../src/shared/packaged-manual-smoke-step-ids'
import {
  PACKAGED_E2E_CI_SMOKE_SCRIPTS,
  PACKAGED_E2E_SMOKE_SCENARIOS,
  expandPackagedE2eCiSmokeScriptsForWorkflow,
  formatPackagedE2ePerStepDiagnosticLines,
  formatPackagedE2eSmokeDiagnosticLines
} from '../../src/shared/packaged-e2e-smoke-scenarios'

describe('packaged-e2e-smoke-scenarios §21', () => {
  it('covers every manual smoke step id exactly once', () => {
    const manualIds = PACKAGED_MANUAL_SMOKE_STEPS.map((s) => s.id)
    const registryIds = PACKAGED_E2E_SMOKE_SCENARIOS.map((s) => s.stepId)
    expect(registryIds).toEqual(manualIds)
  })

  it('lists unique ciSmokeScript npm names for CI guards', () => {
    expect(PACKAGED_E2E_CI_SMOKE_SCRIPTS).toEqual([
      'smoke:packaged-app',
      'smoke:packaged-engines',
      'smoke:packaged-ytdlp',
      'smoke:packaged-ffmpeg'
    ])
    expect(expandPackagedE2eCiSmokeScriptsForWorkflow()).toEqual([
      'smoke:packaged-app',
      'smoke:packaged-ffprobe',
      'smoke:packaged-ytdlp',
      'smoke:packaged-ffmpeg'
    ])
  })

  it('launch and engines map to ci headless smoke scripts', () => {
    const launch = PACKAGED_E2E_SMOKE_SCENARIOS.find((s) => s.stepId === 'launch')
    const engines = PACKAGED_E2E_SMOKE_SCENARIOS.find((s) => s.stepId === 'engines')
    expect(launch?.ciSmokeScript).toBe('smoke:packaged-app')
    expect(engines?.ciSmokeScript).toBe('smoke:packaged-engines')
  })

  it('diagnostic lines mention registry check', () => {
    const lines = formatPackagedE2eSmokeDiagnosticLines()
    const joined = lines.join('\n')
    expect(joined).toContain('check:packaged-e2e-scenarios-registry')
    expect(joined).toContain('ciSmokeScript npm')
    expect(joined).toContain('smoke:packaged-app')
  })

  it('per-step diagnostic lines cover every registry entry', () => {
    const perStep = formatPackagedE2ePerStepDiagnosticLines()
    expect(perStep).toHaveLength(PACKAGED_E2E_SMOKE_SCENARIOS.length)
    expect(perStep[0]).toBe('e2e launch: ci-headless script=smoke:packaged-app')
    expect(perStep.some((l) => l.includes('video-sprite: manual-owner'))).toBe(true)
    expect(
      perStep.some((l) => l.includes('ytdlp: planned-gui-e2e script=smoke:packaged-ytdlp'))
    ).toBe(true)
  })
})
