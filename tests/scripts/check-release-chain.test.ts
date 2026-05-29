import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('check:release script chain §19', () => {
  const scripts = JSON.parse(readFileSync('package.json', 'utf8')).scripts as Record<string, string>

  it('check:release includes pack:dir, verify:win-unpacked, audit:moderate', () => {
    const cmd = scripts['check:release'] ?? ''
    expect(cmd).toContain('pack:dir')
    expect(cmd).toContain('verify:win-unpacked')
    expect(cmd).toContain('audit:moderate')
    expect(cmd).not.toContain('smoke:packaged')
  })

  it('check:release runs engines:doctor before build', () => {
    const cmd = scripts['check:release'] ?? ''
    const doctorAt = cmd.indexOf('engines:doctor')
    const buildAt = cmd.indexOf('npm run build')
    expect(doctorAt).toBeGreaterThanOrEqual(0)
    expect(buildAt).toBeGreaterThan(doctorAt)
    expect(cmd).toContain('engines:prepare:win')
  })

  it('check:release:local skips check and prepare:win', () => {
    const cmd = scripts['check:release:local'] ?? ''
    expect(cmd).not.toContain('npm run check')
    expect(cmd).not.toContain('engines:prepare:win')
    expect(cmd).toContain('engines:doctor')
    expect(cmd).toContain('pack:dir')
    expect(cmd).toContain('verify:win-unpacked')
    expect(cmd).toContain('audit:moderate')
  })
})
