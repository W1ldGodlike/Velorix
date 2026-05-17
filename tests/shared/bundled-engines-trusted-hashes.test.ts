import { describe, expect, it } from 'vitest'

import {
  BUNDLED_ENGINE_EXE_JSON_KEYS,
  formatBundledEnginesTrustedHashDiagnosticLines
} from '../../src/shared/bundled-engines-trusted-hashes'

describe('bundled-engines-trusted-hashes §19', () => {
  it('formatBundledEnginesTrustedHashDiagnosticLines', () => {
    const lines = formatBundledEnginesTrustedHashDiagnosticLines()
    expect(lines.some((l) => l.includes('engines:doctor'))).toBe(true)
    expect(lines.some((l) => l.includes('engines:report-hashes'))).toBe(true)
    expect(lines.some((l) => l.includes(BUNDLED_ENGINE_EXE_JSON_KEYS[0]!))).toBe(true)
    expect(lines.some((l) => l.includes('FLUXALLOY_ENGINES_STRICT'))).toBe(true)
    expect(lines.some((l) => l.includes('FLUXALLOY_SKIP_FFPROBE_SMOKE'))).toBe(true)
    expect(lines.some((l) => l.includes('check:terminal-summaries-ru'))).toBe(true)
  })
})
