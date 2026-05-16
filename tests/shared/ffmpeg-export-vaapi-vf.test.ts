import { describe, expect, it } from 'vitest'

import {
  FFMPEG_EXPORT_AMF_HWUPLOAD_FILTER,
  FFMPEG_EXPORT_NVENC_HWUPLOAD_FILTER,
  FFMPEG_EXPORT_QSV_HWUPLOAD_FILTER,
  FFMPEG_EXPORT_VAAPI_HWUPLOAD_FILTER,
  ffmpegExportVideoCodecNeedsHwUploadFilter,
  prependHwEncoderUploadToVideoFilters,
  prependVaapiHwuploadToVideoFilters
} from '../../src/shared/ffmpeg-export-vaapi-vf'

describe('prependHwEncoderUploadToVideoFilters', () => {
  it('добавляет hwupload для h264_vaapi', () => {
    const filters = ['scale=1280:720']
    prependHwEncoderUploadToVideoFilters(filters, 'h264_vaapi')
    expect(filters[0]).toBe(FFMPEG_EXPORT_VAAPI_HWUPLOAD_FILTER)
    expect(filters[1]).toBe('scale=1280:720')
  })

  it('добавляет QSV-цепочку для hevc_qsv', () => {
    const filters = ['hflip']
    prependHwEncoderUploadToVideoFilters(filters, 'hevc_qsv')
    expect(filters[0]).toBe(FFMPEG_EXPORT_QSV_HWUPLOAD_FILTER)
    expect(filters[1]).toBe('hflip')
  })

  it('добавляет AMF-цепочку для h264_amf', () => {
    const filters: string[] = []
    prependHwEncoderUploadToVideoFilters(filters, 'h264_amf')
    expect(filters[0]).toBe(FFMPEG_EXPORT_AMF_HWUPLOAD_FILTER)
  })

  it('не дублирует hwupload', () => {
    const filters = ['hwupload,format=nv12']
    prependHwEncoderUploadToVideoFilters(filters, 'hevc_vaapi')
    expect(filters).toHaveLength(1)
  })

  it('nvenc: hwupload_cuda только при CPU-фильтрах', () => {
    const empty: string[] = []
    prependHwEncoderUploadToVideoFilters(empty, 'h264_nvenc')
    expect(empty).toHaveLength(0)

    const withFlip = ['hflip']
    prependHwEncoderUploadToVideoFilters(withFlip, 'hevc_nvenc')
    expect(withFlip[0]).toBe(FFMPEG_EXPORT_NVENC_HWUPLOAD_FILTER)
    expect(withFlip[1]).toBe('hflip')
  })

  it('игнорирует libx264 без nvenc-фильтров', () => {
    const filters: string[] = []
    prependHwEncoderUploadToVideoFilters(filters, 'libx264')
    expect(filters).toHaveLength(0)
  })

  it('ffmpegExportVideoCodecNeedsHwUploadFilter', () => {
    expect(ffmpegExportVideoCodecNeedsHwUploadFilter('h264_vaapi')).toBe(true)
    expect(ffmpegExportVideoCodecNeedsHwUploadFilter('av1_qsv')).toBe(true)
    expect(ffmpegExportVideoCodecNeedsHwUploadFilter('hevc_amf')).toBe(true)
    expect(ffmpegExportVideoCodecNeedsHwUploadFilter('h264_nvenc')).toBe(false)
  })

  it('prependVaapiHwuploadToVideoFilters — алиас', () => {
    const filters = ['crop=640:360:0:0']
    prependVaapiHwuploadToVideoFilters(filters, 'h264_vaapi')
    expect(filters[0]).toBe(FFMPEG_EXPORT_VAAPI_HWUPLOAD_FILTER)
  })
})
