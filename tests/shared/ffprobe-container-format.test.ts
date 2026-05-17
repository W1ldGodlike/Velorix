import { describe, expect, it } from 'vitest'

import {
  formatFfprobeContainerBrandExportLine,
  formatFfprobeContainerCreationTimeExportLine,
  formatFfprobeContainerFilenameExportLine,
  formatFfprobeContainerSizeCompact,
  formatFfprobeContainerSizeExportLine,
  formatFfprobeContainerStartTimeCompact,
  formatFfprobeContainerStartOffsetCompactLine,
  formatFfprobeContainerStartOffsetExportLine,
  formatFfprobeContainerStartTimeExportLine,
  formatFfprobeContainerStartTimeRealExportLine,
  formatFfprobeEditorVideoFactLine,
  formatFfprobeContainerFormatFlagsCompact,
  formatFfprobeContainerProbeLayoutCompactLine,
  formatFfprobeContainerProbeLayoutExportLine,
  formatFfprobeContainerBitRateCompact,
  formatFfprobeContainerDiagnosticsExportLine,
  parseFfprobeFormatBitRateKbps,
  parseFfprobeFormatDurationSec,
  formatFfprobeFormatFlagsExportLine,
  formatFfprobeNbProgramsExportLine,
  formatFfprobeNbStreamsExportLine,
  formatFfprobeProbeScoreExportLine,
  ffprobeContainerFilenameBasename,
  formatFfprobeContainerFilenameCompact,
  parseFfprobeFormatCompatibleBrands,
  parseFfprobeFormatCreationTime,
  parseFfprobeFormatDurationTs,
  formatFfprobeContainerDurationSecCompact,
  formatFfprobeContainerDurationTsCompact,
  formatFfprobeContainerDurationTsExportLine,
  formatFfprobeContainerTimeBaseCompact,
  formatFfprobeContainerTimeBaseExportLine,
  parseFfprobeFormatTimeBase,
  parseFfprobeFormatProbeSize,
  formatFfprobeContainerProbeSizeCompact,
  formatFfprobeContainerProbeSizeExportLine,
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
  it('formatFfprobeContainerDurationSecCompact', () => {
    expect(formatFfprobeContainerDurationSecCompact(125.5)).toBe('dur 2:05.500')
    expect(formatFfprobeContainerDurationSecCompact(null)).toBeNull()
  })

  it('parseFfprobeFormatDurationSec', () => {
    expect(parseFfprobeFormatDurationSec('125.5')).toBe(125.5)
    expect(parseFfprobeFormatDurationSec(90)).toBe(90)
    expect(parseFfprobeFormatDurationSec('N/A')).toBeNull()
    expect(parseFfprobeFormatDurationSec('bad')).toBeNull()
  })

  it('parseFfprobeFormatBitRateKbps', () => {
    expect(parseFfprobeFormatBitRateKbps('4500000')).toBe(4500)
    expect(parseFfprobeFormatBitRateKbps(2_500_000)).toBe(2500)
    expect(parseFfprobeFormatBitRateKbps('')).toBeNull()
    expect(parseFfprobeFormatBitRateKbps('n/a')).toBeNull()
  })

  it('formatFfprobeContainerBitRateCompact', () => {
    expect(formatFfprobeContainerBitRateCompact(4500)).toBe('br 4500 kb/s')
    expect(formatFfprobeContainerBitRateCompact(null)).toBeNull()
  })

  it('formatFfprobeContainerFormatFlagsCompact', () => {
    expect(formatFfprobeContainerFormatFlagsCompact('0x0')).toBe('flags 0x0')
    expect(formatFfprobeContainerFormatFlagsCompact(null)).toBeNull()
  })

  it('formatFfprobeContainerProbeLayoutCompactLine', () => {
    expect(
      formatFfprobeContainerProbeLayoutCompactLine({
        probeScore: 100,
        containerNbStreams: 2,
        containerNbPrograms: 1,
        containerSizeBytes: 4096,
        containerFormatFlags: '0x0'
      })
    ).toBe('probe 100 · 2 str. · 1 prog. · 4.00 KiB · flags 0x0')
  })

  it('formatFfprobeContainerDiagnosticsExportLine', () => {
    const line = formatFfprobeContainerDiagnosticsExportLine(
      {
        ...probeBase,
        probeScore: 100,
        containerNbStreams: 2,
        containerDurationTs: 90000,
        containerTimeBase: '1/90000',
        containerStartTimeSec: 0.5,
        containerStartTimeRealSec: 0.5,
        containerFilename: 'D:\\clips\\Demo.mkv',
        bitrateKbps: 4500,
        durationSec: 125.5,
        tracks: [{ index: 0 }, { index: 1 }] as typeof probeBase.tracks
      },
      'ru'
    )
    expect(line).toContain('filename')
    expect(line).toContain('duration):')
    expect(line).toContain('bit_rate')
    expect(line).toContain('probe_score')
    expect(line).toContain('duration_ts')
    expect(line!.split(' · ').length).toBeGreaterThanOrEqual(5)
  })

  it('formatFfprobeContainerProbeLayoutExportLine', () => {
    const line = formatFfprobeContainerProbeLayoutExportLine(
      {
        ...probeBase,
        probeScore: 100,
        containerNbStreams: 2,
        containerNbPrograms: 1,
        containerSizeBytes: 4096,
        containerFormatFlags: '0x0',
        tracks: [{ index: 0 }, { index: 1 }] as typeof probeBase.tracks
      },
      'ru'
    )
    expect(line).toContain('probe_score')
    expect(line).toContain('nb_streams')
    expect(line!.split(' · ').length).toBeGreaterThanOrEqual(4)
  })

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

  it('formatFfprobeContainerFilenameCompact', () => {
    expect(formatFfprobeContainerFilenameCompact('C:\\clips\\Demo.mkv')).toBe('file Demo.mkv')
    expect(formatFfprobeContainerFilenameCompact(null)).toBeNull()
  })

  it('parseFfprobeFormatFilename и export line', () => {
    expect(parseFfprobeFormatFilename('C:\\clips\\demo.mp4')).toBe('C:\\clips\\demo.mp4')
    expect(ffprobeContainerFilenameBasename('C:\\clips\\demo.mp4')).toBe('demo.mp4')
    expect(formatFfprobeContainerFilenameExportLine('demo.mp4', 'ru')).toContain('filename')
  })

  it('parseFfprobeFormatProbeSize и export line', () => {
    expect(parseFfprobeFormatProbeSize('4096')).toBe(4096)
    expect(formatFfprobeContainerProbeSizeCompact(4096)).toBe('probe_io 4.00 KiB')
    expect(formatFfprobeContainerProbeSizeExportLine(4096, 'ru')).toContain('probe_size')
  })

  it('parseFfprobeFormatTimeBase и export line', () => {
    expect(parseFfprobeFormatTimeBase('1/90000')).toBe('1/90000')
    expect(parseFfprobeFormatTimeBase('1/1')).toBeNull()
    expect(formatFfprobeContainerTimeBaseCompact('1/90000')).toBe('tb 1/90000')
    expect(formatFfprobeContainerTimeBaseExportLine('1/90000', 'en')).toContain('1/90000')
  })

  it('parseFfprobeFormatDurationTs и export line', () => {
    expect(parseFfprobeFormatDurationTs('90000')).toBe(90000)
    expect(formatFfprobeContainerDurationTsCompact(90000)).toBe('dur_ts 90000')
    expect(formatFfprobeContainerDurationTsExportLine(90000, 'ru')).toContain('90000')
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

  it('formatFfprobeContainerStartOffsetExportLine', () => {
    const mismatch = formatFfprobeContainerStartOffsetExportLine(
      { containerStartTimeSec: 0.5, containerStartTimeRealSec: 0.75 },
      'ru'
    )
    expect(mismatch).toContain('start_time')
    expect(mismatch).toContain('start_time_real')
    expect(mismatch!.split(' · ').length).toBe(2)
    const same = formatFfprobeContainerStartOffsetExportLine(
      { containerStartTimeSec: 0.5, containerStartTimeRealSec: 0.5 },
      'ru'
    )
    expect(same).toContain('start_time')
    expect(same!.split(' · ').length).toBe(1)
  })

  it('formatFfprobeContainerStartOffsetCompactLine', () => {
    expect(
      formatFfprobeContainerStartOffsetCompactLine({
        containerStartTimeSec: 0.5,
        containerStartTimeRealSec: 0.75
      })
    ).toBe('start +500ms · real +750ms')
    expect(
      formatFfprobeContainerStartOffsetCompactLine({
        containerStartTimeSec: 0.5,
        containerStartTimeRealSec: 0.5
      })
    ).toBe('start +500ms')
    expect(
      formatFfprobeContainerStartOffsetCompactLine({
        containerStartTimeSec: null,
        containerStartTimeRealSec: null
      })
    ).toBeNull()
  })
})
