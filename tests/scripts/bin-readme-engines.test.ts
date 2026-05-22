import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('bin/README.md §3 engines', () => {
  const text = readFileSync('bin/README.md', 'utf8')

  it('documents darwin/linux-x64 trusted_hashes and engines:doctor', () => {
    expect(text).toContain('trusted_hashes.json')
    expect(text).toContain('darwin')
    expect(text).toContain('linux-x64')
    expect(text).toContain('engines:doctor')
    expect(text).toContain('engines:prepare:mac')
    expect(text).toContain('engines:prepare:linux')
  })
})
