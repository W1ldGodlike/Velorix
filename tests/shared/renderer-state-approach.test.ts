import { describe, expect, it } from 'vitest'

import {
  formatRendererStateDiagnosticLines,
  RENDERER_STATE_APPROACH,
  RENDERER_ZUSTAND_STORES
} from '../../src/shared/renderer-state-approach'

describe('renderer-state-approach', () => {
  it('post PURGE v3 is none with no stores', () => {
    expect(RENDERER_STATE_APPROACH).toBe('none')
    expect(RENDERER_ZUSTAND_STORES).toEqual([])
    const lines = formatRendererStateDiagnosticLines()
    expect(lines.some((l) => l.includes('none'))).toBe(true)
  })
})
