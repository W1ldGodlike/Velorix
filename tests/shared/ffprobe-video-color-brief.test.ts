import { describe, expect, it } from 'vitest'

import {
  formatFfprobeVideoFullRangeBrief,
  formatFfprobeVideoHdrColorBrief
} from '../../src/shared/ffprobe-video-color-brief'

describe('formatFfprobeVideoHdrColorBrief', () => {
  it('возвращает null для типичного SDR bt709', () => {
    expect(
      formatFfprobeVideoHdrColorBrief({
        color_primaries: 'bt709',
        color_transfer: 'bt709'
      })
    ).toBeNull()
  })

  it('PQ при smpte2084', () => {
    expect(
      formatFfprobeVideoHdrColorBrief({
        color_transfer: 'smpte2084',
        color_primaries: 'bt709'
      })
    ).toBe('PQ')
  })

  it('PQ·bt2020 при smpte2084 + bt2020', () => {
    expect(
      formatFfprobeVideoHdrColorBrief({
        color_transfer: 'smpte2084',
        color_primaries: 'bt2020'
      })
    ).toBe('PQ·bt2020')
  })

  it('HLG при arib-std-b67; fallback color_trc', () => {
    expect(
      formatFfprobeVideoHdrColorBrief({
        color_trc: 'arib-std-b67',
        color_primaries: 'bt2020'
      })
    ).toBe('HLG·bt2020')
  })
})

describe('formatFfprobeVideoFullRangeBrief', () => {
  it('pc / jpeg → full range при SDR', () => {
    expect(
      formatFfprobeVideoFullRangeBrief({
        color_transfer: 'bt709',
        color_primaries: 'bt709',
        color_range: 'pc'
      })
    ).toBe('full range')
    expect(
      formatFfprobeVideoFullRangeBrief({
        color_range: 'jpeg'
      })
    ).toBe('full range')
  })

  it('tv и unknown не дают метку', () => {
    expect(
      formatFfprobeVideoFullRangeBrief({
        color_range: 'tv',
        color_transfer: 'bt709'
      })
    ).toBeNull()
    expect(formatFfprobeVideoFullRangeBrief({ color_range: 'N/A' })).toBeNull()
  })

  it('не дублирует при HDR (PQ/HLG)', () => {
    expect(
      formatFfprobeVideoFullRangeBrief({
        color_transfer: 'smpte2084',
        color_primaries: 'bt2020',
        color_range: 'pc'
      })
    ).toBeNull()
  })
})
