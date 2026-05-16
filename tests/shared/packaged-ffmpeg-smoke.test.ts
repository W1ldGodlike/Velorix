import { describe, expect, it } from 'vitest'

import {
  isMinimalFfmpegEncodersOutput,
  listPackagedFfmpegCandidatePaths
} from '../../src/shared/packaged-ffmpeg-smoke'

describe('packaged-ffmpeg-smoke', () => {
  it('listPackagedFfmpegCandidatePaths: env, unpacked, bin', () => {
    const prev = process.env['FLUXALLOY_FFMPEG_PATH']
    process.env['FLUXALLOY_FFMPEG_PATH'] = 'C:\\custom\\ffmpeg.exe'
    try {
      const paths = listPackagedFfmpegCandidatePaths('C:\\repo')
      expect(paths[0]).toBe('C:\\custom\\ffmpeg.exe')
      expect(paths[1]).toContain('win-unpacked')
      expect(paths[2]).toMatch(/bin[\\/]ffmpeg\.exe$/i)
    } finally {
      if (prev === undefined) {
        delete process.env['FLUXALLOY_FFMPEG_PATH']
      } else {
        process.env['FLUXALLOY_FFMPEG_PATH'] = prev
      }
    }
  })

  it('isMinimalFfmpegEncodersOutput', () => {
    expect(isMinimalFfmpegEncodersOutput('short')).toBe(false)
    const ok = `encoders:\n${Array.from({ length: 45 }, (_, i) => ` V..... line${i}`).join('\n')}`
    expect(isMinimalFfmpegEncodersOutput(ok)).toBe(true)
  })
})
