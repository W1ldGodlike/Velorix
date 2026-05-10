import { describe, expect, it } from 'vitest'

import { buildTimelineRulerTicks, pickTimelineRulerStepSec } from '../../src/shared/timeline-ruler'

describe('timeline-ruler', (): void => {
  it('pickTimelineRulerStepSec выбирает читаемый шаг под длину окна', (): void => {
    expect(pickTimelineRulerStepSec(10, 5)).toBe(2)
    expect(pickTimelineRulerStepSec(60, 6)).toBe(10)
    expect(pickTimelineRulerStepSec(3600, 6)).toBe(500)
  })

  it('buildTimelineRulerTicks покрывает концы окна монотонно', (): void => {
    const step = pickTimelineRulerStepSec(10, 5)
    const ticks = buildTimelineRulerTicks(1.25, 11.25, step)
    expect(ticks.length).toBeGreaterThan(2)
    expect(ticks[0]).toBeGreaterThanOrEqual(1.25)
    expect(ticks[ticks.length - 1]).toBeLessThanOrEqual(11.25 + step * 0.01)
  })
})
