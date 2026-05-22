import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('prepare-engines-unix §3', () => {
  it('prepare-engines-unix.mjs defines mac/linux BtbN arch keys', () => {
    const text = readFileSync('scripts/release/prepare-engines-unix.mjs', 'utf8')
    expect(text).toContain('macosarm64')
    expect(text).toContain('linux64')
    expect(text).toContain('ffmpeg-master-latest-')
  })

  it('package.json engines:prepare:mac|linux still route through bundled-first', () => {
    const scripts = JSON.parse(readFileSync('package.json', 'utf8')).scripts as Record<
      string,
      string
    >
    expect(scripts['engines:prepare:mac']).toContain('prepare-engines-bundled-first.mjs mac')
    expect(scripts['engines:prepare:linux']).toContain('prepare-engines-bundled-first.mjs linux')
  })

  it('predev-engines.mjs invokes prepare-engines-unix on unix', () => {
    const text = readFileSync('scripts/release/predev-engines.mjs', 'utf8')
    expect(text).toContain('prepare-engines-unix.mjs')
  })
})
