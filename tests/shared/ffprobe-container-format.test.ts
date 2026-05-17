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
  formatFfprobeNbChaptersExportLine,
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
  parseFfprobeFormatNbChapters,
  parseFfprobeFormatNbStreams,
  parseFfprobeFormatProbeScore,
  parseFfprobeFormatSize,
  parseFfprobeFormatStartTimeSec
} from '../../src/shared/ffprobe-container-format'
import {
  FFPROBE_BITRATE_COMPACT_CASES,
  FFPROBE_BITRATE_KBPS_PARSE_CASES,
  FFPROBE_BRAND_EXPORT_CASES,
  FFPROBE_CREATION_TIME_TAGS,
  FFPROBE_DIAGNOSTICS_EXPORT_CONTAINS,
  FFPROBE_DURATION_SEC_COMPACT_CASES,
  FFPROBE_DURATION_SEC_PARSE_CASES,
  FFPROBE_DURATION_TS_CASES,
  FFPROBE_FILENAME_BASENAME_CASES,
  FFPROBE_FILENAME_COMPACT_CASES,
  FFPROBE_FILENAME_PARSE_CASES,
  FFPROBE_FLAGS_RAW_PARSED,
  FFPROBE_FORMAT_FLAGS_COMPACT_CASES,
  FFPROBE_MAJOR_BRAND_TAGS,
  FFPROBE_NB_CHAPTERS_PARSE_EXPORT_CASES,
  FFPROBE_NB_PROGRAMS_PARSE_EXPORT_CASES,
  FFPROBE_NB_STREAMS_PARSE_EXPORT_CASES,
  FFPROBE_PROBE_LAYOUT_COMPACT_EXPECTED,
  FFPROBE_PROBE_LAYOUT_COMPACT_INPUT,
  FFPROBE_PROBE_LAYOUT_EXPORT_CONTAINS,
  FFPROBE_PROBE_SCORE_EXPORT_CASES,
  FFPROBE_PROBE_SCORE_PARSE_CASES,
  FFPROBE_PROBE_SIZE_CASES,
  FFPROBE_SIZE_CASES,
  FFPROBE_START_OFFSET_COMPACT_CASES,
  FFPROBE_START_OFFSET_EXPORT_CASES,
  FFPROBE_START_TIME_CASES,
  FFPROBE_TIME_BASE_CASES
} from '../fixtures/ffprobe-container-format-cases'
import { createMediaProbeSuccessBase } from '../fixtures/media-probe-success-base'

const probeBase = createMediaProbeSuccessBase()

