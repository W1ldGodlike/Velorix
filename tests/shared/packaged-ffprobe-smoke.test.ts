import { describe, expect, it } from 'vitest'

import {
  isMinimalFfprobeProbeJson,
  listPackagedFfprobeCandidatePaths
} from '../../src/shared/packaged-ffprobe-smoke'

describe('packaged-ffprobe-smoke', () => {
  it('listPackagedFfprobeCandidatePaths: env, unpacked, bin', () => {
    const prev = process.env['FLUXALLOY_FFPROBE_PATH']
    process.env['FLUXALLOY_FFPROBE_PATH'] = 'C:\\custom\\ffprobe.exe'
    try {
      const paths = listPackagedFfprobeCandidatePaths('C:\\repo')
      expect(paths[0]).toBe('C:\\custom\\ffprobe.exe')
      expect(paths[1]).toContain('win-unpacked')
      expect(paths[2]).toMatch(/bin[\\/]ffprobe\.exe$/i)
    } finally {
      if (prev === undefined) {
        delete process.env['FLUXALLOY_FFPROBE_PATH']
      } else {
        process.env['FLUXALLOY_FFPROBE_PATH'] = prev
      }
    }
  })

  it('isMinimalFfprobeProbeJson', () => {
    expect(isMinimalFfprobeProbeJson({ streams: [{}], format: {} })).toBe(true)
    expect(isMinimalFfprobeProbeJson({ streams: [], format: {} })).toBe(false)
    expect(isMinimalFfprobeProbeJson({ streams: [{}] })).toBe(false)
    expect(isMinimalFfprobeProbeJson(null)).toBe(false)
  })
})
