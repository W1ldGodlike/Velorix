import { describe, expect, it } from 'vitest'

import { buildTrackRows } from '../../src/main/ffprobe-service'

describe('ffprobe-service buildTrackRows', () => {
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

  it('audio detail: side_data_list Stereo 3D / Audio Service Type в сводке', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'audio',
          codec_name: 'ac3',
          channels: 2,
          sample_rate: '48000',
          side_data_list: [
            { side_data_type: 'Stereo 3D' },
            { side_data_type: 'Audio Service Type', service_type: 1 }
          ]
        }
      ],
      null
    )
    expect(row?.detail).toContain('3D')
    expect(row?.detail).toContain('ATSC svc 1')
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

  it('video detail: Display Matrix не дублируется после matrix rotation', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'h264',
          width: 1080,
          height: 1920,
          side_data_list: [
            { side_data_type: 'Display Matrix', rotation: -90 },
            { side_data_type: 'Spherical Mapping' }
          ]
        }
      ],
      null
    )

    expect(row?.detail).toContain('matrix -90°')
    expect(row?.detail).toContain('360°')
    expect(row?.detail).not.toContain('Display Matrix')
  })

  it('video/audio detail: новые side_data подписи попадают в сводку дорожки', () => {
    const rows = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'mpeg2video',
          width: 720,
          height: 576,
          side_data_list: [
            { side_data_type: 'Active format description', active_format: 8 },
            { side_data_type: 'MPEG-2 ATSC A53 Closed Captions' },
            { side_data_type: 'SMPTE 12-1 timecode', timecode: '10:00:00:00' }
          ]
        },
        {
          index: 1,
          codec_type: 'audio',
          codec_name: 'aac',
          channels: 2,
          sample_rate: '48000',
          side_data_list: [
            { side_data_type: 'Replay Gain', album_gain: '-3.0 dB' },
            { side_data_type: 'Skip Samples' }
          ]
        }
      ],
      null
    )

    expect(rows[0]?.detail).toContain('AFD 8')
    expect(rows[0]?.detail).toContain('CC')
    expect(rows[0]?.detail).toContain('SMPTE TC 10:00:00:00')
    expect(rows[1]?.detail).toContain('Replay gain -3.0 dB')
    expect(rows[1]?.detail).toContain('Skip samples')
  })

  it('video detail: CPB/GOP side_data попадает в сводку дорожки', () => {
    const [row] = buildTrackRows(
      [
        {
          index: 0,
          codec_type: 'video',
          codec_name: 'mpeg2video',
          width: 1920,
          height: 1080,
          side_data_list: [
            { side_data_type: 'CPB properties', max_bitrate: '15000000' },
            { side_data_type: 'GOP timecode', timecode: '00:00:10:00' }
          ]
        }
      ],
      null
    )

    expect(row?.detail).toContain('CPB max 15 Мбит/с')
    expect(row?.detail).toContain('GOP TC 00:00:10:00')
  })
})
