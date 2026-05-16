import { describe, expect, it } from 'vitest'

import { FFPROBE_SIDE_DATA_SUMMARY_CASES } from '../fixtures/ffprobe-side-data-cases'
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

  it.each(FFPROBE_SIDE_DATA_SUMMARY_CASES)('$label', ({ input, expected, locale }) => {
    expect(summarizeFfprobeSideDataList([...input], locale ?? 'ru')).toBe(expected)
  })

  it('Stereo 3D и Audio Service Type — короткие подписи', () => {
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
  })
})
