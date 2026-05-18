import { describe, expect, it } from 'vitest'

import { buildOwnerManualSmokeBundleLines } from '../../src/shared/owner-manual-smoke-bundle'
import { formatOwnerManualSmokeHidpiChecklistLines } from '../../src/shared/owner-manual-smoke-hidpi-lines'

describe('owner-manual-smoke-hidpi-lines', () => {
  it('hidpi lines mention editor and status bar checks', () => {
    const lines = formatOwnerManualSmokeHidpiChecklistLines()
    const joined = lines.join('\n')
    expect(joined).toContain('HiDPI')
    expect(joined).toContain('редактор')
    expect(joined).toContain('состояния')
  })

  it('bundle includes HiDPI section after Theme', () => {
    const lines = buildOwnerManualSmokeBundleLines({ platform: 'win32' })
    const themeIdx = lines.findIndex((l) => l === '=== Theme ===')
    const hidpiIdx = lines.findIndex((l) => l === '=== HiDPI ===')
    expect(themeIdx).toBeGreaterThanOrEqual(0)
    expect(hidpiIdx).toBeGreaterThan(themeIdx)
  })
})
