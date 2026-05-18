import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  collectMacosUnpackedLayoutFailures,
  macosAppBundleCandidates,
  resolveMacosAppBundleRoot
} from '../../src/shared/macos-unpacked-layout-verify'

describe('macos-unpacked-layout-verify §2.1', () => {
  const repo = '/repo'
  const bundle = join(repo, 'dist', 'mac', 'FluxAlloy.app')

  it('macosAppBundleCandidates lists dist/mac output dirs', () => {
    const c = macosAppBundleCandidates(repo)
    expect(c).toContain(join(repo, 'dist', 'mac', 'FluxAlloy.app'))
    expect(c).toContain(join(repo, 'dist', 'mac-arm64', 'FluxAlloy.app'))
  })

  it('resolveMacosAppBundleRoot picks first existing candidate', async () => {
    const candidates = macosAppBundleCandidates(repo)
    const root = await resolveMacosAppBundleRoot(candidates, {
      dirExists: (p) => p === candidates[1]
    })
    expect(root).toBe(candidates[1])
  })

  it('collectMacosUnpackedLayoutFailures OK when bundle complete', async () => {
    const checks = [
      join(bundle, 'Contents', 'MacOS', 'FluxAlloy'),
      join(bundle, 'Contents', 'Resources', 'bin'),
      join(bundle, 'Contents', 'Resources', 'FLUXALLOY_TZ.md'),
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
})
