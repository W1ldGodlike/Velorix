import { describe, expect, it } from 'vitest'

import type { FfmpegExportBenchmarkRow } from '../../src/shared/ffmpeg-export-benchmark-contract'
import {
  ffmpegExportBenchmarkEffectiveLoadPeakPercent,
  ffmpegExportBenchmarkOnlyAvailable,
  pickFfmpegExportBenchmarkRecommended,
  pickFfmpegExportBenchmarkRecommendedCodec
} from '../../src/shared/ffmpeg-export-benchmark-rank'

function row(
  partial: Partial<FfmpegExportBenchmarkRow> & Pick<FfmpegExportBenchmarkRow, 'videoCodec'>
): FfmpegExportBenchmarkRow {
  return {
    ok: true,
    elapsedMs: 1000,
    avgFps: 30,
    estimatedFullSec: 60,
    outputBytes: 100,
    cpuLoadPeakPercent: 50,
    cpuLoadAvgPercent: 40,
    gpuLoadPeakPercent: null,
    gpuLoadAvgPercent: null,
    error: null,
    ...partial
  }
}

describe('pickFfmpegExportBenchmarkRecommended', () => {
  it('picks fastest among rows under load threshold', () => {
    const rec = pickFfmpegExportBenchmarkRecommended(
      [
        row({ videoCodec: 'libx264', elapsedMs: 5000, cpuLoadPeakPercent: 95 }),
        row({ videoCodec: 'h264_nvenc', elapsedMs: 1200, cpuLoadPeakPercent: 70 })
      ],
      80
    )
    expect(rec?.codec).toBe('h264_nvenc')
    expect(rec?.ignoredLoadThreshold).toBe(false)
  })

  it('uses GPU peak when CPU is under threshold but GPU exceeds', () => {
    const rec = pickFfmpegExportBenchmarkRecommended(
      [
        row({ videoCodec: 'libx264', elapsedMs: 5000, cpuLoadPeakPercent: 50, gpuLoadPeakPercent: null }),
        row({
          videoCodec: 'h264_nvenc',
          elapsedMs: 1200,
          cpuLoadPeakPercent: 40,
          gpuLoadPeakPercent: 95
        })
      ],
      80
    )
    expect(rec?.codec).toBe('libx264')
    expect(rec?.ignoredLoadThreshold).toBe(false)
  })

  it('falls back to fastest when all exceed threshold', () => {
    const rec = pickFfmpegExportBenchmarkRecommended(
      [
        row({ videoCodec: 'libx264', elapsedMs: 5000, cpuLoadPeakPercent: 95 }),
        row({ videoCodec: 'h264_nvenc', elapsedMs: 1200, cpuLoadPeakPercent: 90 })
      ],
      80
    )
    expect(rec?.codec).toBe('h264_nvenc')
    expect(rec?.ignoredLoadThreshold).toBe(true)
  })

  it('returns null when all failed', () => {
    expect(
      pickFfmpegExportBenchmarkRecommended(
        [row({ videoCodec: 'libx264', ok: false, elapsedMs: null, cpuLoadPeakPercent: null })],
        80
      )
    ).toBeNull()
  })
})

describe('ffmpegExportBenchmarkEffectiveLoadPeakPercent', () => {
  it('returns max of cpu and gpu', () => {
    expect(
      ffmpegExportBenchmarkEffectiveLoadPeakPercent({
        cpuLoadPeakPercent: 30,
        gpuLoadPeakPercent: 88
      })
    ).toBe(88)
  })
})

describe('pickFfmpegExportBenchmarkRecommendedCodec', () => {
  it('picks fastest successful row', () => {
    const recommended = pickFfmpegExportBenchmarkRecommendedCodec([
      row({ videoCodec: 'libx264', elapsedMs: 5000 }),
      row({ videoCodec: 'h264_nvenc', elapsedMs: 1200 })
    ])
    expect(recommended).toBe('h264_nvenc')
  })
})

describe('ffmpegExportBenchmarkOnlyAvailable', () => {
  it('is true for single success', () => {
    expect(ffmpegExportBenchmarkOnlyAvailable([row({ videoCodec: 'libx264' })])).toBe(true)
  })

  it('is false for two successes', () => {
    expect(
      ffmpegExportBenchmarkOnlyAvailable([
        row({ videoCodec: 'libx264' }),
        row({ videoCodec: 'h264_nvenc', elapsedMs: 800 })
      ])
    ).toBe(false)
  })
})
