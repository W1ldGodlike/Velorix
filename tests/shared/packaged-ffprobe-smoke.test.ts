import { describe, expect, it } from 'vitest'

import {
  buildSupportZipFfprobeSmokeLines,
  isMinimalFfprobeProbeJson,
  isPackagedFfprobeProbeJsonParsableByContainerRegistry,
  isPackagedFfprobeProbeJsonParsableByStreamDetailFields,
  isPackagedFfprobeProbeJsonParsableForSmoke,
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
    expect(lines.some((l) => l.includes('registry optional'))).toBe(true)
    expect(lines.some((l) => l.includes('start_time, start_time_real'))).toBe(true)
    expect(lines.some((l) => l.includes('format.tags'))).toBe(true)
    expect(lines.some((l) => l.includes('chapters[]'))).toBe(true)
    expect(lines.some((l) => l.includes('nb_chapters'))).toBe(true)
    expect(lines.some((l) => l.includes('nb_programs'))).toBe(true)
    expect(lines.some((l) => l.includes('bit_rate'))).toBe(true)
    expect(lines.some((l) => l.includes('codec_type'))).toBe(true)
    expect(lines.some((l) => l.includes('ParsableForSmoke'))).toBe(true)
    expect(lines.some((l) => l.includes('formatFfprobeContainerDiagnostics'))).toBe(true)
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
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}, {}],
        format: {
          format_name: 'mp4',
          nb_streams: '2',
          duration_ts: '48000',
          time_base: '1/48000'
        }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          duration_ts: '100',
          time_base: '1/1'
        }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          probe_size: '2048'
        }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          probe_size: '0'
        }
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          flags: 4
        }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          flags: Number.NaN
        }
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          probe_score: 101
        }
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          probe_score: 99
        }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          filename: 'clip.mp4'
        }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          bit_rate: '2500000'
        }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          bit_rate: 'not-a-number'
        }
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          duration: '120.5'
        }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          duration: 'n/a'
        }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          start_time: '1.25'
        }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          start_time: 'not-a-number'
        }
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          start_time_real: '2.5',
          start_time: '1.0'
        }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          tags: { major_brand: 'isom', encoder: 'Lavf61.0' }
        }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          tags: { encoder: '   ' }
        }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1', tags: 'not-an-object' }
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1', nb_chapters: '4' }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1', nb_chapters: 'n/a' }
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1', size: '1048576', nb_programs: '2' }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1', size: 'not-a-number' }
      })
    ).toBe(false)
  })

  it('isPackagedFfprobeProbeJsonParsableByStreamDetailFields', () => {
    const base = {
      streams: [{ codec_type: 'video' }],
      format: { format_name: 'mp4', nb_streams: '1' }
    }
    expect(isPackagedFfprobeProbeJsonParsableByStreamDetailFields(base)).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ duration_ts: '48000', time_base: '1/48000', codec_time_base: '1/50' }]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ duration_ts: 'not-a-number' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ start_time: 'bad' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ time_base: 'not-a-fraction' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [
          {
            codec_name: 'h264',
            codec_long_name: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10',
            tags: { stereo_mode: '2' }
          }
        ]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ codec_type: 'audio' }]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ codec_type: 'not-a-kind' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ avg_frame_rate: '24000/1001', r_frame_rate: '24/1' }]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ avg_frame_rate: 'not-a-rate' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ bit_rate: '2500000', max_bit_rate: '3000000', nb_frames: '720' }]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ bit_rate: 'not-bps' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ width: '1920', height: '1080', pix_fmt: 'yuv420p' }]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ width: '0' }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [
          {
            side_data_list: [{ side_data_type: 'Mastering display metadata', max_luminance: '1000' }]
          }
        ]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByStreamDetailFields({
        ...base,
        streams: [{ side_data_list: [{}] }]
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableForSmoke({
        streams: [{ start_time: '1.0' }],
        format: { format_name: 'mp4', nb_streams: '1' }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableForSmoke({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1' },
        chapters: [{ id: 0, start_time: '0', end_time: '12.5', tags: { title: 'A' } }]
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableForSmoke({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1' },
        chapters: [{ start_time: 'nope', end_time: '1' }]
      })
    ).toBe(false)
  })
})
