import { describe, expect, it } from 'vitest'

import { buildOwnerManualSmokeBundleLines } from '../../src/shared/owner-manual-smoke-bundle'
import { formatOwnerManualSmokeThemeChecklistLines } from '../../src/shared/owner-manual-smoke-theme-lines'

describe('owner-manual-smoke-theme-lines', () => {
  it('theme lines mention accent and inspector checks', () => {
    const lines = formatOwnerManualSmokeThemeChecklistLines()
    const joined = lines.join('\n')
    expect(joined).toContain('Theme')
    expect(joined).toContain('accent')
    expect(joined).toContain('инспектор')
  })

  it('bundle includes Theme section before HiDPI', () => {
    const lines = buildOwnerManualSmokeBundleLines({ platform: 'win32' })
    const themeIdx = lines.findIndex((l) => l === '=== Theme ===')
    const hidpiIdx = lines.findIndex((l) => l === '=== HiDPI ===')
    expect(themeIdx).toBeGreaterThanOrEqual(0)
    expect(hidpiIdx).toBeGreaterThan(themeIdx)
    expect(lines.join('\n')).toContain('ownerManualSmoke: Theme + HiDPI')
  })
})
