import { describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'

describe('check-renderer-state-approach §2.2', () => {
  it('npm run check:renderer-state-approach exits 0', () => {
    const out = execFileSync('npm', ['run', 'check:renderer-state-approach'], {
      encoding: 'utf8',
      cwd: process.cwd(),
      shell: true
    })
    expect(out).toContain('[renderer-state-approach] OK')
  })
})
