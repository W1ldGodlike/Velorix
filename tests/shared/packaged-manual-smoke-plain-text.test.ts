import { describe, expect, it } from 'vitest'

import { getPackagedManualSmokePlainTextForUiLocale } from '../../src/shared/packaged-manual-smoke-plain-text'

describe('packaged-manual-smoke-plain-text §3', () => {
  it('win en copy includes owner meta and launch step id', () => {
    const text = getPackagedManualSmokePlainTextForUiLocale('win', 'en')
    expect(text).toContain('owner: manual Windows packaged smoke')
    expect(text).toContain('automated: npm run verify:win-unpacked')
    expect(text).toContain('step [launch]:')
  })

  it('linux ru copy includes doc line and mini_player step', () => {
    const text = getPackagedManualSmokePlainTextForUiLocale('linux', 'ru')
    expect(text).toContain('doc: docs/RELEASE.md §4.1')
    expect(text).toContain('step [mini-player]:')
  })
})
