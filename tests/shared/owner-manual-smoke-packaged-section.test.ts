import { describe, expect, it } from 'vitest'

import { buildOwnerManualSmokeBundleLines } from '../../src/shared/owner-manual-smoke-bundle'
import { getPackagedManualSmokePlainTextForUiLocale } from '../../src/shared/packaged-manual-smoke-plain-text'
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

  it('packaged panel plain text extends section lines with §21 e2e', () => {
    const section = getOwnerManualSmokePackagedSectionForUiLocale('ru', 'win32')
    const plain = getPackagedManualSmokePlainTextForUiLocale('win', 'ru')
    const body = section?.lines.join('\n') ?? ''
    expect(plain.startsWith(body)).toBe(true)
    expect(plain).toContain('planned GUI e2e scope:')
  })
})
