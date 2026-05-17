import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const node = process.execPath

describe('verify-bundled-engines-hashes.mjs §19', () => {
  it('--help exits 0', () => {
    const result = spawnSync(node, ['scripts/verify-bundled-engines-hashes.mjs', '--help'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      windowsHide: true
    })
    expect(result.status).toBe(0)
    expect(`${result.stdout ?? ''}${result.stderr ?? ''}`).toContain('FLUXALLOY_ENGINES_STRICT')
  })
})
