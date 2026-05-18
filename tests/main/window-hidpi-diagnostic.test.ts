import { describe, expect, it } from 'vitest'

import {
  formatWindowHidpiDiagnosticLines,
  WINDOW_LOGICAL_SCALE_TIERS
} from '../../src/main/window-hidpi'

describe('window-hidpi diagnostics §2.2', () => {
  it('formatWindowHidpiDiagnosticLines', () => {
    const lines = formatWindowHidpiDiagnosticLines()
    expect(lines.some((l) => l.includes('192dpi'))).toBe(true)
    expect(lines.some((l) => l.includes('100/125/150/200'))).toBe(true)
    expect(lines.some((l) => l.includes('app-settings-dialog'))).toBe(true)
    expect(lines.some((l) => l.includes('window-hidpi.test.ts'))).toBe(true)
    expect(WINDOW_LOGICAL_SCALE_TIERS).toContain(2)
  })
})
