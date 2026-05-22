import { describe, expect, it } from 'vitest'

import {
  buildSupportZipFfprobeSmokeLines,
  isMinimalFfprobeProbeJson,
  listPackagedFfprobeCandidatePaths
} from '../../src/shared/packaged-ffprobe-smoke'

describe('packaged-ffprobe-smoke (core)', () => {
  it('listPackagedFfprobeCandidatePaths: env, unpacked, bin', () => {
    const prev = process.env['VELORIX_FFPROBE_PATH']
    process.env['VELORIX_FFPROBE_PATH'] = 'C:\\custom\\ffprobe.exe'
    try {
      const paths = listPackagedFfprobeCandidatePaths('C:\\repo')
      expect(paths[0]).toBe('C:\\custom\\ffprobe.exe')
      expect(paths[1]).toContain('win-unpacked')
      expect(paths[2]).toMatch(/bin[\\/]ffprobe\.exe$/i)
    } finally {
      if (prev === undefined) {
        delete process.env['VELORIX_FFPROBE_PATH']
      } else {
        process.env['VELORIX_FFPROBE_PATH'] = prev
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
    expect(lines.some((l) => l.includes('VELORIX_SKIP_FFPROBE_SMOKE'))).toBe(true)
    expect(lines.some((l) => l.includes('registry optional'))).toBe(true)
    expect(lines.some((l) => l.includes('format_long_name'))).toBe(true)
    expect(lines.some((l) => l.includes('start_time, start_time_real'))).toBe(true)
    expect(lines.some((l) => l.includes('format.tags'))).toBe(true)
    expect(lines.some((l) => l.includes('chapters[]'))).toBe(true)
    expect(lines.some((l) => l.includes('nb_chapters'))).toBe(true)
    expect(lines.some((l) => l.includes('nb_programs'))).toBe(true)
    expect(lines.some((l) => l.includes('bit_rate'))).toBe(true)
    expect(lines.some((l) => l.includes('codec_type'))).toBe(true)
    expect(lines.some((l) => l.includes('sample_aspect_ratio'))).toBe(true)
    expect(lines.some((l) => l.includes('sample_rate'))).toBe(true)
    expect(lines.some((l) => l.includes('bits_per_sample'))).toBe(true)
    expect(lines.some((l) => l.includes('start_pts'))).toBe(true)
    expect(lines.some((l) => l.includes('stream.tags'))).toBe(true)
    expect(lines.some((l) => l.includes('color_*'))).toBe(true)
    expect(lines.some((l) => l.includes('extradata_size'))).toBe(true)
    expect(lines.some((l) => l.includes('disposition'))).toBe(true)
    expect(lines.some((l) => l.includes('codec_name, id,'))).toBe(true)
    expect(lines.some((l) => l.includes('stream_index'))).toBe(true)
    expect(lines.some((l) => l.includes('nb_read_frames'))).toBe(true)
    expect(lines.some((l) => l.includes('nb_read_packets'))).toBe(true)
    expect(lines.some((l) => l.includes('compatible_brands'))).toBe(true)
    expect(lines.some((l) => l.includes('handler_name'))).toBe(true)
    expect(lines.some((l) => l.includes('ParsableForSmoke'))).toBe(true)
    expect(lines.some((l) => l.includes('formatFfprobeContainerDiagnostics'))).toBe(true)
    expect(lines).toContain(`candidate: ${candidates[0]} (present)`)
    expect(lines).toContain(`candidate: ${candidates[1]} (missing)`)
  })
})
