import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:maint-scripts-layout', () => {
  it('npm run check:maint-scripts-layout exits 0', () => {
    const result = spawnSync('npm', ['run', 'check:maint-scripts-layout'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      shell: process.platform === 'win32'
    })
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
    expect(result.status).toBe(0)
    expect(output).toContain('[check:maint-scripts-layout] OK')
  })
})
