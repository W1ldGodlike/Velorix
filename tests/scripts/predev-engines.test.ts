import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('predev-engines.mjs §3', () => {
  const text = readFileSync('scripts/release/predev-engines.mjs', 'utf8')

  it('unix path runs prepare-engines-unix when bin empty then verify-bundled', () => {
    expect(text).toContain('prepare-engines-unix.mjs')
    expect(text).toContain('verify-bundled-engines-hashes.mjs')
    expect(text).toContain('BUNDLED_UNIX_BIN_FILES')
    expect(text).toContain("prepareKey = process.platform === 'darwin' ? 'mac' : 'linux'")
  })

  it('windows path runs prepare-engines-win', () => {
    expect(text).toContain('prepare-engines-win.mjs')
  })
})
