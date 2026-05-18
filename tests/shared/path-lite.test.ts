import { describe, expect, it } from 'vitest'

import { pathExtname, pathIsAbsolute, pathNormalize } from '../../src/shared/path-lite'

describe('path-lite', () => {
  it('pathExtname matches common extensions', () => {
    expect(pathExtname('D:\\videos\\clip.MP4')).toBe('.mp4')
    expect(pathExtname('/tmp/noext')).toBe('')
  })

  it('pathIsAbsolute detects Windows and POSIX roots', () => {
    expect(pathIsAbsolute('C:\\x')).toBe(true)
    expect(pathIsAbsolute('/var/log')).toBe(true)
    expect(pathIsAbsolute('relative/file.txt')).toBe(false)
  })

  it('pathNormalize collapses segments on Windows paths', () => {
    expect(pathNormalize('D:\\scripts\\..\\filter.vpy')).toMatch(/filter\.vpy$/i)
  })
})
