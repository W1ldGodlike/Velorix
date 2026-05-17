import { describe, expect, it } from 'vitest'

import { formatFfprobeStreamStereoModeDetail } from '../../src/shared/ffprobe-stream-stereo-mode'

describe('formatFfprobeStreamStereoModeDetail', () => {
  it('formats non-zero stereo_mode', () => {
    expect(formatFfprobeStreamStereoModeDetail({ stereo_mode: 'left_right' })).toBe(
      'stereo left_right'
    )
    expect(formatFfprobeStreamStereoModeDetail({ stereo_mode: 2 })).toBe('stereo 2')
  })

  it('skips empty and mono default', () => {
    expect(formatFfprobeStreamStereoModeDetail({ stereo_mode: '0' })).toBeNull()
    expect(formatFfprobeStreamStereoModeDetail(undefined)).toBeNull()
  })
})
