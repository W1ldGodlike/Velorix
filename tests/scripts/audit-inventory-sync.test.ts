import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

describe('audit:inventory-sync (phase 8)', () => {
  it('audit-manifest.json совпадает с audit-scope', () => {
    const result = spawnSync(npmCmd, ['run', 'audit:inventory-sync'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      shell: process.platform === 'win32',
      windowsHide: true
    })
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
    expect(result.status).toBe(0)
    expect(output).toContain('[audit:inventory-sync] OK')
  })
})
