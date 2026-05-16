import { describe, expect, it } from 'vitest'

import {
  formatFfprobeContainerBrandExportLine,
  formatFfprobeContainerCreationTimeExportLine,
  formatFfprobeContainerFilenameExportLine,
  formatFfprobeContainerSizeCompact,
  formatFfprobeContainerSizeExportLine,
  formatFfprobeContainerStartTimeCompact,
  formatFfprobeContainerStartTimeExportLine,
  formatFfprobeContainerStartTimeRealExportLine,
  formatFfprobeEditorVideoFactLine,
  formatFfprobeFormatFlagsExportLine,
  formatFfprobeNbProgramsExportLine,
  formatFfprobeNbStreamsExportLine,
  formatFfprobeProbeScoreExportLine,
  ffprobeContainerFilenameBasename,
  parseFfprobeFormatCompatibleBrands,
  parseFfprobeFormatCreationTime,
  parseFfprobeFormatFlags,
  parseFfprobeFormatFilename,
  parseFfprobeFormatMajorBrand,
  parseFfprobeFormatNbPrograms,
  parseFfprobeFormatNbStreams,
  parseFfprobeFormatProbeScore,
  parseFfprobeFormatSize,
  parseFfprobeFormatStartTimeSec
} from '../../src/shared/ffprobe-container-format'
import { createMediaProbeSuccessBase } from '../fixtures/media-probe-success-base'

const probeBase = createMediaProbeSuccessBase()

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

  it('parseFfprobeFormatNbPrograms и export line', () => {
    expect(parseFfprobeFormatNbPrograms('2')).toBe(2)
    expect(formatFfprobeNbProgramsExportLine(2, 'ru')).toContain('nb_programs')
  })

  it('parseFfprobeFormatFilename и export line', () => {
    expect(parseFfprobeFormatFilename('C:\\clips\\demo.mp4')).toBe('C:\\clips\\demo.mp4')
    expect(ffprobeContainerFilenameBasename('C:\\clips\\demo.mp4')).toBe('demo.mp4')
    expect(formatFfprobeContainerFilenameExportLine('demo.mp4', 'ru')).toContain('filename')
  })

  it('parseFfprobeFormatStartTimeSec и export line', () => {
    expect(parseFfprobeFormatStartTimeSec('0')).toBeNull()
    expect(parseFfprobeFormatStartTimeSec('1.5')).toBe(1.5)
    expect(formatFfprobeContainerStartTimeCompact(1.5)).toContain('start')
    expect(formatFfprobeContainerStartTimeExportLine(1.5, 'ru')).toContain('start_time')
    expect(formatFfprobeContainerStartTimeRealExportLine(2, 1.5, 'en')).toContain('start_time_real')
  })

  it('parseFfprobeFormatSize и export line', () => {
    expect(parseFfprobeFormatSize('1048576')).toBe(1048576)
    expect(formatFfprobeContainerSizeCompact(1048576)).toBe('1.00 MiB')
    expect(formatFfprobeContainerSizeExportLine(1024, 'ru')).toContain('1024 B')
  })

  it('parseFfprobeFormatCreationTime и export line', () => {
    const tags = { creation_time: '2024-01-15T12:00:00.000000Z' }
    expect(parseFfprobeFormatCreationTime(tags)).toContain('2024-01-15')
    expect(formatFfprobeContainerCreationTimeExportLine('2024-01-15', 'ru')).toContain(
      'creation_time'
    )
  })

  it('formatFfprobeContainerBrandExportLine RU/EN', () => {
    expect(formatFfprobeContainerBrandExportLine('isom', 'mp41', 'ru')).toContain('isom')
    expect(formatFfprobeContainerBrandExportLine('isom', null, 'en')).toContain(
      'Container brand: isom'
    )
    expect(formatFfprobeProbeScoreExportLine(99, 'ru')).toContain('99')
  })
})
