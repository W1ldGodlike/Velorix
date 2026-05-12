import { describe, expect, it } from 'vitest'

import {
  extractFfprobeDisplayMatrixRotation,
  summarizeFfprobeSideDataList
} from '../../src/shared/ffprobe-side-data'

describe('ffprobe-side-data', () => {
  it('возвращает null без массива side_data_list', () => {
    expect(summarizeFfprobeSideDataList(undefined)).toBeNull()
    expect(summarizeFfprobeSideDataList({ side_data_type: 'x' })).toBeNull()
    expect(summarizeFfprobeSideDataList([])).toBeNull()
  })

  it('собирает Dolby Vision profile/level/compat из DOVI record', () => {
    expect(
      summarizeFfprobeSideDataList([
        {
          side_data_type: 'DOVI configuration record',
          dv_profile: 8,
          dv_level: 6,
          dv_bl_signal_compatibility_id: 1
        }
      ])
    ).toBe('Dolby Vision profile 8 level 6 compat 1')
  })

  it('собирает HDR mastering и content light metadata', () => {
    expect(
      summarizeFfprobeSideDataList([
        {
          side_data_type: 'Mastering display metadata',
          min_luminance: '0.005000',
          max_luminance: '1000.000000'
        },
        {
          side_data_type: 'Content light level metadata',
          max_content: 1000,
          max_average: 400
        }
      ])
    ).toBe('HDR mastering 0.005000-1000.000000 cd/m2 · HDR CLL 1000/400 nits')
  })

  it('extractFfprobeDisplayMatrixRotation: первый Display Matrix с полем rotation', () => {
    expect(
      extractFfprobeDisplayMatrixRotation([
        { side_data_type: 'Display Matrix', rotation: -90 },
        { side_data_type: 'Display Matrix', rotation: 0 }
      ])
    ).toBe(-90)
    expect(
      extractFfprobeDisplayMatrixRotation([{ side_data_type: 'Display Matrix', rotation: '270' }])
    ).toBe(270)
    expect(extractFfprobeDisplayMatrixRotation(undefined)).toBeNull()
    expect(extractFfprobeDisplayMatrixRotation([])).toBeNull()
    expect(
      extractFfprobeDisplayMatrixRotation([{ side_data_type: 'DOVI configuration record' }])
    ).toBeNull()
  })

  it('Stereo 3D и Audio Service Type — короткие подписи', () => {
    expect(
      summarizeFfprobeSideDataList([{ side_data_type: 'Stereo 3D', stereo_mode: 'side_by_side' }])
    ).toBe('3D')
    expect(
      summarizeFfprobeSideDataList([
        { side_data_type: 'Audio Service Type', service_type: 4 },
        { side_data_type: 'Audio Service Type' }
      ])
    ).toBe('ATSC svc 4 · ATSC audio svc')
    expect(
      summarizeFfprobeSideDataList([
        { side_data_type: 'Audio Service Type', service_type: '7' },
        { side_data_type: 'Audio Service Type', service_type: 'main' }
      ])
    ).toBe('ATSC svc 7 · ATSC audio svc')
    expect(
      summarizeFfprobeSideDataList([
        { side_data_type: 'Audio Service Type', service_type: 8 },
        { side_data_type: 'Audio Service Type', audio_service_type: '12' }
      ])
    ).toBe('ATSC audio svc')
    expect(
      summarizeFfprobeSideDataList([
        { side_data_type: 'Audio Service Type', audio_service_type: 2 }
      ])
    ).toBe('ATSC svc 2')
  })

  it('AFD / Closed Captions / Replay gain / Skip samples / SMPTE TC — короткие подписи', () => {
    expect(
      summarizeFfprobeSideDataList([
        { side_data_type: 'Active format description', active_format: '8' }
      ])
    ).toBe('AFD 8')
    expect(summarizeFfprobeSideDataList([{ side_data_type: 'AFD' }])).toBe('AFD')
    expect(
      summarizeFfprobeSideDataList([
        { side_data_type: 'MPEG-2 ATSC A53 Closed Captions' }
      ])
    ).toBe('CC')
    expect(summarizeFfprobeSideDataList([{ side_data_type: 'EIA-608' }])).toBe('CC')
    expect(
      summarizeFfprobeSideDataList([
        { side_data_type: 'Replay Gain', track_gain: '-6.5 dB' }
      ])
    ).toBe('Replay gain -6.5 dB')
    expect(summarizeFfprobeSideDataList([{ side_data_type: 'Replay Gain' }])).toBe('Replay gain')
    expect(summarizeFfprobeSideDataList([{ side_data_type: 'Skip Samples' }])).toBe('Skip samples')
    expect(
      summarizeFfprobeSideDataList([
        { side_data_type: 'SMPTE 12-1 timecode', timecode: '01:00:00:00' }
      ])
    ).toBe('SMPTE TC 01:00:00:00')
    expect(
      summarizeFfprobeSideDataList([{ side_data_type: 'SMPTE 12M timecode' }])
    ).toBe('SMPTE TC')
  })

  it('CPB properties / GOP timecode — короткие подписи', () => {
    expect(
      summarizeFfprobeSideDataList([
        { side_data_type: 'CPB properties', max_bitrate: '5000000' }
      ])
    ).toBe('CPB max 5.0 Mb/s')
    expect(
      summarizeFfprobeSideDataList([{ side_data_type: 'CPB properties', avg_bitrate: 768000 }])
    ).toBe('CPB avg 768 kb/s')
    expect(summarizeFfprobeSideDataList([{ side_data_type: 'CPB properties' }])).toBe('CPB')
    expect(
      summarizeFfprobeSideDataList([{ side_data_type: 'GOP timecode', timecode: '00:00:10:00' }])
    ).toBe('GOP TC 00:00:10:00')
  })

  it('Producer Reference Time / AV1 film grain — короткие подписи', () => {
    expect(
      summarizeFfprobeSideDataList([
        { side_data_type: 'Producer Reference Time', wallclock: '1700000000' }
      ])
    ).toBe('PRFT 1700000000')
    expect(summarizeFfprobeSideDataList([{ side_data_type: 'Producer Reference Time' }])).toBe(
      'PRFT'
    )
    expect(summarizeFfprobeSideDataList([{ side_data_type: 'AV1 film grain params' }])).toBe(
      'AV1 film grain'
    )
  })

  it('дедуплицирует и ограничивает неизвестные типы', () => {
    expect(
      summarizeFfprobeSideDataList([
        { side_data_type: 'Spherical Mapping' },
        { side_data_type: 'Spherical Mapping' },
        { side_data_type: 'Ambient viewing environment' },
        { side_data_type: 'A' },
        { side_data_type: 'B' },
        { side_data_type: 'C' }
      ])
    ).toBe('360° · HDR ambient viewing · A · B')
  })

  it('не дублирует Display Matrix в side-data summary', () => {
    expect(
      summarizeFfprobeSideDataList([
        { side_data_type: 'Display Matrix', rotation: -90 },
        { side_data_type: 'Spherical Mapping' }
      ])
    ).toBe('360°')
    expect(summarizeFfprobeSideDataList([{ side_data_type: 'Display Matrix' }])).toBeNull()
  })
})
