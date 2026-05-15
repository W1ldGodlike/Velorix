import { describe, expect, it } from 'vitest'

import {
  cpuFfmpegVideoCodecRequiresMkv,
  exportCpuCodecMkvOnlyErrorMessage,
  isFfmpegHwExportVideoCodec,
  parseFfmpegExportVideoCodec,
  pickFfmpegHwAutoEncoder,
  pickFfmpegHwAutoHevcEncoder,
  resolveFfmpegExportVideoCodecForArgv
} from '../../src/shared/ffmpeg-export-video-codec'
import { createEmptyFfmpegHwEncodersSnapshot } from '../../src/shared/ffmpeg-hw-encoder-probe'

describe('ffmpeg-export-video-codec', () => {
  it('parse: hw_auto, hw_auto_hevc, libx265 и HW whitelist, иначе libx264', () => {
    expect(parseFfmpegExportVideoCodec(undefined)).toBe('libx264')
    expect(parseFfmpegExportVideoCodec('hw_auto')).toBe('hw_auto')
    expect(parseFfmpegExportVideoCodec('hw_auto_hevc')).toBe('hw_auto_hevc')
    expect(parseFfmpegExportVideoCodec('libx265')).toBe('libx265')
    expect(parseFfmpegExportVideoCodec('libvpx-vp9')).toBe('libvpx-vp9')
    expect(parseFfmpegExportVideoCodec('libsvtav1')).toBe('libsvtav1')
    expect(parseFfmpegExportVideoCodec('libaom-av1')).toBe('libaom-av1')
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
    expect(cpuFfmpegVideoCodecRequiresMkv('libx264')).toBe(false)
  })

  it('exportCpuCodecMkvOnlyErrorMessage', () => {
    expect(exportCpuCodecMkvOnlyErrorMessage('libvpx-vp9')).toContain('libvpx-vp9')
    expect(exportCpuCodecMkvOnlyErrorMessage('libsvtav1')).toContain('libsvtav1')
    expect(exportCpuCodecMkvOnlyErrorMessage('libaom-av1')).toContain('libaom-av1')
  })
  it('resolveFfmpegExportVideoCodecForArgv', () => {
    const snap = createEmptyFfmpegHwEncodersSnapshot()
    snap.h264_amf = true
    expect(resolveFfmpegExportVideoCodecForArgv('hw_auto', snap)).toBe('h264_amf')
    snap.hevc_qsv = true
    expect(resolveFfmpegExportVideoCodecForArgv('hw_auto_hevc', snap)).toBe('hevc_qsv')
    expect(resolveFfmpegExportVideoCodecForArgv('libx265', snap)).toBe('libx265')
  })

  it('isFfmpegHwExportVideoCodec', () => {
    expect(isFfmpegHwExportVideoCodec('h264_qsv')).toBe(true)
    expect(isFfmpegHwExportVideoCodec('libx264')).toBe(false)
  })
})
