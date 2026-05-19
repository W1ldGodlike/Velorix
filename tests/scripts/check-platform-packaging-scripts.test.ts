import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:platform-packaging-scripts §19', () => {
  it('npm run check:platform-packaging-scripts exits 0', () => {
    const result = execSync('npm run check:platform-packaging-scripts', {
      encoding: 'utf8'
    })
    expect(result).toContain('[check:platform-packaging-scripts] OK')
    expect(result).toContain('fix:esm-shim')
  })
})
