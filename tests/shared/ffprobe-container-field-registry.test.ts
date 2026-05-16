import { describe, expect, it } from 'vitest'

import {
  parseFfprobeContainerFieldsFromFormat,
  parseFfprobeFormatProbeScore,
  parseFfprobeFormatSize
} from '../../src/shared/ffprobe-container-field-registry'

describe('ffprobe-container-field-registry', () => {
  it('parseFfprobeContainerFieldsFromFormat — пакет полей format', () => {
    const parsed = parseFfprobeContainerFieldsFromFormat({
      probe_score: 42,
      size: '1048576',
      nb_streams: '2',
      flags: 0,
      filename: 'clip.mp4',
      tags: { major_brand: 'isom', creation_time: '2020-01-01T00:00:00.000000Z' }
    })
    expect(parsed.probeScore).toBe(42)
    expect(parsed.containerSizeBytes).toBe(1048576)
    expect(parsed.containerNbStreams).toBe(2)
    expect(parsed.containerMajorBrand).toBe('isom')
    expect(parsed.containerFilename).toBe('clip.mp4')
  })

  it.each([
    ['probe_score valid', () => parseFfprobeFormatProbeScore('99'), 99],
    ['probe_score invalid', () => parseFfprobeFormatProbeScore('101'), null],
    ['size', () => parseFfprobeFormatSize('0'), 0]
  ])('%s', (_label, fn, expected) => {
    expect(fn()).toBe(expected)
  })
})
