import { describe, expect, it } from 'vitest'

import {
  formatPackagedFfmpegSmokeDiagnosticLines,
  isMinimalFfmpegEncodersOutput,
  listPackagedFfmpegCandidatePaths
} from '../../src/shared/packaged-ffmpeg-smoke'

describe('packaged-ffmpeg-smoke', () => {
  it('listPackagedFfmpegCandidatePaths: env, unpacked, bin', () => {
    const prev = process.env['VELORIX_FFMPEG_PATH']
    process.env['VELORIX_FFMPEG_PATH'] = 'C:\\custom\\ffmpeg.exe'
    try {
      const paths = listPackagedFfmpegCandidatePaths('C:\\repo')
      expect(paths[0]).toBe('C:\\custom\\ffmpeg.exe')
      expect(paths[1]).toContain('win-unpacked')
      expect(paths[2]).toMatch(/bin[\\/]ffmpeg\.exe$/i)
    } finally {
      if (prev === undefined) {
        delete process.env['VELORIX_FFMPEG_PATH']
      } else {
        process.env['VELORIX_FFMPEG_PATH'] = prev
      }
    }
  })

  it('isMinimalFfmpegEncodersOutput', () => {
    expect(isMinimalFfmpegEncodersOutput('short')).toBe(false)
    const ok = `encoders:\n${Array.from({ length: 45 }, (_, i) => ` V..... line${i}`).join('\n')}`
    expect(isMinimalFfmpegEncodersOutput(ok)).toBe(true)
  })

  it('formatPackagedFfmpegSmokeDiagnosticLines', () => {
    const lines = formatPackagedFfmpegSmokeDiagnosticLines()
    expect(lines[0]).toContain('smoke:packaged-ffmpeg')
    expect(lines.some((l) => l.includes('VELORIX_SKIP_FFMPEG_SMOKE'))).toBe(true)
    expect(lines.some((l) => l.includes('check:terminal-summaries-ru'))).toBe(true)
    expect(lines.some((l) => l.includes('video sprite'))).toBe(true)
  })
})
