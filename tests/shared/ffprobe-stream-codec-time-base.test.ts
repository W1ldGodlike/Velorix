import { describe, expect, it } from 'vitest'

import { formatFfprobeStreamCodecTimeBaseDetail } from '../../src/shared/ffprobe-stream-codec-time-base'

describe('formatFfprobeStreamCodecTimeBaseDetail', () => {
  it('shows ctb when distinct from stream time_base', () => {
    expect(formatFfprobeStreamCodecTimeBaseDetail('1/50', '1/90000')).toBe('ctb 1/50')
  })

  it('returns null when codec_time_base matches time_base', () => {
    expect(formatFfprobeStreamCodecTimeBaseDetail('1/90000', '1/90000')).toBeNull()
  })

  it('returns null for trivial codec_time_base', () => {
    expect(formatFfprobeStreamCodecTimeBaseDetail('0/1', '1/90000')).toBeNull()
  })
})
