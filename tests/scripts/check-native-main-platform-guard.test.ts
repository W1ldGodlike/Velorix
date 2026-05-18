import { describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'

describe('check-native-main-platform-guard §2.1', () => {
  it('npm run check:native-main-platform-guard exits 0', () => {
    const out = execFileSync('npm', ['run', 'check:native-main-platform-guard'], {
      encoding: 'utf8',
      cwd: process.cwd(),
      shell: true
    })
    expect(out).toContain('[native-main-platform-guard] OK')
  })
})
