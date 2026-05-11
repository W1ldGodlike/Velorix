import { describe, expect, it } from 'vitest'

import { buildTrackRows } from '../../src/main/ffprobe-service'

describe('ffprobe-service buildTrackRows', () => {
  it('audio detail включает codec_tag_string (FourCC), если ffprobe отдал', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 1,
          codec_type: 'audio',
          codec_name: 'aac',
          channels: 2,
          sample_rate: '48000',
          channel_layout: 'stereo',
          codec_tag_string: 'mp4a'
        }
      ],
      120
    )
    expect(row?.detail).toContain('mp4a')
  })

  it('audio detail без codec_tag_string не содержит пустых токенов FourCC', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'audio',
          codec_name: 'flac',
          channels: 2,
          sample_rate: '44100'
        }
      ],
      null
    )
    expect(row?.detail).not.toMatch(/\bN\/A\b/i)
  })
})
