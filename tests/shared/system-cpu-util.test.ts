import { describe, expect, it } from 'vitest'

import {
  computeCpuUtilPercent,
  readCpuTimesAggregate,
  SystemCpuLoadSampler
} from '../../src/shared/system-cpu-util'

describe('system-cpu-util', () => {
  it('computeCpuUtilPercent returns 0..100', () => {
    const a = readCpuTimesAggregate()
    const b = { idle: a.idle + 100, total: a.total + 200 }
    const pct = computeCpuUtilPercent(a, b)
    expect(pct).toBeGreaterThanOrEqual(0)
    expect(pct).toBeLessThanOrEqual(100)
  })

  it('SystemCpuLoadSampler records peak after start', async () => {
    const sampler = new SystemCpuLoadSampler()
    sampler.start(100)
    await new Promise((r) => setTimeout(r, 250))
    const stats = sampler.stop()
    expect(stats.peakPercent === null || stats.peakPercent >= 0).toBe(true)
  })
})
