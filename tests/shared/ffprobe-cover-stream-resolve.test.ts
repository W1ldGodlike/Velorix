import { describe, expect, it } from 'vitest'

import { resolveFfprobeCoverStreamIndex } from '../../src/shared/ffprobe-cover-stream-resolve'

describe('ffprobe-cover-stream-resolve', () => {
  it('attached_pic stream', () => {
    const idx = resolveFfprobeCoverStreamIndex([
      { index: 0, codec_type: 'audio', codec_name: 'aac' },
      { index: 1, codec_type: 'video', codec_name: 'mjpeg', disposition: { attached_pic: 1 } }
    ])
    expect(idx).toBe(1)
  })

  it('single mjpeg video fallback', () => {
    const idx = resolveFfprobeCoverStreamIndex([
      { index: 0, codec_type: 'audio', codec_name: 'mp3' },
      { index: 2, codec_type: 'video', codec_name: 'mjpeg' }
    ])
    expect(idx).toBe(2)
  })

  it('no cover when ambiguous', () => {
    const idx = resolveFfprobeCoverStreamIndex([
      { index: 0, codec_type: 'video', codec_name: 'h264' },
      { index: 1, codec_type: 'video', codec_name: 'mjpeg' }
    ])
    expect(idx).toBeNull()
  })
})
