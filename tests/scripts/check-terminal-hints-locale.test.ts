import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:terminal-hints-locale §8', () => {
  it('npm run check:terminal-hints-locale exits 0', () => {
    const result = execSync('npm run check:terminal-hints-locale', { encoding: 'utf8' })
    expect(result).toContain('[check:terminal-hints-locale] OK')
    expect(result).toContain('appSettingsTerminalHintsGuardHint')
  })
})
