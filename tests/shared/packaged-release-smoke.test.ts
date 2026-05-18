import { describe, expect, it } from 'vitest'

import { listPackagedAppExeCandidatePaths } from '../../src/shared/packaged-app-smoke'
import { buildSupportZipPackagedReleaseLines } from '../../src/shared/packaged-release-smoke'

describe('packaged-release-smoke §19', () => {
  it('buildSupportZipPackagedReleaseLines merges release pipeline and layout', () => {
    const repo = 'C:\\repo'
    const appExe = listPackagedAppExeCandidatePaths(repo)[0]!
    const lines = buildSupportZipPackagedReleaseLines(repo, (p) => p === appExe)
    expect(lines[0]).toContain('smoke:packaged-release')
    expect(lines.some((l) => l.includes('verify:win-unpacked'))).toBe(true)
    expect(lines.some((l) => l.includes('smoke:packaged-engines'))).toBe(true)
    expect(lines.some((l) => l.includes('app-candidate:') && l.includes('present'))).toBe(true)
    expect(lines.some((l) => l.startsWith('layout: FluxAlloy.exe'))).toBe(true)
    expect(lines.some((l) => l.includes('FLUXALLOY_SKIP_PACK_VERIFY'))).toBe(true)
    expect(lines.some((l) => l.includes('FLUXALLOY_SKIP_FFPROBE_SMOKE'))).toBe(true)
    expect(lines.some((l) => l.includes('check:release:local'))).toBe(true)
    expect(lines.some((l) => l.includes('build:mac'))).toBe(true)
    expect(lines.some((l) => l.includes('build:linux'))).toBe(true)
    expect(lines.some((l) => l.includes('engines:doctor'))).toBe(true)
    expect(lines.some((l) => l.includes('trusted_hashes.json'))).toBe(true)
    expect(lines.some((l) => l.includes('check:terminal-summaries-ru'))).toBe(true)
    expect(lines.some((l) => l.includes('smoke:packaged-app'))).toBe(true)
    expect(lines.some((l) => l.includes('smoke:packaged-ytdlp'))).toBe(true)
    expect(lines.some((l) => l.includes('smoke:packaged-ffmpeg'))).toBe(true)
    expect(lines.some((l) => l.includes('smoke:packaged-ffprobe'))).toBe(true)
    expect(lines.filter((l) => l.startsWith('command:')).length).toBe(5)
    expect(lines.some((l) => l.includes('§21 packaged e2e registry'))).toBe(true)
    expect(lines.some((l) => l.includes('check:packaged-e2e-scenarios-registry'))).toBe(true)
    expect(lines.some((l) => l.includes('ci-headless'))).toBe(true)
    expect(lines.some((l) => l.includes('verify:mac-unpacked'))).toBe(true)
    expect(lines.some((l) => l.includes('FluxAlloy.app'))).toBe(true)
    expect(lines.some((l) => l.includes('verify:linux-unpacked'))).toBe(true)
    expect(lines.some((l) => l.includes('linux-unpacked'))).toBe(true)
  })

  it('includes win/linux/macos layout tails when dist artifacts are absent', () => {
    const repo = 'C:\\repo'
    const lines = buildSupportZipPackagedReleaseLines(repo, () => false)
    const joined = lines.join('\n')
    expect(joined).toContain('layout: FluxAlloy.exe')
    expect(joined).toContain('linux-unpacked')
    expect(joined).toContain('mac-arm64/FluxAlloy.app')
    expect(joined).toContain('§21 packaged e2e registry')
  })
})
