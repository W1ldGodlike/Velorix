import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  collectWinUnpackedLayoutFailures,
  formatWinUnpackedLayoutVerifyDiagnosticLines,
  listWinUnpackedLayoutChecks,
  WIN_UNPACKED_BUNDLED_ENGINE_FILES,
  winUnpackedLayoutRoot
} from '../../src/shared/win-unpacked-layout-verify'

describe('win-unpacked-layout-verify §19', () => {
  const repo = 'C:\\repo'
  const unpacked = winUnpackedLayoutRoot(repo)

  it('listWinUnpackedLayoutChecks covers engines and extraResources', () => {
    const checks = listWinUnpackedLayoutChecks(unpacked)
    expect(checks[0]?.path).toBe(join(unpacked, 'FluxAlloy.exe'))
    expect(checks.some((c) => c.label === 'resources/bin')).toBe(true)
    for (const name of WIN_UNPACKED_BUNDLED_ENGINE_FILES) {
      expect(checks.some((c) => c.path === join(unpacked, 'resources', 'bin', name))).toBe(true)
    }
    expect(checks.some((c) => c.label === 'resources/Help')).toBe(true)
  })

  it('collectWinUnpackedLayoutFailures reports missing exe and engine', async () => {
    const present = new Set<string>()
    const failures = await collectWinUnpackedLayoutFailures(unpacked, {
      fileNonEmpty: (p) => present.has(p),
      dirExists: (p) => present.has(p)
    })
    expect(failures.length).toBeGreaterThan(3)
    expect(failures.some((e) => e.includes('FluxAlloy.exe'))).toBe(true)
    expect(failures.some((e) => e.includes('engines:prepare:win'))).toBe(true)
  })

  it('collectWinUnpackedLayoutFailures OK when all checks pass', async () => {
    const checks = listWinUnpackedLayoutChecks(unpacked)
    const present = new Set(checks.map((c) => c.path))
    const failures = await collectWinUnpackedLayoutFailures(unpacked, {
      fileNonEmpty: (p) => present.has(p),
      dirExists: (p) => present.has(p)
    })
    expect(failures).toEqual([])
  })

  it('formatWinUnpackedLayoutVerifyDiagnosticLines annotates layout', () => {
    const checks = listWinUnpackedLayoutChecks(unpacked)
    const lines = formatWinUnpackedLayoutVerifyDiagnosticLines(repo, (p) => p === checks[0]!.path)
    expect(lines[0]).toContain('verify:win-unpacked')
    expect(lines.some((l) => l.includes('FLUXALLOY_SKIP_PACK_VERIFY'))).toBe(true)
    expect(lines).toContain('layout: FluxAlloy.exe (present)')
    expect(lines).toContain('layout: resources/bin (missing)')
  })
})
