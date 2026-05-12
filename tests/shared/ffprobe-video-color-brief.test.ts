import { describe, expect, it } from 'vitest'

import {
  formatFfprobeVideoFullRangeBrief,
  formatFfprobeVideoHdrColorBrief,
  formatFfprobeVideoSdGamutBrief,
  formatFfprobeVideoSdrTransferBrief
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

describe('formatFfprobeVideoSdGamutBrief', () => {
  it('null при типичном bt709', () => {
    expect(
      formatFfprobeVideoSdGamutBrief({
        color_primaries: 'bt709',
        color_space: 'bt709',
        color_transfer: 'bt709'
      })
    ).toBeNull()
  })

  it('bt2020 при SDR wide (без HDR transfer)', () => {
    expect(
      formatFfprobeVideoSdGamutBrief({
        color_transfer: 'bt709',
        color_primaries: 'bt2020',
        color_space: 'bt2020nc'
      })
    ).toBe('bt2020·bt2020nc')
  })

  it('только нестандартный color_space', () => {
    expect(
      formatFfprobeVideoSdGamutBrief({
        color_primaries: 'bt709',
        color_space: 'smpte170m',
        color_transfer: 'bt709'
      })
    ).toBe('smpte170m')
  })

  it('null при HDR (не дублирует PQ/HLG)', () => {
    expect(
      formatFfprobeVideoSdGamutBrief({
        color_transfer: 'smpte2084',
        color_primaries: 'bt2020'
      })
    ).toBeNull()
  })
})

describe('formatFfprobeVideoSdrTransferBrief', () => {
  it('показывает нетипичный transfer при bt709 gamut', () => {
    expect(
      formatFfprobeVideoSdrTransferBrief({
        color_primaries: 'bt709',
        color_space: 'bt709',
        color_transfer: 'smpte170m'
      })
    ).toBe('smpte170m')
  })

  it('null, если transfer уже совпал с primaries/space (sd gamut)', () => {
    expect(
      formatFfprobeVideoSdrTransferBrief({
        color_primaries: 'bt709',
        color_space: 'smpte170m',
        color_transfer: 'smpte170m'
      })
    ).toBeNull()
  })

  it('null при HDR', () => {
    expect(
      formatFfprobeVideoSdrTransferBrief({
        color_transfer: 'smpte2084',
        color_primaries: 'bt2020'
      })
    ).toBeNull()
  })

  it('fallback color_trc', () => {
    expect(
      formatFfprobeVideoSdrTransferBrief({
        color_primaries: 'bt709',
        color_space: 'bt709',
        color_trc: 'gamma28'
      })
    ).toBe('gamma28')
  })
})
