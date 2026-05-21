import { execFileSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('verify-linux-release-artifacts.mjs §2.1', () => {
  it('exits 0 on non-linux with skip log (local-linux-release-only)', () => {
    if (process.platform === 'linux') {
      return
    }
    const out = execFileSync(
      process.execPath,
      ['scripts/release/verify-linux-release-artifacts.mjs'],
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      }
    )
    expect(out).toContain('не Linux')
    expect(out).toContain('пропуск')
  })
})
