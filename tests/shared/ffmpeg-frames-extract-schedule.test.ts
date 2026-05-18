import { describe, expect, it } from 'vitest'

import { buildFfmpegFrameExtractTimestamps } from '../../src/shared/ffmpeg-frames-extract-schedule'

describe('buildFfmpegFrameExtractTimestamps', () => {
  it('interval mode — step across duration', () => {
    const r = buildFfmpegFrameExtractTimestamps({
      durationSec: 10,
      mode: 'interval',
      intervalSec: 2,
      frameCount: null,
      manualTimesSec: null
    })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.times[0]).toBe(0)
      expect(r.times).toContain(10)
      expect(r.times.length).toBe(6)
    }
  })

  it('count mode — evenly spaced', () => {
    const r = buildFfmpegFrameExtractTimestamps({
      durationSec: 30,
      mode: 'count',
      intervalSec: null,
      frameCount: 4,
      manualTimesSec: null
    })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.times).toEqual([0, 10, 20, 30])
    }
  })

  it('manual mode — parses and clamps timestamps', () => {
    const r = buildFfmpegFrameExtractTimestamps({
      durationSec: 20,
      mode: 'manual',
      intervalSec: null,
      frameCount: null,
      manualTimesSec: [0, 5, 25, 5]
    })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.times).toEqual([0, 5, 20])
    }
  })

  it('rejects too many frames', () => {
    const r = buildFfmpegFrameExtractTimestamps({
      durationSec: 10000,
      mode: 'interval',
      intervalSec: 1,
      frameCount: null,
      manualTimesSec: null
    })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.error).toBe('too_many_frames')
    }
  })
})
