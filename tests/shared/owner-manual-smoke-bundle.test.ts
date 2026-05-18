import { describe, expect, it } from 'vitest'

import { buildOwnerManualSmokeBundleLines } from '../../src/shared/owner-manual-smoke-bundle'
import { formatOwnerManualSmokeHidpiChecklistLines } from '../../src/shared/owner-manual-smoke-hidpi-lines'

describe('owner-manual-smoke-bundle', () => {
  it('hidpi lines mention editor and downloads checks', () => {
    const lines = formatOwnerManualSmokeHidpiChecklistLines()
    const joined = lines.join('\n')
    expect(joined).toContain('HiDPI')
    expect(joined).toContain('редактор')
    expect(joined).toContain('Загрузки')
  })

  it('bundle includes HW, scenario, and OS scheduler sections', () => {
    const lines = buildOwnerManualSmokeBundleLines({
      uiDpiLines: ['devicePixelRatio: 1.25'],
      platform: 'win32'
    })
    const joined = lines.join('\n')
    expect(joined).toContain('ownerManualSmoke:')
    expect(joined).toContain('=== Theme ===')
    expect(joined).toContain('=== HW encode ===')
    expect(joined).toContain('nvenc-probe')
    expect(joined).toContain('=== Scenario builder ===')
    expect(joined).toContain('step [add-link]')
    expect(joined).toContain('=== Video sprite §7.5 ===')
    expect(joined).toContain('step [generate]')
    expect(joined).toContain('=== Mini Player §4.3 ===')
    expect(joined).toContain('step [open]')
    expect(joined).toContain('=== Packaged Win')
    expect(joined).toContain('=== OS scheduler ===')
    expect(joined).toContain('devicePixelRatio: 1.25')
  })
})
