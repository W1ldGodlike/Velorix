import { describe, expect, it } from 'vitest'

import { formatFfprobeCodecLongNameDetail } from '../../src/shared/ffprobe-codec-long-name'

describe('formatFfprobeCodecLongNameDetail', () => {
  it('returns long name when it adds information', () => {
    expect(formatFfprobeCodecLongNameDetail('h264', 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10')).toBe(
      'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10'
    )
    expect(formatFfprobeCodecLongNameDetail('subrip', 'SubRip subtitle')).toBe('SubRip subtitle')
  })

  it('skips duplicate short/long', () => {
    expect(formatFfprobeCodecLongNameDetail('aac', 'aac')).toBeNull()
    expect(formatFfprobeCodecLongNameDetail('h264', 'h264')).toBeNull()
    expect(formatFfprobeCodecLongNameDetail(undefined, undefined)).toBeNull()
  })
})
