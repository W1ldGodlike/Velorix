import { describe, expect, it } from 'vitest'

import { buildOwnerManualSmokeBundleLines } from '../../src/shared/owner-manual-smoke-bundle'
import {
  getOwnerManualSmokePackagedSection,
  getOwnerManualSmokePackagedSectionForUiLocale
} from '../../src/shared/owner-manual-smoke-packaged-section'

describe('owner-manual-smoke-packaged-section §3', () => {
  it('returns Win packaged section on win32', () => {
    const section = getOwnerManualSmokePackagedSection('win32')
    expect(section?.platform).toBe('win')
    expect(section?.heading).toContain('Packaged Win')
    expect(section?.lines.join('\n')).toContain('step [launch]')
  })

  it('bundle includes packaged block for platform', () => {
    const lines = buildOwnerManualSmokeBundleLines({ platform: 'win32' })
    const joined = lines.join('\n')
    expect(joined).toContain('=== Packaged Win')
    expect(joined).toContain('step [launch]')
  })

  it('en UI locale uses English packaged meta on win32', () => {
    const section = getOwnerManualSmokePackagedSectionForUiLocale('en', 'win32')
    expect(section?.heading).toContain('Packaged Win')
    const joined = section?.lines.join('\n') ?? ''
    expect(joined).toContain('owner: manual Windows packaged smoke')
    expect(joined).toContain('Settings → Dependencies')
  })
})
