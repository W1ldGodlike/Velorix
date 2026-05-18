import { describe, expect, it } from 'vitest'

import {
  formatOwnerManualSmokeBundleReportHeaderLines,
  prependOwnerManualSmokeReportHeader
} from '../../src/shared/owner-manual-smoke-bundle-report-header'

describe('owner-manual-smoke-bundle-report-header', () => {
  it('formats app and build lines', () => {
    const lines = formatOwnerManualSmokeBundleReportHeaderLines({
      appName: 'FluxAlloy',
      appVersion: '0.1.0',
      buildId: 'abc123',
      builtAtUtc: '2026-05-18T10:00:00.000Z',
      electronVersion: '34.0.0'
    })
    expect(lines.join('\n')).toContain('FluxAlloy 0.1.0')
    expect(lines.join('\n')).toContain('buildId: abc123')
    expect(lines.join('\n')).toContain('electron: 34.0.0')
  })

  it('prepends header before checklist body', () => {
    const out = prependOwnerManualSmokeReportHeader('=== HiDPI ===', ['report: owner-manual-smoke'])
    expect(out.startsWith('report: owner-manual-smoke')).toBe(true)
    expect(out).toContain('=== HiDPI ===')
  })
})
