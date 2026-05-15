import { describe, expect, it } from 'vitest'

import {
  isFfmpegExportBatchVideoPath,
  isFfmpegExportBatchVideoExtension
} from '../../src/shared/ffmpeg-export-batch-video-ext'

describe('ffmpeg-export-batch-video-ext', () => {
  it('isFfmpegExportBatchVideoExtension', () => {
    expect(isFfmpegExportBatchVideoExtension('mp4')).toBe(true)
    expect(isFfmpegExportBatchVideoExtension('exe')).toBe(false)
  })

  it('isFfmpegExportBatchVideoPath', () => {
    expect(isFfmpegExportBatchVideoPath('C:\\clip.MKV')).toBe(true)
    expect(isFfmpegExportBatchVideoPath('readme.txt')).toBe(false)
  })
})
