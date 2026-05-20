import { describe, expect, it } from 'vitest'

import { formatElectronViteEsmShimFixDiagnosticLine } from '../../src/shared/electron-vite-build-meta'
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
    expect(lines.some((l) => l.includes('no Node path import'))).toBe(true)
  })

  it('pairs renderer no Node path import guard with fix:esm-shim diagnostic', () => {
    const renderer = formatRendererStateDiagnosticLines()
    const shim = formatElectronViteEsmShimFixDiagnosticLine()
    expect(renderer.some((l) => l.includes('no Node path import'))).toBe(true)
    expect(shim).toContain('fix:esm-shim')
    expect(shim).toContain('renderer-state-approach.ts')
  })
})
