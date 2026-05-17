import { describe, expect, it } from 'vitest'

import { formatFfprobeStreamDurationTsDetail } from '../../src/shared/ffprobe-stream-duration-ts'

describe('formatFfprobeStreamDurationTsDetail', () => {
  it('formats positive ticks', () => {
    expect(formatFfprobeStreamDurationTsDetail('90000')).toBe('dur_ts 90000')
    expect(formatFfprobeStreamDurationTsDetail(48000)).toBe('dur_ts 48000')
  })

  it('skips empty and zero', () => {
    expect(formatFfprobeStreamDurationTsDetail('0')).toBeNull()
    expect(formatFfprobeStreamDurationTsDetail('N/A')).toBeNull()
    expect(formatFfprobeStreamDurationTsDetail(undefined)).toBeNull()
  })
})
