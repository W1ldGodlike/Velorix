import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:owner-visual-smoke-locale §2.2/§16', () => {
  it('npm run check:owner-visual-smoke-locale exits 0', () => {
    const result = execSync('npm run check:owner-visual-smoke-locale', {
      encoding: 'utf8'
    })
    expect(result).toContain('[check:owner-visual-smoke-locale] OK')
  })
})
