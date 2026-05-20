import { describe, expect, it } from 'vitest'

import {
  CHECK_RELEASE_LOCAL_NPM_SCRIPT,
  CHECK_RELEASE_NPM_SCRIPT,
  formatCheckReleaseScriptDiagnosticLines
} from '../../src/shared/check-release-scripts'

describe('check-release-scripts', () => {
  it('formatCheckReleaseScriptDiagnosticLines mentions release scripts', () => {
    const lines = formatCheckReleaseScriptDiagnosticLines()
    expect(lines.some((l) => l.includes(CHECK_RELEASE_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes(CHECK_RELEASE_LOCAL_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes('engines:prepare:win'))).toBe(true)
  })
})
