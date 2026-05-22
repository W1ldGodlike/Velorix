import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const node = process.execPath

describe('verify-macos-unpacked-layout.mjs §19', () => {
  it('--help exits 0', () => {
    const result = spawnSync(node, ['scripts/release/verify-macos-unpacked-layout.mjs', '--help'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      windowsHide: true
    })
    expect(result.status).toBe(0)
    expect(`${result.stdout ?? ''}${result.stderr ?? ''}`).toContain('FLUXALLOY_SKIP_PACK_VERIFY')
  })

  it('layout verify expects Data/trusted_hashes.json in bundle resources', () => {
    const lib = readFileSync('src/shared/macos-unpacked-layout-verify.ts', 'utf8')
    expect(lib).toContain('trusted_hashes.json')
    expect(lib).toContain('Contents/Resources/Data')
  })
})
