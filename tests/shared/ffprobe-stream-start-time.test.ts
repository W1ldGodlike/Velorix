import { describe, expect, it } from 'vitest'

import { formatFfprobeStreamStartTime } from '../../src/shared/ffprobe-stream-start-time'

describe('formatFfprobeStreamStartTime', () => {
  it('возвращает null для пустого / N/A / нуля', () => {
    expect(formatFfprobeStreamStartTime(undefined)).toBeNull()
    expect(formatFfprobeStreamStartTime('')).toBeNull()
    expect(formatFfprobeStreamStartTime('N/A')).toBeNull()
    expect(formatFfprobeStreamStartTime('0.000000')).toBeNull()
    expect(formatFfprobeStreamStartTime('0')).toBeNull()
    expect(formatFfprobeStreamStartTime('0.0002')).toBeNull()
  })

  it('миллисекунды для |t| < 1 с', () => {
    expect(formatFfprobeStreamStartTime('0.021000')).toBe('start +21ms')
    expect(formatFfprobeStreamStartTime('-0.021000')).toBe('start −21ms')
  })

  it('секунды для |t| ≥ 1 с', () => {
    expect(formatFfprobeStreamStartTime('1.500000')).toBe('start +1.5s')
    expect(formatFfprobeStreamStartTime('-2.300000')).toBe('start −2.3s')
  })
})
