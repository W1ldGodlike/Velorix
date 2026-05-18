import { describe, expect, it } from 'vitest'

import {
  buildSupportZipBuildInfoLines,
  formatAboutBuildIdDisplay,
  formatBuiltAtUtcLine,
  readAppBuildInfo
} from '../../src/shared/app-build-info'

describe('app-build-info §4.5', () => {
  it('readAppBuildInfo returns committed dev defaults', () => {
    const info = readAppBuildInfo()
    expect(info.buildId).toBe('dev')
    expect(info.builtAtUtc).toBeNull()
  })

  it('formatBuiltAtUtcLine formats ISO to UTC label', () => {
    expect(formatBuiltAtUtcLine('2026-05-18T06:00:00.000Z')).toBe('2026-05-18 06:00:00 UTC')
    expect(formatBuiltAtUtcLine(null)).toBeNull()
  })

  it('formatAboutBuildIdDisplay trims and falls back', () => {
    expect(formatAboutBuildIdDisplay(' abc ')).toBe('abc')
    expect(formatAboutBuildIdDisplay('')).toBe('unknown')
  })

  it('buildSupportZipBuildInfoLines omits builtAt when null', () => {
    expect(buildSupportZipBuildInfoLines({ buildId: 'dev', builtAtUtc: null })).toEqual([
      'buildId: dev'
    ])
    expect(
      buildSupportZipBuildInfoLines({
        buildId: '4f14f86',
        builtAtUtc: '2026-05-18T06:00:00.000Z'
      })
    ).toEqual(['buildId: 4f14f86', 'builtAtUtc: 2026-05-18 06:00:00 UTC'])
  })
})
