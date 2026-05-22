import { mkdirSync, mkdtempSync, writeFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { describe, expect, it } from 'vitest'

import { resolveOpenMediaDialogDefaultPath } from '../../src/shared/preview-open-dialog-default-path'

describe('resolveOpenMediaDialogDefaultPath', () => {
  it('returns undefined for missing path', () => {
    expect(resolveOpenMediaDialogDefaultPath(undefined)).toBeUndefined()
    expect(resolveOpenMediaDialogDefaultPath('')).toBeUndefined()
    expect(resolveOpenMediaDialogDefaultPath('   ')).toBeUndefined()
    expect(
      resolveOpenMediaDialogDefaultPath(join(tmpdir(), 'velorix-no-such-path-xyz'))
    ).toBeUndefined()
  })

  it('returns directory for directory path', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fa-open-def-'))
    expect(resolveOpenMediaDialogDefaultPath(dir)).toBe(dir)
  })

  it('returns parent for file path', () => {
    const root = mkdtempSync(join(tmpdir(), 'fa-open-def-file-'))
    const f = join(root, 'a.mp4')
    writeFileSync(f, '')
    expect(resolveOpenMediaDialogDefaultPath(f)).toBe(root)
  })

  it('normalizes nested file parent', () => {
    const root = mkdtempSync(join(tmpdir(), 'fa-open-def-nested-'))
    const sub = join(root, 'inner')
    mkdirSync(sub)
    const f = join(sub, 'b.mkv')
    writeFileSync(f, '')
    expect(resolveOpenMediaDialogDefaultPath(f)?.replace(/\\/g, '/')).toBe(sub.replace(/\\/g, '/'))
  })
})
