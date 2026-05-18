import { describe, expect, it } from 'vitest'

import {
  formatRendererStateDiagnosticLines,
  RENDERER_SHELL_ENTRY,
  RENDERER_STATE_APPROACH,
  RENDERER_ZUSTAND_STORES
} from '../../src/shared/renderer-state-approach'

describe('renderer-state-approach §2.2', () => {
  it('formatRendererStateDiagnosticLines', () => {
    const lines = formatRendererStateDiagnosticLines()
    expect(lines.some((l) => l.includes(RENDERER_STATE_APPROACH))).toBe(true)
    expect(lines.some((l) => l.includes(RENDERER_SHELL_ENTRY))).toBe(true)
    expect(lines.some((l) => l.includes(RENDERER_ZUSTAND_STORES[0]))).toBe(true)
    expect(lines.some((l) => l.includes('uiLocaleRenderTick'))).toBe(true)
    expect(lines.some((l) => l.includes('ARCHITECTURE.md'))).toBe(true)
  })
})
