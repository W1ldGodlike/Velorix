import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:help-smoke-guards-package-json §15', () => {
  it('npm run check:help-smoke-guards-package-json exits 0', () => {
    const result = execSync('npm run check:help-smoke-guards-package-json', {
      encoding: 'utf8'
    })
    expect(result).toContain('[check:help-smoke-guards-package-json] OK')
    expect(result).toContain('quiet order')
    expect(result).toContain('4 Help guards')
    expect(result).toContain('partition in 44 workflow')
  })
})
