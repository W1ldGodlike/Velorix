import { describe, expect, it } from 'vitest'

import {
  formatRendererStateDiagnosticLines,
  RENDERER_COMPOSITION_ROOT_HOOK,
  RENDERER_STATE_APPROACH
} from '../../src/shared/renderer-state-approach'

describe('renderer-state-approach §2.2', () => {
  it('formatRendererStateDiagnosticLines', () => {
    const lines = formatRendererStateDiagnosticLines()
    expect(lines.some((l) => l.includes(RENDERER_STATE_APPROACH))).toBe(true)
    expect(lines.some((l) => l.includes(RENDERER_COMPOSITION_ROOT_HOOK))).toBe(true)
    expect(lines.some((l) => l.includes('useAppCompositionLocalState'))).toBe(true)
    expect(lines.some((l) => l.includes('uiLocaleRenderTick'))).toBe(true)
    expect(lines.some((l) => l.includes('ARCHITECTURE.md'))).toBe(true)
  })
})
