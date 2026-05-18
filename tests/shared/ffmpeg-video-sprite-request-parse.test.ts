import { describe, expect, it } from 'vitest'

import { parseFfmpegVideoSpriteRequest } from '../../src/shared/ffmpeg-video-sprite-request-parse'

describe('parseFfmpegVideoSpriteRequest', () => {
  it('parses valid payload', () => {
    const r = parseFfmpegVideoSpriteRequest({
      inputPath: 'C:\\clip.mp4',
      durationSec: 12,
      columns: 4,
      rows: 3,
      format: 'png',
      uiLocale: 'en'
    })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.payload).toMatchObject({
        inputPath: 'C:\\clip.mp4',
        durationSec: 12,
        columns: 4,
        rows: 3,
        format: 'png',
        uiLocale: 'en'
      })
    }
  })

  it('rejects invalid grid', () => {
    const r = parseFfmpegVideoSpriteRequest({
      inputPath: 'a.mp4',
      durationSec: 10,
      columns: 0,
      rows: 2,
      format: 'jpg'
    })
    expect(r).toEqual({ ok: false, error: 'invalid_grid' })
  })
})
