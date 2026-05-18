import { execFileSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:terminal-data-summaries §8', () => {
  it('npm run check:terminal-data-summaries exits 0', () => {
    const out = execFileSync('npm', ['run', 'check:terminal-data-summaries'], {
      encoding: 'utf8',
      cwd: process.cwd(),
      shell: process.platform === 'win32'
    })
    expect(out).toContain('[check:terminal-data-summaries] OK')
  })
})
