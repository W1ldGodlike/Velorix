import { describe, expect, it } from 'vitest'

import { summarizeFfprobeSideDataList } from '../../src/shared/ffprobe-side-data'

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
    ).toBe('Spherical Mapping · HDR ambient viewing · A · B')
  })
})
