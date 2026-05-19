import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:help-terminal-hints-docs §8', () => {
  it('npm run check:help-terminal-hints-docs exits 0', () => {
    const result = execSync('npm run check:help-terminal-hints-docs', { encoding: 'utf8' })
    expect(result).toContain('[check:help-terminal-hints-docs] OK')
    expect(result).toContain('12 Help files')
    expect(result).toContain('bin/README.md')
  })
})
