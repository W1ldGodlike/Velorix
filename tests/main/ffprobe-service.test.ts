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

  it('audio detail: при пустом FourCC показывает hex codec_tag', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'audio',
          codec_name: 'aac',
          channels: 2,
          sample_rate: '48000',
          codec_tag_string: '[0][0][0][0]',
          codec_tag: '0x6134706d'
        }
      ],
      null
    )
    expect(row?.detail).toContain('tag 0x6134706d')
    expect(row?.detail).not.toContain('[0][0][0][0]')
  })

  it('video detail: extradata_size как exdata N B', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1280,
          height: 720,
          extradata_size: 42
        }
      ],
      null
    )
    expect(row?.detail).toContain('exdata 42 B')
  })

  it('video/audio/subtitle detail: nb_frames как N frm при положительном значении', () => {
    const rows = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 640,
          height: 360,
          nb_frames: '1200'
        },
        {
          index: 1,
          codec_type: 'audio',
          codec_name: 'aac',
          channels: 2,
          sample_rate: '48000',
          nb_frames: '2304000'
        },
        {
          index: 2,
          codec_type: 'subtitle',
          codec_name: 'subrip',
          nb_frames: '42'
        }
      ],
      null
    )
    expect(rows[0]?.detail).toContain('1200 frm')
    expect(rows[1]?.detail).toContain('2304000 frm')
    expect(rows[2]?.detail).toContain('42 frm')
  })

  it('audio/video/subtitle detail: initial_padding показывает priming samples', () => {
    const rows = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'audio',
          codec_name: 'aac',
          channels: 2,
          sample_rate: '48000',
          initial_padding: 1024
        },
        {
          index: 1,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1920,
          height: 1080,
          initial_padding: '2'
        },
        {
          index: 2,
          codec_type: 'subtitle',
          codec_name: 'mov_text',
          initial_padding: 1
        }
      ],
      null
    )

    expect(rows[0]?.detail).toContain('pad 1024 smp')
    expect(rows[1]?.detail).toContain('pad 2 smp')
    expect(rows[2]?.detail).toContain('pad 1 smp')
  })

  it('audio detail: нулевой initial_padding не попадает в сводку', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'audio',
          codec_name: 'aac',
          channels: 2,
          sample_rate: '48000',
          initial_padding: 0
        }
      ],
      null
    )

    expect(row?.detail).not.toMatch(/\bpad\b/)
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

  it('attachment/detail: start_time, exdata, codec_tag, nb_frames, encoder', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 1,
          codec_type: 'attachment',
          codec_name: 'mjpeg',
          start_time: '0.042',
          time_base: '1/90000',
          start_pts: 3780,
          nb_frames: '1',
          extradata_size: 16,
          codec_tag: 0x64736d,
          bit_rate: '8000',
          max_bit_rate: '64000',
          tags: {
            filename: 'thumb.jpg',
            encoder: 'Lavc thumbnailer'
          }
        }
      ],
      null
    )
    expect(row?.detail).toContain('start +42ms')
    expect(row?.detail).toContain('pts 3780@1/90000')
    expect(row?.detail).toContain('exdata 16 B')
    expect(row?.detail).toContain('tag 0x64736d')
    expect(row?.detail).toContain('1 frm')
    expect(row?.detail).toMatch(/max\b/)
    expect(row?.detail).toContain('Lavc thumbnailer')
  })

  it('attachment/detail: initial_padding как pad N smp', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'attachment',
          codec_name: 'png',
          extradata_size: 8,
          initial_padding: 3,
          tags: { filename: 'art.png' }
        }
      ],
      null
    )
    expect(row?.detail).toContain('exdata 8 B')
    expect(row?.detail).toContain('pad 3 smp')
    expect(row?.detail).toContain('art.png')
  })

  it('subtitle detail: заметный max_bit_rate над bit_rate → max … в сводке', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 3,
          codec_type: 'subtitle',
          codec_name: 'subrip',
          bit_rate: '2000',
          max_bit_rate: '96000',
          tags: { language: 'en' }
        }
      ],
      null
    )
    expect(row?.detail).toContain('en')
    expect(row?.detail).toMatch(/max\b/)
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

  it('video detail: ticks_per_frame>1 → «tpf N»', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'mpeg2video',
          width: 720,
          height: 576,
          ticks_per_frame: 2
        }
      ],
      null
    )
    expect(row?.detail).toContain('tpf 2')
  })

  it('video detail: ticks_per_frame=1 — без «tpf»', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1280,
          height: 720,
          ticks_per_frame: 1
        }
      ],
      null
    )
    expect(row?.detail).not.toMatch(/\btpf\b/)
  })

  it('video detail: bits_per_coded_sample → «bpc …-bit» (отдельно от coded WxH)', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1280,
          height: 720,
          coded_width: 1920,
          coded_height: 1080,
          bits_per_coded_sample: 8
        }
      ],
      null
    )
    expect(row?.detail).toContain('bpc 8-bit')
    expect(row?.detail).toContain('coded 1920×1080')
  })

  it('audio detail: bits_per_coded_sample → «bpc …-bit»', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'audio',
          codec_name: 'pcm_s16le',
          channels: 2,
          sample_rate: '48000',
          bits_per_coded_sample: 16
        }
      ],
      null
    )
    expect(row?.detail).toContain('bpc 16-bit')
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

    const [peaks] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'audio',
          codec_name: 'flac',
          channels: 2,
          sample_rate: '44100',
          tags: {
            replaygain_track_gain: '-1.00 dB',
            REPLAYGAIN_TRACK_PEAK: '0.912345',
            replaygain_album_peak: '0.98'
          }
        }
      ],
      null
    )
    expect(peaks?.detail).toContain('RG tr -1.00 dB')
    expect(peaks?.detail).toContain('RG tr pk 0.912345')
    expect(peaks?.detail).toContain('RG al pk 0.98')

    const [pkOnly] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'audio',
          codec_name: 'mp3',
          channels: 2,
          sample_rate: '44100',
          tags: { replaygain_album_peak: '1.000000' }
        }
      ],
      null
    )
    expect(pkOnly?.detail).toContain('RG al pk 1.000000')
    expect(pkOnly?.detail).not.toMatch(/\bRG tr\b/)
  })

  it('video detail: side_data Spherical Mapping → компактное «360°»', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 3840,
          height: 1920,
          side_data_list: [{ side_data_type: 'Spherical Mapping' }]
        }
      ],
      null
    )
    expect(row?.detail).toContain('360°')
    expect(row?.detail).not.toContain('Spherical Mapping')
  })
})
