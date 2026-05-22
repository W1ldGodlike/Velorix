import { describe, expect, it } from 'vitest'

import { parseImageSlideshowRequest } from '../../src/shared/ffmpeg-image-slideshow-parse'

describe('parseImageSlideshowRequest §7.5.4', () => {
  it('defaults transition to fade', () => {
    const parsed = parseImageSlideshowRequest({
      imagePaths: ['a.png', 'b.png'],
      slideDurationSec: 3
    })
    expect(parsed.ok).toBe(true)
    if (parsed.ok) {
      expect(parsed.payload.transition).toBe('fade')
    }
  })

  it('rejects unknown transition', () => {
    const parsed = parseImageSlideshowRequest({
      imagePaths: ['a.png', 'b.png'],
      slideDurationSec: 3,
      transition: 'dissolve'
    })
    expect(parsed).toEqual({ ok: false, error: 'invalid_transition' })
  })
})
