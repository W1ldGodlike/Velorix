import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:terminal-hints-guards-package-json §8', () => {
  it('npm run check:terminal-hints-guards-package-json exits 0', () => {
    const result = execSync('npm run check:terminal-hints-guards-package-json', {
      encoding: 'utf8'
    })
    expect(result).toContain('[check:terminal-hints-guards-package-json] OK')
    expect(result).toContain('quiet order')
    expect(result).toContain('6 terminal guards')
  })
})
