import { describe, expect, it } from 'vitest'

import type { MediaProbeSuccess } from '../../src/shared/ffprobe-contract'
import {
  formatFfprobeContainerBrandExportLine,
  formatFfprobeContainerSizeExportLine,
  formatFfprobeContainerSizeCompact,
  formatFfprobeEditorVideoFactLine,
  formatFfprobeFormatFlagsExportLine,
  formatFfprobeNbStreamsExportLine,
  formatFfprobeProbeScoreExportLine,
  parseFfprobeFormatCompatibleBrands,
  parseFfprobeFormatFlags,
  parseFfprobeFormatMajorBrand,
  parseFfprobeFormatNbStreams,
  parseFfprobeFormatProbeScore,
  parseFfprobeFormatSize
} from '../../src/shared/ffprobe-container-format'

const probeBase: MediaProbeSuccess = {
  ok: true,
  durationSec: 1,
  video: { width: 1280, height: 720, codec: 'h264' },
  videoFpsApprox: 24,
  audioCodec: 'aac',
  formatName: 'mp4',
  formatLongName: null,
  bitrateKbps: null,
  containerMajorBrand: null,
  containerCompatibleBrands: null,
  probeScore: null,
  containerNbStreams: null,
  containerFormatFlags: null,
  containerSizeBytes: null,
  tracks: [],
  chapters: [],
  rawJson: '{}'
}

describe('ffprobe-container-format', () => {
  it('parseFfprobeFormatProbeScore', () => {
    expect(parseFfprobeFormatProbeScore('100')).toBe(100)
    expect(parseFfprobeFormatProbeScore(42)).toBe(42)
    expect(parseFfprobeFormatProbeScore('101')).toBeNull()
    expect(parseFfprobeFormatProbeScore('')).toBeNull()
  })

  it('parseFfprobeFormatMajorBrand и compatible_brands', () => {
    const tags = { major_brand: 'isom', compatible_brands: 'mp41iso2' }
    expect(parseFfprobeFormatMajorBrand(tags)).toBe('isom')
    expect(parseFfprobeFormatCompatibleBrands(tags)).toBe('mp41iso2')
  })

  it('formatFfprobeEditorVideoFactLine добавляет major_brand', () => {
    expect(formatFfprobeEditorVideoFactLine(null, '—')).toBe('—')
    expect(formatFfprobeEditorVideoFactLine(probeBase, '—')).toBe('1280×720 h264')
    expect(
      formatFfprobeEditorVideoFactLine({ ...probeBase, containerMajorBrand: 'isom' }, '—')
    ).toBe('1280×720 h264 · isom')
  })

  it('parseFfprobeFormatFlags', () => {
    expect(parseFfprobeFormatFlags('32768')).toBe('0x8000')
    expect(formatFfprobeFormatFlagsExportLine('0x8000', 'en')).toContain('0x8000')
  })

  it('parseFfprobeFormatNbStreams и export line', () => {
    expect(parseFfprobeFormatNbStreams('3')).toBe(3)
    expect(formatFfprobeNbStreamsExportLine(2, 2, 'ru')).toContain('2')
    expect(formatFfprobeNbStreamsExportLine(3, 2, 'en')).toContain('parsed tracks: 2')
  })

  it('parseFfprobeFormatSize и export line', () => {
    expect(parseFfprobeFormatSize('1048576')).toBe(1048576)
    expect(formatFfprobeContainerSizeCompact(1048576)).toBe('1.00 MiB')
    expect(formatFfprobeContainerSizeExportLine(1024, 'ru')).toContain('1024 B')
  })

  it('formatFfprobeContainerBrandExportLine RU/EN', () => {
    expect(
      formatFfprobeContainerBrandExportLine('isom', 'mp41', 'ru')
    ).toContain('isom')
    expect(
      formatFfprobeContainerBrandExportLine('isom', null, 'en')
    ).toContain('Container brand: isom')
    expect(formatFfprobeProbeScoreExportLine(99, 'ru')).toContain('99')
  })
})
