import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('report-bundled-engines-hashes.mjs §3', () => {
  it('documents --json sections for windows-x64 and unix platforms', () => {
    const text = readFileSync('scripts/release/report-bundled-engines-hashes.mjs', 'utf8')
    expect(text).toContain('--json')
    expect(text).toContain('windows-x64')
    expect(text).toContain('darwin-universal')
    expect(text).toContain('linux-x64')
  })
})
