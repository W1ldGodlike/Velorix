import { describe, expect, it } from 'vitest'

import { formatFfprobeStreamDurationDetail } from '../../src/shared/ffprobe-stream-duration-detail'

describe('formatFfprobeStreamDurationDetail', () => {
  it('returns null for empty / N/A', () => {
    expect(formatFfprobeStreamDurationDetail(undefined, null)).toBeNull()
    expect(formatFfprobeStreamDurationDetail('', null)).toBeNull()
    expect(formatFfprobeStreamDurationDetail('N/A', null)).toBeNull()
  })

  it('formats when no container duration', () => {
    expect(formatFfprobeStreamDurationDetail('12.5', null)).toBe('dur 12.5s')
    expect(formatFfprobeStreamDurationDetail('3', null)).toBe('dur 3s')
  })

  it('hides when matches container within epsilon', () => {
    expect(formatFfprobeStreamDurationDetail('10.000', 10)).toBeNull()
    expect(formatFfprobeStreamDurationDetail('10.02', 10)).toBeNull()
    expect(formatFfprobeStreamDurationDetail('10.06', 10)).toBe('dur 10.06s')
  })
})