describe('ffprobe-container-format', () => {
  it.each(FFPROBE_DURATION_SEC_COMPACT_CASES)(
    'formatFfprobeContainerDurationSecCompact $label',
    ({ input, expected }) => {
      expect(formatFfprobeContainerDurationSecCompact(input)).toBe(expected)
    }
  )

  it.each(FFPROBE_DURATION_SEC_PARSE_CASES)(
    'parseFfprobeFormatDurationSec $label',
    ({ input, expected }) => {
      expect(parseFfprobeFormatDurationSec(input)).toBe(expected)
    }
  )

  it.each(FFPROBE_BITRATE_KBPS_PARSE_CASES)(
    'parseFfprobeFormatBitRateKbps $label',
    ({ input, expected }) => {
      expect(parseFfprobeFormatBitRateKbps(input)).toBe(expected)
    }
  )

  it.each(FFPROBE_BITRATE_COMPACT_CASES)(
    'formatFfprobeContainerBitRateCompact $label',
    ({ input, expected }) => {
      expect(formatFfprobeContainerBitRateCompact(input)).toBe(expected)
    }
  )

  it.each(FFPROBE_FORMAT_FLAGS_COMPACT_CASES)(
    'formatFfprobeContainerFormatFlagsCompact $label',
    ({ input, expected }) => {
      expect(formatFfprobeContainerFormatFlagsCompact(input)).toBe(expected)
    }
  )

  it('formatFfprobeContainerProbeLayoutCompactLine', () => {
    expect(formatFfprobeContainerProbeLayoutCompactLine(FFPROBE_PROBE_LAYOUT_COMPACT_INPUT)).toBe(
      FFPROBE_PROBE_LAYOUT_COMPACT_EXPECTED
    )
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
    for (const part of FFPROBE_DIAGNOSTICS_EXPORT_CONTAINS) {
      expect(line).toContain(part)
    }
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
    for (const part of FFPROBE_PROBE_LAYOUT_EXPORT_CONTAINS) {
      expect(line).toContain(part)
    }
    expect(line!.split(' · ').length).toBeGreaterThanOrEqual(4)
  })

  it.each(FFPROBE_PROBE_SCORE_PARSE_CASES)(
    'parseFfprobeFormatProbeScore $label',
    ({ input, expected }) => {
      expect(parseFfprobeFormatProbeScore(input)).toBe(expected)
    }
  )

  it('parseFfprobeFormatMajorBrand и compatible_brands', () => {
    expect(parseFfprobeFormatMajorBrand(FFPROBE_MAJOR_BRAND_TAGS)).toBe('isom')
    expect(parseFfprobeFormatCompatibleBrands(FFPROBE_MAJOR_BRAND_TAGS)).toBe('mp41iso2')
  })

  it('formatFfprobeEditorVideoFactLine добавляет major_brand', () => {
    expect(formatFfprobeEditorVideoFactLine(null, '—')).toBe('—')
    expect(formatFfprobeEditorVideoFactLine(probeBase, '—')).toBe('1280×720 h264')
    expect(
      formatFfprobeEditorVideoFactLine({ ...probeBase, containerMajorBrand: 'isom' }, '—')
    ).toBe('1280×720 h264 · isom')
  })

  it('parseFfprobeFormatFlags', () => {
    expect(parseFfprobeFormatFlags(FFPROBE_FLAGS_RAW_PARSED.raw)).toBe(
      FFPROBE_FLAGS_RAW_PARSED.parsed
    )
    expect(formatFfprobeFormatFlagsExportLine(FFPROBE_FLAGS_RAW_PARSED.parsed, 'en')).toContain(
      FFPROBE_FLAGS_RAW_PARSED.parsed
    )
  })

  it.each(FFPROBE_NB_STREAMS_PARSE_EXPORT_CASES)(
    'parseFfprobeFormatNbStreams $label',
    ({ raw, parsed, exportNb, tracks, locale, contains }) => {
      expect(parseFfprobeFormatNbStreams(raw)).toBe(parsed)
      expect(formatFfprobeNbStreamsExportLine(exportNb, tracks, locale)).toContain(contains)
    }
  )

  it.each(FFPROBE_NB_PROGRAMS_PARSE_EXPORT_CASES)(
    'parseFfprobeFormatNbPrograms $label',
    ({ raw, parsed, exportNb, locale, contains }) => {
      expect(parseFfprobeFormatNbPrograms(raw)).toBe(parsed)
      expect(formatFfprobeNbProgramsExportLine(exportNb, locale)).toContain(contains)
    }
  )

  it.each(FFPROBE_NB_CHAPTERS_PARSE_EXPORT_CASES)(
    'parseFfprobeFormatNbChapters $label',
    ({ raw, parsed, exportNb, locale, contains }) => {
      expect(parseFfprobeFormatNbChapters(raw)).toBe(parsed)
      expect(formatFfprobeNbChaptersExportLine(exportNb, locale)).toContain(contains)
    }
  )

  it.each(FFPROBE_FILENAME_COMPACT_CASES)(
    'formatFfprobeContainerFilenameCompact $label',
    ({ input, expected }) => {
      expect(formatFfprobeContainerFilenameCompact(input)).toBe(expected)
    }
  )

  it.each(FFPROBE_FILENAME_PARSE_CASES)(
    'parseFfprobeFormatFilename $label',
    ({ input, expected }) => {
      expect(parseFfprobeFormatFilename(input)).toBe(expected)
    }
  )

  it.each(FFPROBE_FILENAME_BASENAME_CASES)(
    'ffprobeContainerFilenameBasename $label',
    ({ input, expected }) => {
      expect(ffprobeContainerFilenameBasename(input)).toBe(expected)
    }
  )

  it('formatFfprobeContainerFilenameExportLine', () => {
    expect(formatFfprobeContainerFilenameExportLine('demo.mp4', 'ru')).toContain('filename')
  })

  it.each(FFPROBE_PROBE_SIZE_CASES)(
    'parseFfprobeFormatProbeSize $label',
    ({ raw, parsed, compact, exportContains }) => {
      expect(parseFfprobeFormatProbeSize(raw)).toBe(parsed)
      expect(formatFfprobeContainerProbeSizeCompact(parsed)).toBe(compact)
      expect(formatFfprobeContainerProbeSizeExportLine(parsed, 'ru')).toContain(exportContains)
    }
  )

  it.each(FFPROBE_TIME_BASE_CASES)(
    'parseFfprobeFormatTimeBase $label',
    ({ raw, parsed, compact, exportContains }) => {
      expect(parseFfprobeFormatTimeBase(raw)).toBe(parsed)
      if (compact) {
        expect(formatFfprobeContainerTimeBaseCompact(parsed!)).toBe(compact)
      }
      if (exportContains) {
        expect(formatFfprobeContainerTimeBaseExportLine(parsed!, 'en')).toContain(exportContains)
      }
    }
  )

  it.each(FFPROBE_DURATION_TS_CASES)(
    'parseFfprobeFormatDurationTs $label',
    ({ raw, parsed, compact, exportContains }) => {
      expect(parseFfprobeFormatDurationTs(raw)).toBe(parsed)
      expect(formatFfprobeContainerDurationTsCompact(parsed)).toBe(compact)
      expect(formatFfprobeContainerDurationTsExportLine(parsed, 'ru')).toContain(exportContains)
    }
  )

  it.each(FFPROBE_START_TIME_CASES)(
    'parseFfprobeFormatStartTimeSec $label',
    ({ raw, parsed, compactContains, exportContains, realExportContains }) => {
      expect(parseFfprobeFormatStartTimeSec(raw)).toBe(parsed)
      if (compactContains) {
        expect(formatFfprobeContainerStartTimeCompact(parsed!)).toContain(compactContains)
      }
      if (exportContains) {
        expect(formatFfprobeContainerStartTimeExportLine(parsed!, 'ru')).toContain(exportContains)
        expect(formatFfprobeContainerStartTimeRealExportLine(2, parsed!, 'en')).toContain(
          realExportContains!
        )
      }
    }
  )

  it.each(FFPROBE_SIZE_CASES)(
    'parseFfprobeFormatSize $label',
    ({ raw, parsed, compact, exportContains }) => {
      expect(parseFfprobeFormatSize(raw)).toBe(parsed)
      expect(formatFfprobeContainerSizeCompact(parsed)).toBe(compact)
      expect(formatFfprobeContainerSizeExportLine(1024, 'ru')).toContain(exportContains)
    }
  )

  it('parseFfprobeFormatCreationTime и export line', () => {
    expect(parseFfprobeFormatCreationTime(FFPROBE_CREATION_TIME_TAGS)).toContain('2024-01-15')
    expect(formatFfprobeContainerCreationTimeExportLine('2024-01-15', 'ru')).toContain(
      'creation_time'
    )
  })

  it.each(FFPROBE_BRAND_EXPORT_CASES)(
    'formatFfprobeContainerBrandExportLine $label',
    ({ major, compatible, locale, contains }) => {
      expect(formatFfprobeContainerBrandExportLine(major, compatible, locale)).toContain(contains)
    }
  )

  it.each(FFPROBE_PROBE_SCORE_EXPORT_CASES)(
    'formatFfprobeProbeScoreExportLine $label',
    ({ input, expected }) => {
      expect(formatFfprobeProbeScoreExportLine(input, 'ru')).toContain(expected)
    }
  )

  it.each(FFPROBE_START_OFFSET_EXPORT_CASES)(
    'formatFfprobeContainerStartOffsetExportLine $label',
    ({ startSec, startRealSec, locale, partCount }) => {
      const line = formatFfprobeContainerStartOffsetExportLine(
        { containerStartTimeSec: startSec, containerStartTimeRealSec: startRealSec },
        locale
      )
      expect(line).toContain('start_time')
      if (partCount === 2) {
        expect(line).toContain('start_time_real')
      }
      expect(line!.split(' · ').length).toBe(partCount)
    }
  )

  it.each(FFPROBE_START_OFFSET_COMPACT_CASES)(
    'formatFfprobeContainerStartOffsetCompactLine $label',
    ({ startSec, startRealSec, expected }) => {
      expect(
        formatFfprobeContainerStartOffsetCompactLine({
          containerStartTimeSec: startSec,
          containerStartTimeRealSec: startRealSec
        })
      ).toBe(expected)
    }
  )
})
