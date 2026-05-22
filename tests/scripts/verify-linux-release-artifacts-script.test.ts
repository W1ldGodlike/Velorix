import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const node = process.execPath

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

  it('--help documents VELORIX_SKIP_PACK_VERIFY', () => {
    const result = spawnSync(
      node,
      ['scripts/release/verify-linux-release-artifacts.mjs', '--help'],
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        windowsHide: true
      }
    )
    expect(result.status).toBe(0)
    expect(`${result.stdout ?? ''}${result.stderr ?? ''}`).toContain('VELORIX_SKIP_PACK_VERIFY')
  })

  it('script wires linux-release-artifacts verify lib', () => {
    const text = readFileSync('scripts/release/verify-linux-release-artifacts.mjs', 'utf8')
    expect(text).toContain('verify-linux-release-artifacts-lib.mjs')
    expect(text).toContain('AppImage')
    expect(text).toContain('.deb')
  })
})
