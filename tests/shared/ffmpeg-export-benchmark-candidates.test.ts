import { describe, expect, it } from 'vitest'

import { buildFfmpegExportBenchmarkCandidates } from '../../src/shared/ffmpeg-export-benchmark-candidates'
import { createEmptyFfmpegHwEncodersSnapshot } from '../../src/shared/ffmpeg-hw-encoder-probe'

describe('buildFfmpegExportBenchmarkCandidates', () => {
  it('always includes libx264', () => {
    expect(buildFfmpegExportBenchmarkCandidates(null)).toEqual(['libx264'])
  })

  it('adds one h264 HW encoder per family', () => {
    const snap = createEmptyFfmpegHwEncodersSnapshot()
    snap.h264_nvenc = true
    snap.h264_amf = true
    snap.hevc_nvenc = true
    const ids = buildFfmpegExportBenchmarkCandidates(snap, {
      osPlatform: 'win32',
      nvidiaGpuPresent: true,
      gpuAdapterNames: ['NVIDIA GeForce', 'AMD Radeon', 'Intel UHD Graphics']
    })
    expect(ids[0]).toBe('libx264')
    expect(ids).toContain('h264_nvenc')
    expect(ids).toContain('h264_amf')
    expect(ids).not.toContain('hevc_nvenc')
  })
})
