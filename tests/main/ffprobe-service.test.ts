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

  it('video detail включает компактную HDR-метку из color_transfer/color_primaries', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'hevc',
          width: 3840,
          height: 2160,
          color_transfer: 'smpte2084',
          color_primaries: 'bt2020'
        }
      ],
      null
    )
    expect(row?.detail).toContain('PQ·bt2020')
  })

  it('video detail: SDR color_range pc → «full range» в сводке', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1280,
          height: 720,
          color_transfer: 'bt709',
          color_primaries: 'bt709',
          color_range: 'pc'
        }
      ],
      null
    )
    expect(row?.detail).toContain('full range')
  })

  it('video detail: SDR wide — primaries/space не bt709 → компактная склейка', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1920,
          height: 1080,
          color_transfer: 'bt709',
          color_primaries: 'bt2020',
          color_space: 'bt2020nc'
        }
      ],
      null
    )
    expect(row?.detail).toContain('bt2020·bt2020nc')
  })

  it('subtitle detail включает tags.handler_name, если отличается от title', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'subtitle',
          codec_name: 'mov_text',
          tags: { title: 'SDH', handler_name: 'SubtitleHandler' }
        }
      ],
      null
    )
    expect(row?.detail).toContain('SDH')
    expect(row?.detail).toContain('SubtitleHandler')
  })

  it('subtitle detail не дублирует tags.handler_name, если совпадает с title', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'subtitle',
          codec_name: 'mov_text',
          tags: { title: 'English', handler_name: 'English' }
        }
      ],
      null
    )
    expect((row?.detail.match(/English/g) ?? []).length).toBe(1)
  })

  it('video/audio/subtitle detail включает tags.creation_time как created YYYY-MM-DD', () => {
    const rows = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1280,
          height: 720,
          tags: { creation_time: '2022-11-07T10:00:00.000000Z' }
        },
        {
          index: 1,
          codec_type: 'audio',
          codec_name: 'aac',
          channels: 2,
          sample_rate: '48000',
          tags: { creation_time: '2022-11-07T12:00:00.000000Z' }
        },
        {
          index: 2,
          codec_type: 'subtitle',
          codec_name: 'mov_text',
          tags: { creation_time: '2022-11-07T14:00:00.000000Z' }
        }
      ],
      null
    )
    expect(rows[0]?.detail).toContain('created 2022-11-07')
    expect(rows[1]?.detail).toContain('created 2022-11-07')
    expect(rows[2]?.detail).toContain('created 2022-11-07')
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

  it('video detail: max_bit_rate заметно выше bit_rate → «max … Mb/s»', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1920,
          height: 1080,
          bit_rate: '5000000',
          max_bit_rate: '12000000'
        }
      ],
      null
    )
    expect(row?.detail).toContain('max 12.00 Mb/s')
  })

  it('video detail: max_bit_rate≈bit_rate — не дублируем пик в сводке', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1280,
          height: 720,
          bit_rate: '5000000',
          max_bit_rate: '5050000'
        }
      ],
      null
    )
    expect(row?.detail).not.toMatch(/\bmax\b/i)
  })

  it('audio detail: только max_bit_rate — показываем пик', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 1,
          codec_type: 'audio',
          codec_name: 'aac',
          channels: 2,
          sample_rate: '48000',
          max_bit_rate: '320000'
        }
      ],
      null
    )
    expect(row?.detail).toContain('max 320 kb/s')
  })

  it('video detail: ненулевой closed_captions → CEA-608/708', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1280,
          height: 720,
          closed_captions: 1
        }
      ],
      null
    )
    expect(row?.detail).toContain('CEA-608/708')
  })

  it('video detail: H.264 + is_avc=0 → Annex-B', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1920,
          height: 1080,
          is_avc: 0
        }
      ],
      null
    )
    expect(row?.detail).toContain('Annex-B')
  })

  it('video detail: H.264 + is_avc=1 — без Annex-B', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1920,
          height: 1080,
          is_avc: 1
        }
      ],
      null
    )
    expect(row?.detail).not.toContain('Annex-B')
  })

  it('video/audio/subtitle detail показывает ненулевой start_pts с time_base', () => {
    const rows = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1920,
          height: 1080,
          start_pts: 90000,
          time_base: '1/90000'
        },
        {
          index: 1,
          codec_type: 'audio',
          codec_name: 'aac',
          channels: 2,
          sample_rate: '48000',
          start_pts: '1024',
          time_base: '1/48000'
        },
        {
          index: 2,
          codec_type: 'subtitle',
          codec_name: 'mov_text',
          start_pts: '2000',
          time_base: '1/1000'
        }
      ],
      null
    )

    expect(rows[0]?.detail).toContain('pts 90000@1/90000')
    expect(rows[1]?.detail).toContain('pts 1024@1/48000')
    expect(rows[2]?.detail).toContain('pts 2000@1/1000')
  })

  it('video detail не показывает тривиальный start_pts=0', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1280,
          height: 720,
          start_pts: 0,
          time_base: '1/90000'
        }
      ],
      null
    )

    expect(row?.detail).not.toMatch(/\bpts\b/)
  })

  it('audio detail включает ReplayGain track/album из тегов (нижний/верхний регистр ключей)', () => {
    const [lower] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'audio',
          codec_name: 'flac',
          channels: 2,
          sample_rate: '44100',
          tags: {
            replaygain_track_gain: '-1.23 dB',
            replaygain_album_gain: '-2.00 dB'
          }
        }
      ],
      null
    )
    expect(lower?.detail).toContain('RG tr -1.23 dB')
    expect(lower?.detail).toContain('RG al -2.00 dB')

    const [upper] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'audio',
          codec_name: 'vorbis',
          channels: 2,
          sample_rate: '48000',
          tags: { REPLAYGAIN_TRACK_GAIN: '+0.50 dB' }
        }
      ],
      null
    )
    expect(upper?.detail).toContain('RG tr +0.50 dB')
  })
})
