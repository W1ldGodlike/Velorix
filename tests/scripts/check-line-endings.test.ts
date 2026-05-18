import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('check:line-endings', () => {
  it('npm run check:line-endings exits 0', () => {
    const result = spawnSync('npm', ['run', 'check:line-endings'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      shell: process.platform === 'win32'
    })
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
    expect(result.status).toBe(0)
    expect(output).toContain('[check:line-endings] OK')
  })
})
