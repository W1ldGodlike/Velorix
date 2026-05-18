import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:help-owner-smoke-docs §15/§21', () => {
  it('npm run check:help-owner-smoke-docs exits 0', () => {
    const result = execSync('npm run check:help-owner-smoke-docs', {
      encoding: 'utf8'
    })
    expect(result).toContain('[check:help-owner-smoke-docs] OK')
  })
})
