import { describe, expect, it } from 'vitest'

import { resolveFfmpegVideoSpriteSchedule } from '../../src/shared/ffmpeg-video-sprite-schedule'

describe('resolveFfmpegVideoSpriteSchedule', () => {
  it('computes sample fps from cell count and duration', () => {
    const r = resolveFfmpegVideoSpriteSchedule({
      durationSec: 60,
      columns: 4,
      rows: 3
    })
    expect(r).toEqual({
      ok: true,
      columns: 4,
      rows: 3,
      cellCount: 12,
      sampleFps: 0.2
    })
  })

  it('rejects too many cells', () => {
    const r = resolveFfmpegVideoSpriteSchedule({
      durationSec: 10,
      columns: 15,
      rows: 15
    })
    expect(r).toEqual({ ok: false, error: 'too_many_cells' })
  })

  it('rejects invalid grid', () => {
    expect(resolveFfmpegVideoSpriteSchedule({ durationSec: 10, columns: 0, rows: 2 })).toEqual({
      ok: false,
      error: 'invalid_grid'
    })
  })
})
