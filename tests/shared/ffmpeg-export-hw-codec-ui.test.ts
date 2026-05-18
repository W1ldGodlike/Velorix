import { describe, expect, it } from 'vitest'

import {
  buildFfmpegHwEncoderChainSnapshot,
  FFMPEG_HW_ENCODER_LABEL_UI_KEYS,
  getFfmpegHwEncoderFamily
} from '../../src/shared/ffmpeg-export-hw-codec-ui'
import {
  FFMPEG_EXPORT_AMF_HWUPLOAD_FILTER,
  FFMPEG_EXPORT_QSV_HWUPLOAD_FILTER
} from '../../src/shared/ffmpeg-export-vaapi-vf'

describe('ffmpeg-export-hw-codec-ui', () => {
  it('getFfmpegHwEncoderFamily', () => {
    expect(getFfmpegHwEncoderFamily('h264_nvenc')).toBe('nvenc')
    expect(getFfmpegHwEncoderFamily('hevc_amf')).toBe('amf')
    expect(getFfmpegHwEncoderFamily('av1_qsv')).toBe('qsv')
    expect(getFfmpegHwEncoderFamily('h264_vaapi')).toBe('vaapi')
    expect(getFfmpegHwEncoderFamily('hevc_videotoolbox')).toBe('videotoolbox')
  })

  it('FFMPEG_HW_ENCODER_LABEL_UI_KEYS покрывает все HW id', () => {
    expect(Object.keys(FFMPEG_HW_ENCODER_LABEL_UI_KEYS)).toHaveLength(14)
    expect(FFMPEG_HW_ENCODER_LABEL_UI_KEYS.h264_amf).toBe('editorExportCodecHwH264Amf')
  })

  it('buildFfmpegHwEncoderChainSnapshot — AMF upload и cuda decode', () => {
    const snap = buildFfmpegHwEncoderChainSnapshot('h264_amf', ['cuda', 'd3d11va', 'dxva2'], true)
    expect(snap?.decodeHwaccel).toBe('d3d11va')
    expect(snap?.uploadFilter).toBe(FFMPEG_EXPORT_AMF_HWUPLOAD_FILTER)
    expect(snap?.familyHintKey).toBe('editorExportCodecHintAmf')
  })

  it('buildFfmpegHwEncoderChainSnapshot — null для libx264', () => {
    expect(buildFfmpegHwEncoderChainSnapshot('libx264', ['cuda'], true)).toBeNull()
  })

  it('buildFfmpegHwEncoderChainSnapshot — NVENC cuda decode, upload только с фильтрами', () => {
    const snap = buildFfmpegHwEncoderChainSnapshot('av1_nvenc', ['cuda', 'dxva2'], true)
    expect(snap?.decodeHwaccel).toBe('cuda')
    expect(snap?.uploadFilter).toBeNull()
    expect(snap?.familyHintKey).toBe('editorExportCodecHintNvenc')
  })

  it('buildFfmpegHwEncoderChainSnapshot — VideoToolbox без upload', () => {
    const snap = buildFfmpegHwEncoderChainSnapshot('hevc_videotoolbox', ['videotoolbox'], true)
    expect(snap?.decodeHwaccel).toBe('videotoolbox')
    expect(snap?.uploadFilter).toBeNull()
    expect(snap?.familyHintKey).toBe('editorExportCodecHintVideotoolbox')
  })

  it('buildFfmpegHwEncoderChainSnapshot — QSV upload и qsv decode', () => {
    const snap = buildFfmpegHwEncoderChainSnapshot('hevc_qsv', ['qsv', 'dxva2'], true)
    expect(snap?.decodeHwaccel).toBe('qsv')
    expect(snap?.uploadFilter).toBe(FFMPEG_EXPORT_QSV_HWUPLOAD_FILTER)
    expect(snap?.familyHintKey).toBe('editorExportCodecHintQsv')
  })

  it('buildFfmpegHwEncoderChainSnapshot — decode off', () => {
    const snap = buildFfmpegHwEncoderChainSnapshot('h264_nvenc', ['cuda'], false)
    expect(snap?.decodeHwaccel).toBeNull()
    expect(snap?.uploadFilter).toBeNull()
  })
})
