import { describe, expect, it } from 'vitest'

import {
  appendFfmpegHwaccelBeforeInput,
  resolveFfmpegExportHwaccelForDecode,
  resolveFfmpegExportHwaccelOutputFormat
} from '../../src/shared/ffmpeg-export-hw-decode'

describe('ffmpeg-export-hw-decode', () => {
  it('resolveFfmpegExportHwaccelForDecode подбирает cuda для nvenc', () => {
    expect(resolveFfmpegExportHwaccelForDecode('h264_nvenc', ['cuda', 'dxva2'])).toBe('cuda')
  })

  it('resolveFfmpegExportHwaccelForDecode fallback auto', () => {
    expect(resolveFfmpegExportHwaccelForDecode('libx264', ['auto', 'dxva2'])).toBe('auto')
  })

  it('resolveFfmpegExportHwaccelOutputFormat', () => {
    expect(resolveFfmpegExportHwaccelOutputFormat('cuda')).toBe('cuda')
    expect(resolveFfmpegExportHwaccelOutputFormat('d3d11va')).toBe('d3d11')
    expect(resolveFfmpegExportHwaccelOutputFormat('auto')).toBeNull()
    expect(resolveFfmpegExportHwaccelOutputFormat(null)).toBeNull()
  })

  it('appendFfmpegHwaccelBeforeInput добавляет output format для cuda', () => {
    const args = ['-y']
    appendFfmpegHwaccelBeforeInput(args, 'cuda')
    expect(args).toEqual(['-y', '-hwaccel', 'cuda', '-hwaccel_output_format', 'cuda'])
  })

  it('appendFfmpegHwaccelBeforeInput без output format для auto', () => {
    const args = ['-y']
    appendFfmpegHwaccelBeforeInput(args, 'auto')
    expect(args).toEqual(['-y', '-hwaccel', 'auto'])
  })

  it('appendFfmpegHwaccelBeforeInput уважает явный output format', () => {
    const args = ['-y']
    appendFfmpegHwaccelBeforeInput(args, 'cuda', null)
    expect(args).toEqual(['-y', '-hwaccel', 'cuda'])
  })
})
