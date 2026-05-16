import { describe, expect, it } from 'vitest'

import {
  parseFfmpegExportCrf,
  parseFfmpegExportFps,
  parseFfmpegExportTwoPass
} from '../../src/shared/ffmpeg-export-stored-parse'

describe('ffmpeg-export-stored-parse', () => {
  it('parseFfmpegExportCrf — целое 0–51', () => {
    expect(parseFfmpegExportCrf(23)).toBe(23)
    expect(parseFfmpegExportCrf('18')).toBe(18)
    expect(parseFfmpegExportCrf(52)).toBeNull()
  })

  it('parseFfmpegExportFps — whitelist кадров', () => {
    expect(parseFfmpegExportFps(30)).toBe(30)
    expect(parseFfmpegExportFps(29.97)).toBeNull()
  })

  it('parseFfmpegExportTwoPass — только true', () => {
    expect(parseFfmpegExportTwoPass(true)).toBe(true)
    expect(parseFfmpegExportTwoPass('true')).toBe(false)
  })
})
