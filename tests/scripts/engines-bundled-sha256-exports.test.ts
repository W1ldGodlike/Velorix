import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('engines-bundled-sha256.mjs §3 exports', () => {
  const text = readFileSync('scripts/release/engines-bundled-sha256.mjs', 'utf8')

  it('defines Windows exe and Unix bin file tables', () => {
    expect(text).toContain('BUNDLED_EXE_FILES')
    expect(text).toContain('BUNDLED_UNIX_BIN_FILES')
    expect(text).toContain("file: 'ffmpeg'")
    expect(text).toContain("file: 'ffmpeg.exe'")
    expect(text).toContain('sha256File')
  })
})
