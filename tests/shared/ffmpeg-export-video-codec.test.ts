import { describe, expect, it } from 'vitest'

import {
  isFfmpegHwExportVideoCodec,
  parseFfmpegExportVideoCodec,
  pickFfmpegHwAutoEncoder,
  resolveFfmpegExportVideoCodecForArgv
} from '../../src/shared/ffmpeg-export-video-codec'
import { createEmptyFfmpegHwEncodersSnapshot } from '../../src/shared/ffmpeg-hw-encoder-probe'

describe('ffmpeg-export-video-codec', () => {
  it('parse: hw_auto, libx265 и HW whitelist, иначе libx264', () => {
    expect(parseFfmpegExportVideoCodec(undefined)).toBe('libx264')
    expect(parseFfmpegExportVideoCodec('hw_auto')).toBe('hw_auto')
    expect(parseFfmpegExportVideoCodec('libx265')).toBe('libx265')
    expect(parseFfmpegExportVideoCodec('h264_nvenc')).toBe('h264_nvenc')
    expect(parseFfmpegExportVideoCodec('evil')).toBe('libx264')
  })

  it('pickFfmpegHwAutoEncoder — приоритет NVENC > AMF > QSV > VideoToolbox > VAAPI', () => {
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

  it('resolveFfmpegExportVideoCodecForArgv', () => {
    const snap = createEmptyFfmpegHwEncodersSnapshot()
    snap.h264_amf = true
    expect(resolveFfmpegExportVideoCodecForArgv('hw_auto', snap)).toBe('h264_amf')
    expect(resolveFfmpegExportVideoCodecForArgv('libx265', snap)).toBe('libx265')
  })

  it('isFfmpegHwExportVideoCodec', () => {
    expect(isFfmpegHwExportVideoCodec('h264_qsv')).toBe(true)
    expect(isFfmpegHwExportVideoCodec('libx264')).toBe(false)
  })
})
