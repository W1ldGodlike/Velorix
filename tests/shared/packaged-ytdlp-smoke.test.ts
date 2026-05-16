import { describe, expect, it } from 'vitest'

import {
  isMinimalYtdlpExtractorsOutput,
  listPackagedYtdlpCandidatePaths
} from '../../src/shared/packaged-ytdlp-smoke'

describe('packaged-ytdlp-smoke', () => {
  it('listPackagedYtdlpCandidatePaths: env, unpacked, bin', () => {
    const prev = process.env['FLUXALLOY_YTDLP_PATH']
    process.env['FLUXALLOY_YTDLP_PATH'] = 'C:\\custom\\yt-dlp.exe'
    try {
      const paths = listPackagedYtdlpCandidatePaths('C:\\repo')
      expect(paths[0]).toBe('C:\\custom\\yt-dlp.exe')
      expect(paths[1]).toContain('win-unpacked')
      expect(paths[2]).toMatch(/bin[\\/]yt-dlp\.exe$/i)
    } finally {
      if (prev === undefined) {
        delete process.env['FLUXALLOY_YTDLP_PATH']
      } else {
        process.env['FLUXALLOY_YTDLP_PATH'] = prev
      }
    }
  })

  it('isMinimalYtdlpExtractorsOutput', () => {
    const short = Array.from({ length: 10 }, (_, i) => `ext${i}`).join('\n')
    expect(isMinimalYtdlpExtractorsOutput(short)).toBe(false)
    const ok = Array.from({ length: 40 }, (_, i) => `ext${i}`).join('\n')
    expect(isMinimalYtdlpExtractorsOutput(ok)).toBe(true)
    expect(isMinimalYtdlpExtractorsOutput('[debug] noise\nyoutube\n')).toBe(false)
  })
})
