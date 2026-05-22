import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  collectLinuxUnpackedLayoutFailures,
  formatLinuxUnpackedLayoutVerifyDiagnosticLines,
  linuxUnpackedExecutableCandidates,
  linuxUnpackedLayoutRoot,
  listLinuxUnpackedLayoutChecks,
  listLinuxUnpackedOptionalEngineWarnings
} from '../../src/shared/linux-unpacked-layout-verify'

describe('linux-unpacked-layout-verify §19', () => {
  const repo = '/repo'
  const unpacked = linuxUnpackedLayoutRoot(repo)

  it('listLinuxUnpackedLayoutChecks covers extraResources', () => {
    const checks = listLinuxUnpackedLayoutChecks(unpacked)
    expect(checks.some((c) => c.label === 'resources/bin')).toBe(true)
    expect(checks.some((c) => c.label === 'resources/Help')).toBe(true)
    expect(checks.some((c) => c.label.includes('trusted_hashes.json'))).toBe(true)
  })

  it('collectLinuxUnpackedLayoutFailures reports missing executable', async () => {
    const failures = await collectLinuxUnpackedLayoutFailures(unpacked, {
      fileNonEmpty: async () => false,
      dirExists: async () => false
    })
    expect(failures.some((e) => e.includes('fluxalloy'))).toBe(true)
  })

  it('collectLinuxUnpackedLayoutFailures OK when exe and resources present', async () => {
    const exe = linuxUnpackedExecutableCandidates(unpacked)[0]!
    const checks = listLinuxUnpackedLayoutChecks(unpacked)
    const present = new Set([exe, ...checks.map((c) => c.path)])
    const failures = await collectLinuxUnpackedLayoutFailures(unpacked, {
      fileNonEmpty: (p) => present.has(p),
      dirExists: (p) => present.has(p)
    })
    expect(failures).toEqual([])
  })

  it('listLinuxUnpackedOptionalEngineWarnings when engines missing', async () => {
    const bundledBin = join(unpacked, 'resources', 'bin')
    const warnings = await listLinuxUnpackedOptionalEngineWarnings(unpacked, {
      fileNonEmpty: async () => false,
      dirExists: async (p) => p === bundledBin
    })
    expect(warnings.length).toBe(3)
    expect(warnings[0]).toContain('optional:')
  })

  it('formatLinuxUnpackedLayoutVerifyDiagnosticLines annotates layout', () => {
    const exe = linuxUnpackedExecutableCandidates(unpacked)[0]!
    const lines = formatLinuxUnpackedLayoutVerifyDiagnosticLines(repo, (p) => p === exe)
    expect(lines[0]).toContain('verify:linux-unpacked')
    expect(lines.some((l) => l.includes('pack:linux:dir'))).toBe(true)
    expect(lines.some((l) => l.includes('trusted_hashes.json'))).toBe(true)
  })
})
