import { describe, expect, it } from 'vitest'

import { buildTrackRows } from '../../src/main/ffprobe-service'

describe('ffprobe-service buildTrackRows', () => {
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

  it('video detail: SDR — нетипичный color_transfer в сводке, если не дублирует gamut', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 720,
          height: 576,
          color_primaries: 'bt470bg',
          color_space: 'bt470bg',
          color_transfer: 'smpte170m'
        }
      ],
      null
    )
    expect(row?.detail).toContain('bt470bg')
    expect(row?.detail).toContain('smpte170m')
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

  it('subtitle detail обрезает длинный tags.title многоточием', () => {
    const longTitle = `${'L'.repeat(70)}tail`
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'subtitle',
          codec_name: 'mov_text',
          tags: { title: longTitle }
        }
      ],
      null
    )
    expect(row?.detail).toContain('…')
    expect(row?.detail).not.toContain('tail')
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
    expect(row?.detail.length ?? 0).toBeLessThan(long.length + 80)
  })

  it('video detail включает language/title/handler_name без дубля handler=title', () => {
    const rows = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1920,
          height: 1080,
          tags: { language: 'rus', title: 'Main feature', handler_name: 'VideoHandler' }
        },
        {
          index: 1,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1280,
          height: 720,
          tags: { title: 'Angles', handler_name: 'Angles' }
        }
      ],
      null
    )

    expect(rows[0]?.detail).toContain('rus')
    expect(rows[0]?.detail).toContain('Main feature')
    expect(rows[0]?.detail).toContain('VideoHandler')
    expect((rows[1]?.detail.match(/Angles/g) ?? []).length).toBe(1)
  })

  it('audio detail включает language/title/handler_name без дубля handler=title', () => {
    const rows = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'audio',
          codec_name: 'aac',
          channels: 2,
          sample_rate: '48000',
          tags: { language: 'eng', title: 'Director commentary', handler_name: 'SoundHandler' }
        },
        {
          index: 1,
          codec_type: 'audio',
          codec_name: 'aac',
          channels: 2,
          sample_rate: '48000',
          tags: { title: 'English', handler_name: 'English' }
        }
      ],
      null
    )

    expect(rows[0]?.detail).toContain('eng')
    expect(rows[0]?.detail).toContain('Director commentary')
    expect(rows[0]?.detail).toContain('SoundHandler')
    expect((rows[1]?.detail.match(/English/g) ?? []).length).toBe(1)
  })

  it('audio detail без bits_per_coded_sample — без «bpc»', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'audio',
          codec_name: 'aac',
          channels: 2,
          sample_rate: '44100'
        }
      ],
      null
    )
    expect(row?.detail).not.toMatch(/\bbpc\b/)
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
})
