import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

describe('audit:ipc-architecture (phase 7)', () => {
  it('registry ↔ main handle ↔ preload invoke', () => {
    const result = spawnSync(npmCmd, ['run', 'audit:ipc-architecture'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      shell: process.platform === 'win32',
      windowsHide: true
    })
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
    expect(result.status).toBe(0)
    expect(output).toContain('[audit:ipc-architecture] OK')
  })
})
