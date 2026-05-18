import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function runUiSurfacesGuard(): { status: number | null; output: string } {
  const result = spawnSync(npmCmd, ['run', 'check:ui-surfaces-guard'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    shell: process.platform === 'win32',
    windowsHide: true
  })
  return {
    status: result.status,
    output: `${result.stdout ?? ''}${result.stderr ?? ''}`
  }
}

describe('check-ui-surfaces-guard', () => {
  it('gate=no-plan — no temp program artifacts or legacy pop-out paths', () => {
    const { status, output } = runUiSurfacesGuard()
    expect(status).toBe(0)
    expect(output).toContain('[ui-surfaces-guard] OK')
    expect(output).toContain('gate=no-plan')
  })
})
