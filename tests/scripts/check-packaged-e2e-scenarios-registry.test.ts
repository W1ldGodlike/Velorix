import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:packaged-e2e-scenarios-registry §21', () => {
  it('npm run check:packaged-e2e-scenarios-registry exits 0', () => {
    const result = execSync('npm run check:packaged-e2e-scenarios-registry', {
      encoding: 'utf8'
    })
    expect(result).toContain('[check:packaged-e2e-scenarios-registry] OK')
    expect(result).toContain('CI expansions')
  })
})
