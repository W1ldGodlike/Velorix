import { describe, expect, it } from 'vitest'

import {
  BUNDLED_ENGINE_EXE_JSON_KEYS,
  BUNDLED_ENGINE_UNIX_BIN_NAMES,
  formatBundledEnginesTrustedHashDiagnosticLines
} from '../../src/shared/bundled-engines-trusted-hashes'

describe('bundled-engines-trusted-hashes §19', () => {
  it('formatBundledEnginesTrustedHashDiagnosticLines', () => {
    const lines = formatBundledEnginesTrustedHashDiagnosticLines()
    expect(lines.some((l) => l.includes('engines:doctor'))).toBe(true)
    expect(lines.some((l) => l.includes('engines:report-hashes'))).toBe(true)
    expect(lines.some((l) => l.includes(BUNDLED_ENGINE_EXE_JSON_KEYS[0]!))).toBe(true)
    expect(lines.some((l) => l.includes(BUNDLED_ENGINE_UNIX_BIN_NAMES[0]!))).toBe(true)
    expect(lines.some((l) => l.includes('trusted_unix:'))).toBe(true)
    expect(lines.some((l) => l.includes('trusted_hashes.json'))).toBe(true)
    expect(lines.some((l) => l.includes('VELORIX_ENGINES_STRICT'))).toBe(true)
    expect(lines.some((l) => l.includes('VELORIX_SKIP_FFPROBE_SMOKE'))).toBe(true)
    expect(lines.some((l) => l.includes('check:terminal-summaries-ru'))).toBe(true)
  })
})
