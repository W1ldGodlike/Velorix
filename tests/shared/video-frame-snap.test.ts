import { describe, expect, it } from 'vitest'

import { snapSeekTimeSec } from '../../src/shared/video-frame-snap'

describe('snapSeekTimeSec', () => {
  it('clamp без fps — только ограничение длины', () => {
    expect(snapSeekTimeSec(5, 10, null)).toBe(5)
    expect(snapSeekTimeSec(-1, 10, undefined)).toBe(0)
    expect(snapSeekTimeSec(100, 10, undefined)).toBeCloseTo(9.98, 5)
  })

  it('30 fps — к ближайшему кадру', () => {
    const d = 2
    expect(snapSeekTimeSec(0.008, d, 30)).toBeCloseTo(0, 10)
    expect(snapSeekTimeSec(1 / 60, d, 30)).toBeCloseTo(1 / 30, 10)
    expect(snapSeekTimeSec(0.049, d, 30)).toBeCloseTo(1 / 30, 10)
    expect(snapSeekTimeSec(0.046, d, 30)).toBeCloseTo(1 / 30, 10)
  })

  it('у верхней границы не выходит за maxT', () => {
    const d = 1
    expect(snapSeekTimeSec(d, d, 30)).toBeLessThanOrEqual(0.98)
    expect(snapSeekTimeSec(d, d, 30)).toBeCloseTo(Math.floor((d - 0.02) * 30) / 30, 5)
  })
})
