import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

describe('audit:shared-contracts (phase 7)', () => {
  it('src/shared *-contract.ts — только домены из ARCHITECTURE', () => {
    const result = spawnSync(npmCmd, ['run', 'audit:shared-contracts'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      shell: process.platform === 'win32',
      windowsHide: true
    })
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
    expect(result.status).toBe(0)
    expect(output).toContain('[audit:shared-contracts] OK')
  })
})
