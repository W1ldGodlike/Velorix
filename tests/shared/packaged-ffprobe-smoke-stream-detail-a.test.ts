import { describe, expect, it } from 'vitest'

import { isPackagedFfprobeProbeJsonParsableByStreamDetailFields } from '../../src/shared/packaged-ffprobe-smoke'

const streamDetailBase = {
  streams: [{ codec_type: 'video' }],
  format: { format_name: 'mp4', nb_streams: '1' }
}

describe('packaged-ffprobe-smoke (stream detail — a)', () => {
  it('optional stream fields (a)', () => {
    const base = streamDetailBase
    expect(isPackagedFfprobeProbeJsonParsableByStreamDetailFields(base)).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ duration_ts: '48000', time_base: '1/48000', codec_time_base: '1/50' }]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ duration_ts: 'not-a-number' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ start_time: 'bad' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ time_base: 'not-a-fraction' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ codec_time_base: 'not-a-fraction' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [
          {
            codec_name: 'h264',
            codec_long_name: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10',
            tags: { stereo_mode: '2' }
          }
        ]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ codec_type: 'audio' }]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ codec_type: 'not-a-kind' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ avg_frame_rate: '24000/1001', r_frame_rate: '24/1' }]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ avg_frame_rate: 'not-a-rate' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ bit_rate: '2500000', max_bit_rate: '3000000', nb_frames: '720' }]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ nb_frames: 'not-a-number' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ bit_rate: 'not-bps' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ max_bit_rate: 'not-bps' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ width: '1920', height: '1080', pix_fmt: 'yuv420p' }]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ width: '0' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ extradata_size: 'not-bytes' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ refs: 'not-refs' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ has_b_frames: 'not-b' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ ticks_per_frame: 'not-ticks' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ stream_index: 'not-index' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ closed_captions: 'not-cc' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ is_avc: 'not-avc' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ initial_padding: 'not-pad' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ nb_read_frames: 'not-frames' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ index: 'not-index' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ level: 'not-level' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ bits_per_raw_sample: 'not-bits' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ bits_per_coded_sample: 'not-coded' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ chroma_location: 42 }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ field_order: 42 }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ codec_tag_string: 42 }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ color_transfer: 42 }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [
          {
            sample_aspect_ratio: '1:1',
            display_aspect_ratio: '16:9',
            channel_layout: 'stereo',
            channels: '2'
          }
        ]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ sample_aspect_ratio: 'N/A', display_aspect_ratio: 'n/a' }]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ channel_layout: 42 }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ channels: '0' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ channels: 'not-a-number' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [
          {
            codec_name: 'aac',
            sample_rate: '48000',
            sample_fmt: 'fltp',
            profile: 'LC',
            level: '1',
            bits_per_sample: '16'
          }
        ]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ sample_rate: 'not-hz' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ profile: 42 }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ codec_name: 42 }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ codec_type: 42 }]
      })
    ).toBe(false)
  })
})
