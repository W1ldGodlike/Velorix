import { describe, expect, it, vi, beforeEach } from 'vitest'

import type { FfmpegExportArgvParams } from '../../src/shared/ffmpeg-export-argv'
import { runFfmpegExportJob } from '../../src/main/services/ffmpeg/ffmpeg-export-service-job'

const resolvePlan = vi.fn()
const runOnce = vi.fn()

vi.mock('../../src/main/services/ffmpeg/ffmpeg-export-service-job-resolve', () => ({
  resolveFfmpegExportJobPlan: (...args: unknown[]) => resolvePlan(...args)
}))

vi.mock('../../src/main/services/ffmpeg/ffmpeg-export-spawn-once', () => ({
  runFfmpegExportOnce: (...args: unknown[]) => runOnce(...args)
}))

const baseArgv: FfmpegExportArgvParams = {
  inputPath: 'in.mp4',
  outputPath: 'out.mp4',
  applyTrim: false,
  encodePreset: 'balance',
  videoCodec: 'h264_nvenc',
  hwaccelDecode: 'cuda',
  crf: 23,
  videoBitrate: null,
  audioMode: 'aac',
  audioBitrate: '192k',
  fps: null,
  scalePreset: 'source'
}

describe('runFfmpegExportJob §16 HW spawn CPU fallback', () => {
  beforeEach(() => {
    resolvePlan.mockReset()
    runOnce.mockReset()
    resolvePlan.mockResolvedValue({
      ok: true,
      videoCodec: 'h264_nvenc',
      wantTwoPass: false,
      baseArgvParams: baseArgv,
      segmentDur: 60,
      uloc: 'ru',
      secondPassProgressMessage: 'pass 2'
    })
  })

  it('retries once on libx264 after HW encoder spawn failure', async () => {
    runOnce
      .mockResolvedValueOnce({ ok: false, error: 'Unknown encoder h264_nvenc' })
      .mockResolvedValueOnce({ ok: true })

    const result = await runFfmpegExportJob({
      ffmpegPath: 'ffmpeg',
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      signal: new AbortController().signal
    })

    expect(result).toEqual({ ok: true, videoCodecUsed: 'libx264' })
    expect(runOnce).toHaveBeenCalledTimes(2)
    const secondArgv = runOnce.mock.calls[1]?.[0] as { args?: string[] } | undefined
    expect(secondArgv?.args?.join(' ')).not.toMatch(/nvenc|hwaccel/i)
  })

  it('does not retry when failure is not HW-related', async () => {
    runOnce.mockResolvedValueOnce({ ok: false, error: 'No such file or directory' })

    const result = await runFfmpegExportJob({
      ffmpegPath: 'ffmpeg',
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      signal: new AbortController().signal
    })

    expect(result.ok).toBe(false)
    expect(runOnce).toHaveBeenCalledTimes(1)
  })

  it('retries once on libx265 after hevc_nvenc spawn failure', async () => {
    const hevcArgv: FfmpegExportArgvParams = {
      ...baseArgv,
      videoCodec: 'hevc_nvenc',
      hwaccelDecode: 'cuda'
    }
    resolvePlan.mockResolvedValue({
      ok: true,
      videoCodec: 'hevc_nvenc',
      wantTwoPass: false,
      baseArgvParams: hevcArgv,
      segmentDur: 60,
      uloc: 'ru',
      secondPassProgressMessage: 'pass 2'
    })
    runOnce
      .mockResolvedValueOnce({ ok: false, error: 'Unknown encoder hevc_nvenc' })
      .mockResolvedValueOnce({ ok: true })

    const result = await runFfmpegExportJob({
      ffmpegPath: 'ffmpeg',
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      signal: new AbortController().signal
    })

    expect(result).toEqual({ ok: true, videoCodecUsed: 'libx265' })
    expect(runOnce).toHaveBeenCalledTimes(2)
    const secondArgv = runOnce.mock.calls[1]?.[0] as { args?: string[] } | undefined
    const joined = secondArgv?.args?.join(' ') ?? ''
    expect(joined).toMatch(/libx265/)
    expect(joined).not.toMatch(/nvenc|hwaccel/i)
  })

  it('does not retry libx264 failures', async () => {
    resolvePlan.mockResolvedValue({
      ok: true,
      videoCodec: 'libx264',
      wantTwoPass: false,
      baseArgvParams: { ...baseArgv, videoCodec: 'libx264', hwaccelDecode: undefined },
      segmentDur: 60,
      uloc: 'ru',
      secondPassProgressMessage: 'pass 2'
    })
    runOnce.mockResolvedValueOnce({ ok: false, error: 'Unknown encoder libx264' })

    const result = await runFfmpegExportJob({
      ffmpegPath: 'ffmpeg',
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      signal: new AbortController().signal
    })

    expect(result.ok).toBe(false)
    expect(runOnce).toHaveBeenCalledTimes(1)
  })
})
