import { describe, expect, it } from 'vitest'

import {
  PACKAGED_E2E_CI_SMOKE_SCRIPT_EXPANSIONS,
  PACKAGED_E2E_SMOKE_REGISTRY
} from '../../src/shared/packaged-e2e-smoke-registry'

describe('packaged-e2e-smoke-registry §21 leaf', () => {
  it('covers 12 manual smoke step ids once', () => {
    expect(PACKAGED_E2E_SMOKE_REGISTRY).toHaveLength(12)
    const ids = PACKAGED_E2E_SMOKE_REGISTRY.map((s) => s.stepId)
    expect(new Set(ids).size).toBe(12)
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
})
