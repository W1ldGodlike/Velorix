import { execFileSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:terminal-scenario-summaries §8', () => {
  it('npm run check:terminal-scenario-summaries exits 0', () => {
    const out = execFileSync('npm', ['run', 'check:terminal-scenario-summaries'], {
      encoding: 'utf8',
      cwd: process.cwd(),
      shell: process.platform === 'win32'
    })
    expect(out).toContain('[check:terminal-scenario-summaries] OK')
  })
})
