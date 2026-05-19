import { describe, expect, it } from 'vitest'

import { formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine } from '../../src/shared/packaged-gui-e2e-playwright-meta'
import { formatPackagedE2eSmokeDiagnosticLines } from '../../src/shared/packaged-e2e-smoke-scenarios'
import {
  formatPackagedManualSmokeE2eAppendixLines,
  getPackagedManualSmokePlainTextForUiLocale,
  PACKAGED_MANUAL_SMOKE_E2E_APPENDIX_HEADING
} from '../../src/shared/packaged-manual-smoke-plain-text'
import { getOwnerManualSmokePackagedSectionForUiLocale } from '../../src/shared/owner-manual-smoke-packaged-section'

describe('packaged-manual-smoke-plain-text §3', () => {
  it('win en copy includes owner meta, launch step id, and §21 e2e appendix', () => {
    const text = getPackagedManualSmokePlainTextForUiLocale('win', 'en')
    expect(text).toContain('owner: manual Windows packaged smoke')
    expect(text).toContain('automated: npm run verify:win-unpacked')
    expect(text).toContain('step [launch]:')
    expect(text).toContain(PACKAGED_MANUAL_SMOKE_E2E_APPENDIX_HEADING)
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

  it('formatPackagedManualSmokeE2eAppendixLines starts with canonical heading', () => {
    const lines = formatPackagedManualSmokeE2eAppendixLines()
    expect(lines[0]).toBe(PACKAGED_MANUAL_SMOKE_E2E_APPENDIX_HEADING)
    expect(lines.slice(1)).toEqual(formatPackagedE2eSmokeDiagnosticLines())
    expect(lines.some((l) => l.includes('check:packaged-e2e-scenarios-registry'))).toBe(true)
    expect(lines.join('\n')).toContain(formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine())
    expect(lines.join('\n')).toContain('check:packaged-gui-e2e-playwright-deferred')
  })

  it('checklist body matches owner packaged section plus §21 appendix', () => {
    const section = getOwnerManualSmokePackagedSectionForUiLocale('en', 'win32')
    expect(section).not.toBeNull()
    const plain = getPackagedManualSmokePlainTextForUiLocale('win', 'en')
    const body = section!.lines.join('\n')
    expect(plain.startsWith(body)).toBe(true)
    expect(plain.slice(body.length)).toContain(PACKAGED_MANUAL_SMOKE_E2E_APPENDIX_HEADING)
  })
})
