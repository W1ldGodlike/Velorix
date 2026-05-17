import { describe, expect, it } from 'vitest'

import {
  buildSupportZipFfprobeSmokeLines,
  isMinimalFfprobeProbeJson,
  isPackagedFfprobeProbeJsonParsableByContainerRegistry,
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

  it('buildSupportZipFfprobeSmokeLines annotates candidates', () => {
    const candidates = listPackagedFfprobeCandidatePaths('C:\\repo')
    const lines = buildSupportZipFfprobeSmokeLines('C:\\repo', (p) => p === candidates[0])
    expect(lines[0]).toContain('smoke:packaged-ffprobe')
    expect(lines).toContain(`candidate: ${candidates[0]} (present)`)
    expect(lines).toContain(`candidate: ${candidates[1]} (missing)`)
  })

  it('isPackagedFfprobeProbeJsonParsableByContainerRegistry', () => {
    const ok = {
      streams: [{}, {}],
      format: { format_name: 'mov,mp4,m4a,3gp,3g2,mj2', nb_streams: '2' }
    }
    expect(isPackagedFfprobeProbeJsonParsableByContainerRegistry(ok)).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '0' }
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: { nb_streams: '1' }
      })
    ).toBe(false)
  })
})
