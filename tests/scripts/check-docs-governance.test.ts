import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function runDocsGovernance(): { status: number | null; output: string } {
  const result = spawnSync(npmCmd, ['run', 'check:docs-governance'], {
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

describe('check-docs-governance', () => {
  it('navigation docs have no broken links or legacy path references', () => {
    const { status, output } = runDocsGovernance()
    expect(status).toBe(0)
    expect(output).toContain('[docs-governance] OK')
  })
})
