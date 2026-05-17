import { describe, expect, it } from 'vitest'

import {
  formatFfprobeStreamDurationTsDetail,
  parseFfprobeTickCount
} from '../../src/shared/ffprobe-stream-duration-ts'

describe('parseFfprobeTickCount', () => {
  it('parses positive ticks', () => {
    expect(parseFfprobeTickCount('90000')).toBe(90000)
    expect(parseFfprobeTickCount(48000)).toBe(48000)
  })

  it('skips empty and zero', () => {
    expect(parseFfprobeTickCount('0')).toBeNull()
    expect(parseFfprobeTickCount('N/A')).toBeNull()
    expect(parseFfprobeTickCount(undefined)).toBeNull()
  })
})

describe('formatFfprobeStreamDurationTsDetail', () => {
  it('formats via parseFfprobeTickCount', () => {
    expect(formatFfprobeStreamDurationTsDetail('90000')).toBe('dur_ts 90000')
  })
})
