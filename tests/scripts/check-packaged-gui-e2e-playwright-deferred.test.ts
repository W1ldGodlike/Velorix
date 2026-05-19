import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:packaged-gui-e2e-playwright-deferred §21', () => {
  it('npm run check:packaged-gui-e2e-playwright-deferred exits 0', () => {
    const result = execSync('npm run check:packaged-gui-e2e-playwright-deferred', {
      encoding: 'utf8'
    })
    expect(result).toContain('[check:packaged-gui-e2e-playwright-deferred] OK')
    expect(result).toContain('test:e2e:gui')
  })
})
