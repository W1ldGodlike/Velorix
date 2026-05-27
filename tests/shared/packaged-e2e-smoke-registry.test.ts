import { describe, expect, it } from 'vitest'

import { PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT } from '../../src/shared/packaged-gui-e2e-playwright-meta'
import {
  PACKAGED_E2E_CI_SMOKE_SCRIPT_EXPANSIONS,
  PACKAGED_E2E_SMOKE_REGISTRY
} from '../../src/shared/packaged-e2e-smoke-registry'

describe('packaged-e2e-smoke-registry §21 leaf', () => {
  it('covers 11 manual smoke step ids once', () => {
    expect(PACKAGED_E2E_SMOKE_REGISTRY).toHaveLength(11)
    const ids = PACKAGED_E2E_SMOKE_REGISTRY.map((s) => s.stepId)
    expect(new Set(ids).size).toBe(11)
  })

  it('expands smoke:packaged-engines to CI leaf scripts', () => {
    expect(PACKAGED_E2E_CI_SMOKE_SCRIPT_EXPANSIONS['smoke:packaged-engines']).toEqual([
      'smoke:packaged-ffprobe',
      'smoke:packaged-ytdlp',
      'smoke:packaged-ffmpeg'
    ])
  })

  it('engines step references composite CI script', () => {
    const engines = PACKAGED_E2E_SMOKE_REGISTRY.find((s) => s.stepId === 'engines')
    expect(engines?.automation).toBe('ci-headless')
    expect(engines?.ciSmokeScript).toBe('smoke:packaged-engines')
  })

  it('automation kind counts match §21 sprint', () => {
    const count = (kind: (typeof PACKAGED_E2E_SMOKE_REGISTRY)[number]['automation']): number =>
      PACKAGED_E2E_SMOKE_REGISTRY.filter((s) => s.automation === kind).length
    expect(count('ci-headless')).toBe(2)
    expect(count('planned-gui-e2e')).toBe(PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT)
    expect(count('manual-owner')).toBe(9)
  })
})
