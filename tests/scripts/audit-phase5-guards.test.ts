import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function runNpmScript(script: string): { status: number | null; output: string } {
  const result = spawnSync(npmCmd, ['run', script], {
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

describe('audit phase-5 guards (npm scripts)', () => {
  it('audit:todo-debt — product code free of debt markers', () => {
    const { status, output } = runNpmScript('audit:todo-debt')
    expect(status).toBe(0)
    expect(output).toContain('[audit:todo-debt] OK')
  })

  it('audit:dead-type-reexports — нет мёртвых type re-export в src/main/', () => {
    const { status, output } = runNpmScript('audit:dead-type-reexports')
    expect(status).toBe(0)
    expect(output).toContain('[audit:dead-type-reexports] OK')
  })
})
