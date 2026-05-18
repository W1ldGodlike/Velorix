import { describe, expect, it } from 'vitest'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

describe('check-ui-copy-quality', () => {
  it('npm run check:ui-copy-quality exits 0', () => {
    const result = spawnSync('npm', ['run', 'check:ui-copy-quality'], {
      cwd: path.resolve(import.meta.dirname, '../..'),
      encoding: 'utf8',
      shell: true,
      windowsHide: true
    })
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
    expect(result.status).toBe(0)
    expect(output).toContain('[check:ui-copy-quality] OK')
  })
})
