import { describe, expect, it, vi, beforeEach } from 'vitest'

import { createEmptyFfmpegHwEncodersSnapshot } from '../../src/shared/ffmpeg-hw-encoder-probe'
import { probeFfmpegHwEncoders } from '../../src/main/services/ffmpeg/ffmpeg-hw-encoder-probe-main'
import { resolveFfmpegExportJobVideo } from '../../src/main/services/ffmpeg/ffmpeg-export-service-job-resolve-video'

vi.mock('../../src/main/services/ffmpeg/ffmpeg-hw-encoder-probe-main', () => ({
  probeFfmpegHwEncoders: vi.fn()
}))

const probeMock = vi.mocked(probeFfmpegHwEncoders)

describe('resolveFfmpegExportJobVideo §16', () => {
  beforeEach(() => {
    probeMock.mockReset()
  })

  it('hw_auto resolves to libx264 when probe fails', async () => {
    probeMock.mockRejectedValue(new Error('ffmpeg missing'))

    const r = await resolveFfmpegExportJobVideo({
      ffmpegPath: 'ffmpeg',
      videoCodec: 'hw_auto',
      hwDecode: false,
      audioMode: 'aac',
      container: 'mp4'
    })

    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.videoCodec).toBe('libx264')
    }
  })

  it('h264_nvenc falls back to libx264 when encoder absent in snapshot', async () => {
    probeMock.mockResolvedValue({
      ok: true,
      snapshot: createEmptyFfmpegHwEncodersSnapshot(),
      hwaccels: [],
      nvidiaGpu: null,
      gpuAdapterNames: [],
      osPlatform: 'win32'
    })

    const r = await resolveFfmpegExportJobVideo({
      ffmpegPath: 'ffmpeg',
      videoCodec: 'h264_nvenc',
      hwDecode: false,
      audioMode: 'aac',
      container: 'mp4'
    })

    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.videoCodec).toBe('libx264')
    }
  })

  it('hwDecode on picks cuda hwaccel when NVENC falls back to libx264', async () => {
    probeMock.mockResolvedValue({
      ok: true,
      snapshot: createEmptyFfmpegHwEncodersSnapshot(),
      hwaccels: ['cuda'],
      nvidiaGpu: null,
      gpuAdapterNames: [],
      osPlatform: 'win32'
    })

    const r = await resolveFfmpegExportJobVideo({
      ffmpegPath: 'ffmpeg',
      videoCodec: 'h264_nvenc',
      hwDecode: true,
      audioMode: 'aac',
      container: 'mp4'
    })

    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.videoCodec).toBe('libx264')
      expect(r.hwaccelDecode).toBe('cuda')
    }
  })
})
