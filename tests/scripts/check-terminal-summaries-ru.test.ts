import { execFileSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:terminal-summaries-ru §8', () => {
  it('npm run check:terminal-summaries-ru exits 0', () => {
    const out = execFileSync('npm', ['run', 'check:terminal-summaries-ru'], {
      encoding: 'utf8',
      cwd: process.cwd(),
      shell: process.platform === 'win32'
    })
    expect(out).toContain('[check:terminal-summaries-ru] OK')
  })
})
