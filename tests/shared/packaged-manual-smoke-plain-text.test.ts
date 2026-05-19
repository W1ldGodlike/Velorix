import { describe, expect, it } from 'vitest'

import { getPackagedManualSmokePlainTextForUiLocale } from '../../src/shared/packaged-manual-smoke-plain-text'
import { getOwnerManualSmokePackagedSectionForUiLocale } from '../../src/shared/owner-manual-smoke-packaged-section'

describe('packaged-manual-smoke-plain-text §3', () => {
  it('win en copy includes owner meta, launch step id, and §21 e2e appendix', () => {
    const text = getPackagedManualSmokePlainTextForUiLocale('win', 'en')
    expect(text).toContain('owner: manual Windows packaged smoke')
    expect(text).toContain('automated: npm run verify:win-unpacked')
    expect(text).toContain('step [launch]:')
    expect(text).toContain('=== §21 packaged e2e (CI vs owner) ===')
    expect(text).toContain('planned GUI e2e scope:')
    expect(text).toContain('e2e launch: ci-headless')
  })

  it('linux ru copy includes doc line, mini_player step, and §21 e2e appendix', () => {
    const text = getPackagedManualSmokePlainTextForUiLocale('linux', 'ru')
    expect(text).toContain('doc: docs/RELEASE.md §4.1')
    expect(text).toContain('step [mini-player]:')
    expect(text).toContain('planned-gui-e2e (8):')
    expect(text).toContain('check:help-workflow-smoke-crosslinks')
  })

  it('macos en copy appends the same §21 e2e block as other platforms', () => {
    const text = getPackagedManualSmokePlainTextForUiLocale('macos', 'en')
    expect(text).toContain('manual-owner (2): video-sprite, mini-player')
    expect(text).toContain('e2e settings: planned-gui-e2e')
  })

  it('checklist body matches owner packaged section plus §21 appendix', () => {
    const section = getOwnerManualSmokePackagedSectionForUiLocale('en', 'win32')
    expect(section).not.toBeNull()
    const plain = getPackagedManualSmokePlainTextForUiLocale('win', 'en')
    const body = section!.lines.join('\n')
    expect(plain.startsWith(body)).toBe(true)
    expect(plain.slice(body.length)).toContain('=== §21 packaged e2e (CI vs owner) ===')
  })
})
