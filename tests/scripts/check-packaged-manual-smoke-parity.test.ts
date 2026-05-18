import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'

describe('check:packaged-manual-smoke-parity §3/§19', () => {
  it('npm run check:packaged-manual-smoke-parity exits 0', () => {
    const result = execSync('npm run check:packaged-manual-smoke-parity', {
      cwd: path.resolve(import.meta.dirname, '../..'),
      encoding: 'utf8'
    })
    expect(result).toContain('[check:packaged-manual-smoke-parity] OK')
  })
})
