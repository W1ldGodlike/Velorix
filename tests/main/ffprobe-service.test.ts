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

  it('video/audio/subtitle detail включает tags.encoder, если ffprobe отдал', () => {
    const rows = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1280,
          height: 720,
          tags: { encoder: 'Lavc59.37.100 libx264' }
        },
        {
          index: 1,
          codec_type: 'audio',
          codec_name: 'aac',
          channels: 2,
          sample_rate: '48000',
          tags: { encoder: 'Lavc59.37.100 aac' }
        },
        {
          index: 2,
          codec_type: 'subtitle',
          codec_name: 'subrip',
          tags: { encoder: 'SRT Writer' }
        }
      ],
      null
    )
    expect(rows[0]?.detail).toContain('Lavc59.37.100 libx264')
    expect(rows[1]?.detail).toContain('Lavc59.37.100 aac')
    expect(rows[2]?.detail).toContain('SRT Writer')
  })

  it('video detail включает tags.timecode как TC …, если ffprobe отдал', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1920,
          height: 1080,
          tags: { timecode: '01:00:00:00' }
        }
      ],
      null
    )
    expect(row?.detail).toContain('TC 01:00:00:00')
  })

  it('video detail добавляет pix_fmt, если не тривиальный yuv420p/yuvj420p', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'hevc',
          width: 3840,
          height: 2160,
          pix_fmt: 'yuv420p10le'
        }
      ],
      null
    )
    expect(row?.detail).toContain('yuv420p10le')
  })

  it('video detail не дублирует стандартный pix_fmt yuv420p', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1280,
          height: 720,
          pix_fmt: 'yuv420p'
        }
      ],
      null
    )
    expect(row?.detail).not.toMatch(/\byuv420p\b/)
  })

  it('attachment/detail для прочих потоков включает codec_name перед filename', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 2,
          codec_type: 'attachment',
          codec_name: 'mjpeg',
          tags: { filename: 'cover.jpg', mimetype: 'image/jpeg' }
        }
      ],
      null
    )
    expect(row?.detail).toMatch(/^mjpeg/)
    expect(row?.detail).toContain('cover.jpg')
  })

  it('encoder в detail обрезается при длинной строке', () => {
    const long = `${'A'.repeat(70)}tail`
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 640,
          height: 360,
          tags: { encoder: long }
        }
      ],
      null
    )
    expect(row?.detail).toContain('…')
    expect(row?.detail).not.toContain('tail')
    expect((row?.detail.length ?? 0)).toBeLessThan(long.length + 80)
  })
})
