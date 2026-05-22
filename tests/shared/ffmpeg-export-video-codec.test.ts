import { describe, expect, it } from 'vitest'

import { buildFfmpegExportArgv } from '../../src/shared/ffmpeg-export-argv'
import {
  cpuFfmpegVideoCodecRequiresMkv,
  exportCpuCodecMkvOnlyErrorMessage,
  exportMovOnlyCodecErrorMessage,
  ffmpegExportVideoCodecRequiresMov,
  ffmpegHwEncoderCpuFallback,
  isFfmpegHwExportVideoCodec,
  parseFfmpegExportVideoCodec,
  ffmpegExportArgvParamsWithCpuFallback,
  ffmpegExportSpawnFailureLooksLikeHwEncoder,
  pickFfmpegHwAutoEncoder,
  pickFfmpegHwAutoHevcEncoder,
  probeRunnableHwSnapshot,
  resolveFfmpegExportVideoCodecForArgv
} from '../../src/shared/ffmpeg-export-video-codec'
import {
  createEmptyFfmpegHwEncodersSnapshot,
  type FfmpegHwEncodersProbeResult
} from '../../src/shared/ffmpeg-hw-encoder-probe'

describe('ffmpeg-export-video-codec', () => {
  it('parse: hw_auto, hw_auto_hevc, libx265 и HW whitelist, иначе libx264', () => {
    expect(parseFfmpegExportVideoCodec(undefined)).toBe('libx264')
    expect(parseFfmpegExportVideoCodec('hw_auto')).toBe('hw_auto')
    expect(parseFfmpegExportVideoCodec('hw_auto_hevc')).toBe('hw_auto_hevc')
    expect(parseFfmpegExportVideoCodec('libx265')).toBe('libx265')
    expect(parseFfmpegExportVideoCodec('libvpx-vp9')).toBe('libvpx-vp9')
    expect(parseFfmpegExportVideoCodec('libsvtav1')).toBe('libsvtav1')
    expect(parseFfmpegExportVideoCodec('libaom-av1')).toBe('libaom-av1')
    expect(parseFfmpegExportVideoCodec('librav1e')).toBe('librav1e')
    expect(parseFfmpegExportVideoCodec('prores_ks')).toBe('prores_ks')
    expect(parseFfmpegExportVideoCodec('dnxhd')).toBe('dnxhd')
    expect(parseFfmpegExportVideoCodec('ffv1')).toBe('ffv1')
    expect(parseFfmpegExportVideoCodec('h264_nvenc')).toBe('h264_nvenc')
    expect(parseFfmpegExportVideoCodec('evil')).toBe('libx264')
  })

  it('pickFfmpegHwAutoEncoder — AV1 после H.264', () => {
    const snap = createEmptyFfmpegHwEncodersSnapshot()
    snap.av1_vaapi = true
    expect(pickFfmpegHwAutoEncoder(snap)).toBe('av1_vaapi')
    snap.av1_qsv = true
    expect(pickFfmpegHwAutoEncoder(snap)).toBe('av1_qsv')
    snap.h264_vaapi = true
    expect(pickFfmpegHwAutoEncoder(snap)).toBe('h264_vaapi')
  })

  it('pickFfmpegHwAutoEncoder — приоритет H.264 NVENC > AMF > QSV > VideoToolbox > VAAPI', () => {
    const snap = createEmptyFfmpegHwEncodersSnapshot()
    snap.h264_vaapi = true
    expect(pickFfmpegHwAutoEncoder(snap)).toBe('h264_vaapi')
    snap.h264_videotoolbox = true
    expect(pickFfmpegHwAutoEncoder(snap)).toBe('h264_videotoolbox')
    snap.h264_qsv = true
    expect(pickFfmpegHwAutoEncoder(snap)).toBe('h264_qsv')
    snap.h264_amf = true
    expect(pickFfmpegHwAutoEncoder(snap)).toBe('h264_amf')
    snap.h264_nvenc = true
    expect(pickFfmpegHwAutoEncoder(snap)).toBe('h264_nvenc')
  })

  it('pickFfmpegHwAutoHevcEncoder — av1_vaapi в цепочке AV1', () => {
    const snap = createEmptyFfmpegHwEncodersSnapshot()
    snap.av1_vaapi = true
    expect(pickFfmpegHwAutoHevcEncoder(snap)).toBe('av1_vaapi')
  })

  it('pickFfmpegHwAutoHevcEncoder — HEVC затем AV1, иначе libx265', () => {
    const snap = createEmptyFfmpegHwEncodersSnapshot()
    snap.av1_amf = true
    expect(pickFfmpegHwAutoHevcEncoder(snap)).toBe('av1_amf')
    snap.hevc_vaapi = true
    expect(pickFfmpegHwAutoHevcEncoder(snap)).toBe('hevc_vaapi')
    snap.hevc_videotoolbox = true
    expect(pickFfmpegHwAutoHevcEncoder(snap)).toBe('hevc_videotoolbox')
    snap.hevc_qsv = true
    expect(pickFfmpegHwAutoHevcEncoder(snap)).toBe('hevc_qsv')
    snap.hevc_amf = true
    expect(pickFfmpegHwAutoHevcEncoder(snap)).toBe('hevc_amf')
    snap.hevc_nvenc = true
    expect(pickFfmpegHwAutoHevcEncoder(snap)).toBe('hevc_nvenc')
  })

  it('cpuFfmpegVideoCodecRequiresMkv', () => {
    expect(cpuFfmpegVideoCodecRequiresMkv('libvpx-vp9')).toBe(true)
    expect(cpuFfmpegVideoCodecRequiresMkv('libsvtav1')).toBe(true)
    expect(cpuFfmpegVideoCodecRequiresMkv('libaom-av1')).toBe(true)
    expect(cpuFfmpegVideoCodecRequiresMkv('librav1e')).toBe(true)
    expect(cpuFfmpegVideoCodecRequiresMkv('ffv1')).toBe(true)
    expect(cpuFfmpegVideoCodecRequiresMkv('prores_ks')).toBe(false)
    expect(cpuFfmpegVideoCodecRequiresMkv('dnxhd')).toBe(false)
    expect(cpuFfmpegVideoCodecRequiresMkv('libx264')).toBe(false)
  })

  it('ffmpegExportVideoCodecRequiresMov / exportMovOnlyCodecErrorMessage', () => {
    expect(ffmpegExportVideoCodecRequiresMov('prores_ks')).toBe(true)
    expect(ffmpegExportVideoCodecRequiresMov('dnxhd')).toBe(true)
    expect(ffmpegExportVideoCodecRequiresMov('libx264')).toBe(false)
    expect(exportMovOnlyCodecErrorMessage('prores_ks')).toContain('prores_ks')
    expect(exportMovOnlyCodecErrorMessage('dnxhd')).toContain('dnxhd')
  })

  it('exportCpuCodecMkvOnlyErrorMessage', () => {
    expect(exportCpuCodecMkvOnlyErrorMessage('libvpx-vp9')).toContain('libvpx-vp9')
    expect(exportCpuCodecMkvOnlyErrorMessage('libsvtav1')).toContain('libsvtav1')
    expect(exportCpuCodecMkvOnlyErrorMessage('libaom-av1')).toContain('libaom-av1')
    expect(exportCpuCodecMkvOnlyErrorMessage('librav1e')).toContain('librav1e')
    expect(exportCpuCodecMkvOnlyErrorMessage('ffv1')).toContain('ffv1')
  })

  it('resolveFfmpegExportVideoCodecForArgv', () => {
    const snap = createEmptyFfmpegHwEncodersSnapshot()
    snap.h264_amf = true
    expect(resolveFfmpegExportVideoCodecForArgv('hw_auto', snap)).toBe('h264_amf')
    snap.hevc_qsv = true
    expect(resolveFfmpegExportVideoCodecForArgv('hw_auto_hevc', snap)).toBe('hevc_qsv')
    expect(resolveFfmpegExportVideoCodecForArgv('libx265', snap)).toBe('libx265')
    expect(resolveFfmpegExportVideoCodecForArgv('h264_nvenc', snap)).toBe('libx264')
    snap.h264_nvenc = true
    expect(resolveFfmpegExportVideoCodecForArgv('h264_nvenc', snap)).toBe('h264_nvenc')
    expect(resolveFfmpegExportVideoCodecForArgv('hevc_amf', snap)).toBe('libx265')
    snap.hevc_amf = true
    expect(resolveFfmpegExportVideoCodecForArgv('hevc_amf', snap)).toBe('hevc_amf')
  })

  it('isFfmpegHwExportVideoCodec', () => {
    expect(isFfmpegHwExportVideoCodec('h264_qsv')).toBe(true)
    expect(isFfmpegHwExportVideoCodec('libx264')).toBe(false)
  })

  it('ffmpegExportSpawnFailureLooksLikeHwEncoder', () => {
    expect(ffmpegExportSpawnFailureLooksLikeHwEncoder('Unknown encoder h264_nvenc')).toBe(true)
    expect(ffmpegExportSpawnFailureLooksLikeHwEncoder('No capable devices found')).toBe(true)
    expect(ffmpegExportSpawnFailureLooksLikeHwEncoder('Invalid data')).toBe(false)
  })

  it('probeRunnableHwSnapshot returns empty snapshot when probe failed', () => {
    const failed: FfmpegHwEncodersProbeResult = { ok: false, error: 'spawn failed' }
    expect(probeRunnableHwSnapshot(failed)).toEqual(createEmptyFfmpegHwEncodersSnapshot())
  })

  it('probeRunnableHwSnapshot disables AMF without AMD adapter names', () => {
    const snap = createEmptyFfmpegHwEncodersSnapshot()
    snap.h264_amf = true
    const probe: FfmpegHwEncodersProbeResult = {
      ok: true,
      snapshot: snap,
      hwaccels: [],
      nvidiaGpu: null,
      gpuAdapterNames: [],
      osPlatform: 'win32'
    }
    expect(probeRunnableHwSnapshot(probe).h264_amf).toBe(false)
    probe.gpuAdapterNames = ['AMD Radeon RX 7900']
    expect(probeRunnableHwSnapshot(probe).h264_amf).toBe(true)
  })

  it('ffmpegHwEncoderCpuFallback maps HEVC HW to libx265 and H264 HW to libx264', () => {
    expect(ffmpegHwEncoderCpuFallback('h264_nvenc')).toBe('libx264')
    expect(ffmpegHwEncoderCpuFallback('hevc_amf')).toBe('libx265')
    expect(ffmpegHwEncoderCpuFallback('av1_qsv')).toBe('libx264')
  })

  it('buildFfmpegExportArgv after CPU fallback omits nvenc and hwaccel', () => {
    const base = {
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance' as const,
      crf: 23,
      videoBitrate: null,
      audioMode: 'aac' as const,
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source' as const,
      videoCodec: 'h264_nvenc' as const,
      hwaccelDecode: 'cuda' as const
    }
    const argv = buildFfmpegExportArgv(ffmpegExportArgvParamsWithCpuFallback(base, 'libx264'))
    const joined = argv.join(' ')
    expect(joined).toMatch(/-c:v libx264/)
    expect(joined).not.toMatch(/nvenc|hwaccel/i)
  })

  it('ffmpegExportArgvParamsWithCpuFallback strips hwaccel and sets CPU codec', () => {
    const base = {
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance' as const,
      crf: 23,
      videoBitrate: null,
      audioMode: 'aac' as const,
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source' as const,
      videoCodec: 'h264_nvenc' as const,
      hwaccelDecode: 'cuda' as const
    }
    expect(ffmpegExportArgvParamsWithCpuFallback(base, 'libx264').videoCodec).toBeUndefined()
    expect(ffmpegExportArgvParamsWithCpuFallback(base, 'libx264').hwaccelDecode).toBeUndefined()
    expect(ffmpegExportArgvParamsWithCpuFallback(base, 'libx265').videoCodec).toBe('libx265')
  })
})
