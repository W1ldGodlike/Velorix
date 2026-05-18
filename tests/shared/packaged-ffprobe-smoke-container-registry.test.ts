import { describe, expect, it } from 'vitest'

import { isPackagedFfprobeProbeJsonParsableByContainerRegistry } from '../../src/shared/packaged-ffprobe-smoke'

describe('packaged-ffprobe-smoke (container registry)', () => {
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
        format: { format_name: 'mp4', nb_streams: '1', duration_ts: 'not-ticks' }
      })
    ).toBe(false)
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
          probe_size: 'not-a-number'
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
        format: { format_name: 'mp4', nb_streams: '1', flags: '0x4' }
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
        format: { format_name: 'mp4', nb_streams: '1', probe_score: '88' }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1', probe_score: 'not-a-score' }
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          filename: 'clip.mp4',
          bit_rate: '5000000'
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
          duration: 'not-a-number'
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
          start_time_real: 'not-a-number'
        }
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          format_long_name: 'QuickTime / MOV',
          nb_streams: '1',
          tags: {
            major_brand: 'isom',
            minor_version: '512',
            creation_time: '2024-01-02T03:04:05.000000Z',
            compatible_brands: 'isomiso2avc1mp41',
            encoder: 'Lavf61.0'
          }
        }
      })
    ).toBe(true)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: {
          format_name: 'mp4',
          nb_streams: '1',
          tags: { compatible_brands: { not: 'scalar' } }
        }
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1', format_long_name: 42 }
      })
    ).toBe(false)
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
        format: { format_name: 'mp4', nb_streams: '1', nb_chapters: 'not-a-number' }
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
        format: { format_name: 'mp4', nb_streams: '1', nb_programs: 'not-a-number' }
      })
    ).toBe(false)
    expect(
      isPackagedFfprobeProbeJsonParsableByContainerRegistry({
        streams: [{}],
        format: { format_name: 'mp4', nb_streams: '1', size: 'not-a-number' }
      })
    ).toBe(false)
  })
})
