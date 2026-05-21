import { execFileSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('verify-macos-unpacked-layout.mjs §2.1', () => {
  it('exits 0 on non-darwin with skip log (local-macos-only)', () => {
    if (process.platform === 'darwin') {
      return
    }
    const out = execFileSync(
      process.execPath,
      ['scripts/release/verify-macos-unpacked-layout.mjs'],
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      }
    )
    expect(out).toContain('не macOS')
    expect(out).toContain('пропуск')
  })
})
