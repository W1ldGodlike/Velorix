import { describe, expect, it } from 'vitest'

import { buildOwnerManualSmokeBundleLines } from '../../src/shared/owner-manual-smoke-bundle'
import { getOwnerManualSmokePackagedSection } from '../../src/shared/owner-manual-smoke-packaged-section'

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
})
