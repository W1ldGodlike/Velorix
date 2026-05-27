import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  collectMacosUnpackedLayoutFailures,
  formatMacosUnpackedLayoutVerifyDiagnosticLines,
  listMacosUnpackedLayoutChecks,
  macosAppBundleCandidates,
  resolveMacosAppBundleRoot,
  resolveMacosAppBundleRootSync
} from '../../src/shared/macos-unpacked-layout-verify'

describe('macos-unpacked-layout-verify §2.1', () => {
  const repo = '/repo'
  const bundle = join(repo, 'dist', 'mac', 'Velorix.app')

  it('macosAppBundleCandidates lists dist/mac output dirs', () => {
    const c = macosAppBundleCandidates(repo)
    expect(c).toContain(join(repo, 'dist', 'mac', 'Velorix.app'))
    expect(c).toContain(join(repo, 'dist', 'mac-arm64', 'Velorix.app'))
  })

  it('resolveMacosAppBundleRoot picks first existing candidate', async () => {
    const candidates = macosAppBundleCandidates(repo)
    const root = await resolveMacosAppBundleRoot(candidates, {
      dirExists: (p) => p === candidates[1]
    })
    expect(root).toBe(candidates[1])
  })

  it('listMacosUnpackedLayoutChecks includes trusted_hashes.json', () => {
    const resources = join(bundle, 'Contents', 'Resources')
    const checks = listMacosUnpackedLayoutChecks(bundle)
    expect(
      checks.some((c) => c.label.includes('trusted_hashes.json') && c.path.includes(resources))
    ).toBe(true)
  })

  it('collectMacosUnpackedLayoutFailures OK when bundle complete', async () => {
    const checks = [
      join(bundle, 'Contents', 'MacOS', 'Velorix'),
      join(bundle, 'Contents', 'Resources', 'bin'),
      join(bundle, 'Contents', 'Resources', 'VELORIX_NEON_THEME.md'),
      join(bundle, 'Contents', 'Resources', 'Data', 'trusted_hashes.json'),
      join(bundle, 'Contents', 'Resources', 'Help')
    ]
    const present = new Set(checks)
    const failures = await collectMacosUnpackedLayoutFailures(bundle, {
      fileNonEmpty: (p) => present.has(p),
      dirExists: (p) => present.has(p)
    })
    expect(failures).toEqual([])
  })

  it('formatMacosUnpackedLayoutVerifyDiagnosticLines reports layout present/missing', () => {
    const bundle = join(repo, 'dist', 'mac-arm64', 'Velorix.app')
    const binDir = join(bundle, 'Contents', 'Resources', 'bin')
    const lines = formatMacosUnpackedLayoutVerifyDiagnosticLines(
      repo,
      (p) => p === bundle || p === binDir
    )
    expect(lines.some((l) => l.includes('verify:mac-unpacked'))).toBe(true)
    expect(lines.some((l) => l.includes('trusted_hashes.json'))).toBe(true)
    expect(lines.some((l) => l.includes('Velorix.app') && l.includes(bundle))).toBe(true)
    expect(lines.some((l) => l.includes('Contents/Resources/bin') && l.includes('present'))).toBe(
      true
    )
    expect(resolveMacosAppBundleRootSync(repo, (p) => p === bundle)).toBe(bundle)
  })
})
