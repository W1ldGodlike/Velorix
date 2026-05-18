import { describe, expect, it } from 'vitest'

import type { MediaProbeSuccess } from '../../src/shared/ffprobe-contract'
import { resolveFfmpegFramesExtractDurationSec } from '../../src/main/ffmpeg-frames-extract-resolve-duration'

function probeSuccess(durationSec: number): MediaProbeSuccess {
  return { ok: true, durationSec, tracks: [], chapters: [], rawJson: '{}' } as unknown as MediaProbeSuccess
}

describe('resolveFfmpegFramesExtractDurationSec', () => {
  it('uses client duration when sufficient', async () => {
    const r = await resolveFfmpegFramesExtractDurationSec({
      durationSecFromClient: 12.5,
      probeMedia: async () => ({ ok: false, error: 'should not probe' })
    })
    expect(r).toEqual({ ok: true, durationSec: 12.5 })
  })

  it('probes when client duration is missing', async () => {
    const r = await resolveFfmpegFramesExtractDurationSec({
      durationSecFromClient: 0,
      probeMedia: async () => probeSuccess(30)
    })
    expect(r).toEqual({ ok: true, durationSec: 30 })
  })
})
