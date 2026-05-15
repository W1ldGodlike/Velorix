import { describe, expect, it } from 'vitest'

import {
  FFMPEG_EXPORT_VAAPI_HWUPLOAD_FILTER,
  prependVaapiHwuploadToVideoFilters
} from '../../src/shared/ffmpeg-export-vaapi-vf'

describe('prependVaapiHwuploadToVideoFilters', () => {
  it('добавляет hwupload для h264_vaapi', () => {
    const filters = ['scale=1280:720']
    prependVaapiHwuploadToVideoFilters(filters, 'h264_vaapi')
    expect(filters[0]).toBe(FFMPEG_EXPORT_VAAPI_HWUPLOAD_FILTER)
    expect(filters[1]).toBe('scale=1280:720')
  })

  it('не дублирует hwupload', () => {
    const filters = ['hwupload,format=nv12']
    prependVaapiHwuploadToVideoFilters(filters, 'hevc_vaapi')
    expect(filters).toHaveLength(1)
  })

  it('игнорирует libx264', () => {
    const filters: string[] = []
    prependVaapiHwuploadToVideoFilters(filters, 'libx264')
    expect(filters).toHaveLength(0)
  })
})
