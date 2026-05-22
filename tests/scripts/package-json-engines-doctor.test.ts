import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('package.json engines:doctor §3', () => {
  it('chains verify-bundled and report-hashes', () => {
    const scripts = JSON.parse(readFileSync('package.json', 'utf8')).scripts as Record<
      string,
      string
    >
    const doctor = scripts['engines:doctor'] ?? ''
    expect(doctor).toContain('engines:verify-bundled')
    expect(doctor).toContain('engines:report-hashes')
    expect(scripts['engines:verify-bundled']).toContain('verify-bundled-engines-hashes.mjs')
  })
})
