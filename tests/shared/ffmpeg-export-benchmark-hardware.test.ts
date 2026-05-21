import { describe, expect, it } from 'vitest'

import {
  filterFfmpegHwEncodersSnapshotForHardware,
  isFfmpegHwEncoderFamilyRunnableInBenchmark
} from '../../src/shared/ffmpeg-export-benchmark-hardware'
import { buildFfmpegExportBenchmarkCandidates } from '../../src/shared/ffmpeg-export-benchmark-candidates'
import { createEmptyFfmpegHwEncodersSnapshot } from '../../src/shared/ffmpeg-hw-encoder-probe'

describe('ffmpeg-export-benchmark-hardware', () => {
  it('skips AMF/QSV/VAAPI on Windows with only NVIDIA', () => {
    const hints = {
      osPlatform: 'win32' as const,
      nvidiaGpuPresent: true,
      gpuAdapterNames: ['NVIDIA GeForce RTX 3060 Ti']
    }
    expect(isFfmpegHwEncoderFamilyRunnableInBenchmark('nvenc', hints)).toBe(true)
    expect(isFfmpegHwEncoderFamilyRunnableInBenchmark('amf', hints)).toBe(false)
    expect(isFfmpegHwEncoderFamilyRunnableInBenchmark('qsv', hints)).toBe(false)
    expect(isFfmpegHwEncoderFamilyRunnableInBenchmark('vaapi', hints)).toBe(false)
  })

  it('buildFfmpegExportBenchmarkCandidates filters by hardware hints', () => {
    const snap = createEmptyFfmpegHwEncodersSnapshot()
    snap.h264_nvenc = true
    snap.h264_amf = true
    snap.h264_qsv = true
    snap.h264_vaapi = true
    const ids = buildFfmpegExportBenchmarkCandidates(snap, {
      osPlatform: 'win32',
      nvidiaGpuPresent: true,
      gpuAdapterNames: ['NVIDIA GeForce RTX 3060 Ti']
    })
    expect(ids).toEqual(['libx264', 'h264_nvenc'])
  })

  it('filterFfmpegHwEncodersSnapshotForHardware clears AMF on NVIDIA-only PC', () => {
    const snap = createEmptyFfmpegHwEncodersSnapshot()
    snap.h264_nvenc = true
    snap.h264_amf = true
    const filtered = filterFfmpegHwEncodersSnapshotForHardware(snap, {
      osPlatform: 'win32',
      nvidiaGpuPresent: true,
      gpuAdapterNames: ['NVIDIA GeForce RTX 3060 Ti']
    })
    expect(filtered.h264_nvenc).toBe(true)
    expect(filtered.h264_amf).toBe(false)
  })
})
