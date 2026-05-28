import { describe, expect, it } from 'vitest'

import {
  applyExportTrimIn,
  buildSeekTrimTrackBackground
} from '../../src/renderer/src/lib/export-trim-markers'

describe('buildSeekTrimTrackBackground', () => {
  it('returns gradient for trim span', () => {
    const bg = buildSeekTrimTrackBackground({ inSec: 10, outSec: 30 }, 100)
    expect(bg).toContain('linear-gradient')
    expect(bg).toContain('10%')
    expect(bg).toContain('30%')
  })

  it('returns null without trim', () => {
    expect(buildSeekTrimTrackBackground(null, 100)).toBeNull()
  })
})

describe('applyExportTrimIn', () => {
  it('keeps existing out when valid', () => {
    expect(applyExportTrimIn(5, 100, { inSec: 0, outSec: 50 })).toEqual({ inSec: 5, outSec: 50 })
  })
})
