import { describe, expect, it } from 'vitest'

import {
  isFfmpegHwExportVideoCodec,
  parseFfmpegExportVideoCodec
} from '../../src/shared/ffmpeg-export-video-codec'

describe('ffmpeg-export-video-codec', () => {
  it('parse: libx265 и HW whitelist, иначе libx264', () => {
    expect(parseFfmpegExportVideoCodec(undefined)).toBe('libx264')
    expect(parseFfmpegExportVideoCodec('libx265')).toBe('libx265')
    expect(parseFfmpegExportVideoCodec('h264_nvenc')).toBe('h264_nvenc')
    expect(parseFfmpegExportVideoCodec('evil')).toBe('libx264')
  })

  it('isFfmpegHwExportVideoCodec', () => {
    expect(isFfmpegHwExportVideoCodec('h264_qsv')).toBe(true)
    expect(isFfmpegHwExportVideoCodec('libx264')).toBe(false)
  })
})
