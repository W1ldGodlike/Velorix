import { describe, expect, it } from 'vitest'

import {
  MEDIA_UTILITIES_NOISE_DURATION_SEC_MAX,
  MEDIA_UTILITIES_NOISE_DURATION_SEC_MIN,
  parseMediaUtilitiesNoiseDurationSec,
  parseMediaUtilitiesNoiseKind
} from '../../src/shared/ffmpeg-noise-generate-parse'

describe('ffmpeg-noise-generate-parse', () => {
  it('kind whitelist', () => {
    expect(parseMediaUtilitiesNoiseKind('white')).toBe('white')
    expect(parseMediaUtilitiesNoiseKind('pink')).toBe('pink')
    expect(parseMediaUtilitiesNoiseKind('silence')).toBe('silence')
    expect(parseMediaUtilitiesNoiseKind('brown')).toBeNull()
  })

  it('duration bounds', () => {
    expect(parseMediaUtilitiesNoiseDurationSec(MEDIA_UTILITIES_NOISE_DURATION_SEC_MIN)).toBe(0.1)
    expect(parseMediaUtilitiesNoiseDurationSec(MEDIA_UTILITIES_NOISE_DURATION_SEC_MAX)).toBe(3600)
    expect(parseMediaUtilitiesNoiseDurationSec(0.05)).toBeNull()
    expect(parseMediaUtilitiesNoiseDurationSec(4000)).toBeNull()
    expect(parseMediaUtilitiesNoiseDurationSec('3.5')).toBe(3.5)
  })
})
