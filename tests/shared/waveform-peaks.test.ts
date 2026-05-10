import { describe, expect, it } from 'vitest'

import { computeWaveformPeakEnvelopeMono } from '../../src/shared/waveform-peaks'

describe('computeWaveformPeakEnvelopeMono', (): void => {
  it('нормализует пики в диапазон [0..1]', (): void => {
    const samples = Float32Array.from([0, 0.5, -0.25, -1, 0.1])
    const peaks = computeWaveformPeakEnvelopeMono(samples, 2)
    expect(peaks.length).toBe(2)
    expect(Math.max(...peaks)).toBeCloseTo(1, 6)
    expect(peaks.every((x) => x >= 0 && x <= 1)).toBe(true)
  })

  it('равномерное молчание даёт нули', (): void => {
    const samples = new Float32Array(100)
    const peaks = computeWaveformPeakEnvelopeMono(samples, 10)
    expect(peaks.every((x) => x === 0)).toBe(true)
  })
})
