import { describe, expect, it } from 'vitest'

import { buildTrackRows } from '../../src/main/services/ffprobe/ffprobe-service'

describe('ffprobe-service buildTrackRows', () => {
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
})
