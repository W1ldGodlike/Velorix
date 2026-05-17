import { execFileSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:locales-json §2.2', () => {
  it('npm run check:locales-json exits 0', () => {
    const out = execFileSync('npm', ['run', 'check:locales-json'], {
      encoding: 'utf8',
      cwd: process.cwd(),
      shell: process.platform === 'win32'
    })
    expect(out).toContain('[check:locales-json] OK')
  })
})
