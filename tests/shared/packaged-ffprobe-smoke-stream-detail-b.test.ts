import { describe, expect, it } from 'vitest'

import {
  isPackagedFfprobeProbeJsonParsableByContainerRegistry,
  isPackagedFfprobeProbeJsonParsableByStreamDetailFields,
  isPackagedFfprobeProbeJsonParsableForSmoke
} from '../../src/shared/packaged-ffprobe-smoke'

const streamDetailBase = {
  streams: [{ codec_type: 'video' }],
  format: { format_name: 'mp4', nb_streams: '1' }
}

describe('packaged-ffprobe-smoke (stream detail — b)', () => {
  it('optional stream fields (b)', () => {
    const base = streamDetailBase
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ sample_fmt: 42 }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ display_aspect_ratio: 42 }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ sample_aspect_ratio: 42 }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ channel_layout: { stereo: true } }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [
          {
            start_pts: '1024',
            codec_tag_string: 'avc1',
            codec_tag: '0x31637661',
            tags: {
              language: 'eng',
              stereo_mode: '2',
              rotate: '90',
              title: 'Clip',
              handler_name: 'VideoHandler'
            }
          }
        ]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ tags: { title: { nested: true } } }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ tags: { handler_name: { nested: true } } }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ tags: { rotate: { deg: 90 } } }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ start_pts: 'not-ticks' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ codec_tag: 'not-a-tag' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ tags: 'not-an-object' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [
          {
            color_space: 'bt709',
            color_primaries: 'bt709',
            color_transfer: 'bt709',
            color_range: 'tv',
            field_order: 'progressive',
            chroma_location: 'left',
            bits_per_raw_sample: '8',
            bits_per_coded_sample: '10',
            coded_width: '1920',
            coded_height: '1080',
            extradata_size: '48'
          }
        ]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ color_space: 42 }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ color_primaries: 42 }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ color_range: 42 }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ color_trc: 42 }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ coded_width: '0' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [
          {
            index: '0',
            refs: '4',
            has_b_frames: '2',
            closed_captions: '0',
            is_avc: '1',
            ticks_per_frame: '2',
            initial_padding: '0',
            disposition: { default: 1, forced: 0 }
          }
        ]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ disposition: { default: 'yes' } }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ id: '0x1e0' }]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ id: 'not-hex' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ stream_index: '1', nb_read_frames: '1200', nb_read_packets: '900' }]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ nb_read_packets: 'not-a-count' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ stream_index: 'not-an-index' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [
          {
            side_data_list: [
              { side_data_type: 'Mastering display metadata', max_luminance: '1000' }
            ]
          }
        ]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ side_data_list: [{}] }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableForSmoke({
        streams: [{ start_time: '1.0' }],
        format: { format_name: 'mp4', nb_streams: '1' }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableForSmoke({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1' },
        chapters: [{ id: 0, start_time: '0', end_time: '12.5', tags: { title: 'A' } }]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableForSmoke({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1' },
        chapters: [{ start_time: 'nope', end_time: '1' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableForSmoke({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1' },
        chapters: [{ start_time: '0', end_time: '1', tags: 'not-an-object' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableForSmoke({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1' },
        chapters: [[]]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableForSmoke({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1' },
        chapters: {}
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          tags: { major_brand: { not: 'scalar' } }
        }
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          tags: { creation_time: { not: 'scalar' } }
        }
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ tags: { stereo_mode: { not: 'scalar' } } }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableForSmoke({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1' },
        chapters: [null]
      })
    ).toBe(false)
  })
})
