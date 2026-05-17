import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('check:release script chain §19', () => {
  const scripts = JSON.parse(readFileSync('package.json', 'utf8')).scripts as Record<string, string>

  it('smoke:packaged-release runs verify, app, and engines', () => {
    const cmd = scripts['smoke:packaged-release'] ?? ''
    expect(cmd).toContain('verify:win-unpacked')
    expect(cmd).toContain('smoke:packaged-app')
    expect(cmd).toContain('smoke:packaged-engines')
  })

  it('smoke:packaged-engines runs ffprobe, ytdlp, ffmpeg', () => {
    const cmd = scripts['smoke:packaged-engines'] ?? ''
    expect(cmd).toContain('smoke:packaged-ffprobe')
    expect(cmd).toContain('smoke:packaged-ytdlp')
    expect(cmd).toContain('smoke:packaged-ffmpeg')
  })

  it('check:release includes pack:dir, smoke:packaged-release, audit:moderate', () => {
    const cmd = scripts['check:release'] ?? ''
    expect(cmd).toContain('pack:dir')
    expect(cmd).toContain('smoke:packaged-release')
    expect(cmd).toContain('audit:moderate')
  })

  it('check:release runs engines:doctor before build', () => {
    const cmd = scripts['check:release'] ?? ''
    const doctorAt = cmd.indexOf('engines:doctor')
    const buildAt = cmd.indexOf('npm run build')
    expect(doctorAt).toBeGreaterThanOrEqual(0)
    expect(buildAt).toBeGreaterThan(doctorAt)
    expect(cmd).toContain('engines:prepare:win')
  })
})
