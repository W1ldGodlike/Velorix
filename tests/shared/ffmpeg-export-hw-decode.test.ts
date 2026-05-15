import { describe, expect, it } from 'vitest'

import { appendFfmpegHwaccelBeforeInput, resolveFfmpegExportHwaccelForDecode } from '../../src/shared/ffmpeg-export-hw-decode'

describe('ffmpeg-export-hw-decode', () => {
  it('resolveFfmpegExportHwaccelForDecode подбирает cuda для nvenc', () => {
    expect(
      resolveFfmpegExportHwaccelForDecode('h264_nvenc', ['cuda', 'dxva2'])
    ).toBe('cuda')
  })

  it('resolveFfmpegExportHwaccelForDecode fallback auto', () => {
    expect(resolveFfmpegExportHwaccelForDecode('libx264', ['auto', 'dxva2'])).toBe('auto')
  })

  it('appendFfmpegHwaccelBeforeInput', () => {
    const args = ['-y']
    appendFfmpegHwaccelBeforeInput(args, 'cuda')
    expect(args).toEqual(['-y', '-hwaccel', 'cuda'])
  })
})
