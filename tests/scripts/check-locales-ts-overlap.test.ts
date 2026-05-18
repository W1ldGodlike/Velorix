import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'

describe('check:locales-ts-overlap', () => {
  it('npm run check:locales-ts-overlap exits 0', () => {
    const result = execSync('npm run check:locales-ts-overlap', {
      cwd: path.resolve(import.meta.dirname, '../..'),
      encoding: 'utf8'
    })
    expect(result).toContain('[check:locales-ts-overlap] OK')
  })
})
