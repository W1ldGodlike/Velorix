import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:help-packaged-smoke-docs §15', () => {
  it('npm run check:help-packaged-smoke-docs exits 0', () => {
    const result = execSync('npm run check:help-packaged-smoke-docs', {
      encoding: 'utf8'
    })
    expect(result).toContain('[check:help-packaged-smoke-docs] OK')
  })
})
