import { describe, expect, it } from 'vitest'

import {
  FFMPEG_EXPORT_BENCHMARK_LOAD_THRESHOLD_DEFAULT,
  parseFfmpegExportBenchmarkLoadThreshold
} from '../../src/shared/ffmpeg-export-benchmark-load-threshold'

describe('parseFfmpegExportBenchmarkLoadThreshold', () => {
  it('defaults to 80', () => {
    expect(parseFfmpegExportBenchmarkLoadThreshold(undefined)).toBe(
      FFMPEG_EXPORT_BENCHMARK_LOAD_THRESHOLD_DEFAULT
    )
  })

  it('clamps to 10..100', () => {
    expect(parseFfmpegExportBenchmarkLoadThreshold(5)).toBe(10)
    expect(parseFfmpegExportBenchmarkLoadThreshold(150)).toBe(100)
    expect(parseFfmpegExportBenchmarkLoadThreshold(72.4)).toBe(72)
  })
})
