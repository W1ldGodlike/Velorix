import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:support-bundle-terminal-hints §18', () => {
  it('npm run check:support-bundle-terminal-hints exits 0', () => {
    const result = execSync('npm run check:support-bundle-terminal-hints', { encoding: 'utf8' })
    expect(result).toContain('[check:support-bundle-terminal-hints] OK')
    expect(result).toContain('terminalHints:')
  })
})
