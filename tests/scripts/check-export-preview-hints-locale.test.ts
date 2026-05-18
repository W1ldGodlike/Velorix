import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'

describe('check:export-preview-hints-locale', () => {
  it('npm run check:export-preview-hints-locale exits 0', () => {
    const result = execSync('npm run check:export-preview-hints-locale', {
      cwd: path.resolve(import.meta.dirname, '../..'),
      encoding: 'utf8'
    })
    expect(result).toContain('[check:export-preview-hints-locale] OK')
  })
})
