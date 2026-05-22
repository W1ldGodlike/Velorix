import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

import { describe, expect, it } from 'vitest'

describe('verify-bundled-engines-hashes §3', () => {
  it('--help documents Windows exe and Unix bin names', () => {
    const out = execFileSync(
      process.execPath,
      ['scripts/release/verify-bundled-engines-hashes.mjs', '--help'],
      { cwd: process.cwd(), encoding: 'utf8' }
    )
    expect(out).toContain('ffmpeg')
    expect(out).toContain('yt-dlp')
    expect(out).toContain('macOS/Linux')
    expect(out).toContain('VELORIX_ENGINES_STRICT')
    expect(out).toContain('windows-x64')
  })

  it('script verifies unix bin presence via verifyUnixBundled', () => {
    const text = readFileSync('scripts/release/verify-bundled-engines-hashes.mjs', 'utf8')
    expect(text).toContain('verifyUnixBundled')
    expect(text).toContain('BUNDLED_UNIX_BIN_FILES')
    expect(text).toContain('trusted_hashes')
  })
})
