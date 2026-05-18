import { describe, expect, it } from 'vitest'

import {
  collectFfmpegBenchmarkStatsFromStderr,
  estimateFfmpegBenchmarkFullEncodeSec,
  formatFfmpegBenchmarkBytes,
  formatFfmpegBenchmarkEtaMmSs,
  parseFfmpegFpsToken
} from '../../src/shared/ffmpeg-export-benchmark-metrics'

describe('ffmpeg-export-benchmark-metrics', () => {
  it('parseFfmpegFpsToken reads fps=', () => {
    expect(parseFfmpegFpsToken('frame=  42 fps= 31.2 q=28.0')).toBe(31.2)
  })

  it('collectFfmpegBenchmarkStatsFromStderr keeps last fps', () => {
    const stats = collectFfmpegBenchmarkStatsFromStderr(
      'frame=1 fps=10.0\nframe=99 fps=55.5 speed=2.1x'
    )
    expect(stats.avgFps).toBe(55.5)
    expect(stats.lastSpeed).toBe('2.1x')
  })

  it('estimateFfmpegBenchmarkFullEncodeSec scales by duration ratio', () => {
    expect(estimateFfmpegBenchmarkFullEncodeSec(1500, 15, 300)).toBeCloseTo(30, 5)
  })

  it('formatFfmpegBenchmarkBytes', () => {
    expect(formatFfmpegBenchmarkBytes(1536)).toBe('1.5 KiB')
  })

  it('formatFfmpegBenchmarkEtaMmSs', () => {
    expect(formatFfmpegBenchmarkEtaMmSs(125)).toBe('2:05')
    expect(formatFfmpegBenchmarkEtaMmSs(45)).toBe('45s')
  })
})
