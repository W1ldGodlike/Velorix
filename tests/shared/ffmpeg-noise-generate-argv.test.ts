import { describe, expect, it } from 'vitest'

import {
  buildFfmpegGenerateNoiseArgv,
  buildFfmpegNoiseLavfiSource
} from '../../src/shared/ffmpeg-noise-generate-argv'

describe('ffmpeg-noise-generate-argv', () => {
  it.each([
    ['white', 'anoisesrc=duration=5:color=white:sample_rate=44100'],
    ['pink', 'anoisesrc=duration=5:color=pink:sample_rate=44100'],
    ['silence', 'anullsrc=r=44100:cl=stereo:d=5']
  ] as const)('lavfi %s', (kind, expected) => {
    expect(buildFfmpegNoiseLavfiSource(kind, 5)).toBe(expected)
  })

  it('generate argv', () => {
    const argv = buildFfmpegGenerateNoiseArgv('white', 2, 'out.wav')
    expect(argv).toContain('-f')
    expect(argv).toContain('lavfi')
    expect(argv[argv.indexOf('-i') + 1]).toContain('white')
    expect(argv).toContain('out.wav')
  })
})
