export type FfprobeUnaryCase<TIn, TOut> = {
  label: string
  input: TIn
  expected: TOut
}

export const FFPROBE_DURATION_SEC_COMPACT_CASES: readonly FfprobeUnaryCase<
  number | null,
  string | null
>[] = [
  { label: '125.5s', input: 125.5, expected: 'dur 2:05.500' },
  { label: 'null', input: null, expected: null }
]

export const FFPROBE_DURATION_SEC_PARSE_CASES: readonly FfprobeUnaryCase<
  string | number,
  number | null
>[] = [
  { label: 'string seconds', input: '125.5', expected: 125.5 },
  { label: 'number', input: 90, expected: 90 },
  { label: 'N/A', input: 'N/A', expected: null },
  { label: 'bad', input: 'bad', expected: null }
]

export const FFPROBE_BITRATE_KBPS_PARSE_CASES: readonly FfprobeUnaryCase<
  string | number,
  number | null
>[] = [
  { label: 'bps string', input: '4500000', expected: 4500 },
  { label: 'bps number', input: 2_500_000, expected: 2500 },
  { label: 'empty', input: '', expected: null },
  { label: 'n/a', input: 'n/a', expected: null }
]

export const FFPROBE_BITRATE_COMPACT_CASES: readonly FfprobeUnaryCase<
  number | null,
  string | null
>[] = [
  { label: '4500 kbps', input: 4500, expected: 'br 4500 kb/s' },
  { label: 'null', input: null, expected: null }
]

export const FFPROBE_FORMAT_FLAGS_COMPACT_CASES: readonly FfprobeUnaryCase<
  string | null,
  string | null
>[] = [
  { label: '0x0', input: '0x0', expected: 'flags 0x0' },
  { label: 'null', input: null, expected: null }
]

export const FFPROBE_PROBE_SCORE_PARSE_CASES: readonly FfprobeUnaryCase<
  string | number,
  number | null
>[] = [
  { label: 'string', input: '100', expected: 100 },
  { label: 'number', input: 42, expected: 42 },
  { label: 'over max', input: '101', expected: null },
  { label: 'empty', input: '', expected: null }
]

export const FFPROBE_MAJOR_BRAND_TAGS = {
  major_brand: 'isom',
  compatible_brands: 'mp41iso2'
} as const

export const FFPROBE_FLAGS_RAW_PARSED = {
  raw: '32768',
  parsed: '0x8000'
} as const

export const FFPROBE_NB_STREAMS_PARSE_EXPORT_CASES = [
  {
    label: 'parse 3',
    raw: '3',
    parsed: 3,
    exportNb: 2,
    tracks: 2,
    locale: 'ru' as const,
    contains: '2'
  },
  {
    label: 'export en mismatch',
    raw: '3',
    parsed: 3,
    exportNb: 3,
    tracks: 2,
    locale: 'en' as const,
    contains: 'parsed tracks: 2'
  }
] as const

export const FFPROBE_NB_PROGRAMS_PARSE_EXPORT_CASES = [
  {
    label: 'programs',
    raw: '2',
    parsed: 2,
    exportNb: 2,
    locale: 'ru' as const,
    contains: 'nb_programs'
  }
] as const

export const FFPROBE_NB_CHAPTERS_PARSE_EXPORT_CASES = [
  {
    label: 'chapters',
    raw: '12',
    parsed: 12,
    exportNb: 12,
    locale: 'ru' as const,
    contains: 'nb_chapters'
  }
] as const

export const FFPROBE_FILENAME_COMPACT_CASES: readonly FfprobeUnaryCase<
  string | null,
  string | null
>[] = [
  { label: 'windows path', input: 'C:\\clips\\Demo.mkv', expected: 'file Demo.mkv' },
  { label: 'null', input: null, expected: null }
]

export const FFPROBE_FILENAME_PARSE_CASES: readonly FfprobeUnaryCase<string, string>[] = [
  { label: 'path', input: 'C:\\clips\\demo.mp4', expected: 'C:\\clips\\demo.mp4' }
]

export const FFPROBE_FILENAME_BASENAME_CASES: readonly FfprobeUnaryCase<string, string>[] = [
  { label: 'basename', input: 'C:\\clips\\demo.mp4', expected: 'demo.mp4' }
]

export const FFPROBE_PROBE_SIZE_CASES = [
  {
    label: '4096',
    raw: '4096',
    parsed: 4096,
    compact: 'probe_io 4.00 KiB',
    exportContains: 'probe_size'
  }
] as const

export const FFPROBE_TIME_BASE_CASES = [
  {
    label: '1/90000',
    raw: '1/90000',
    parsed: '1/90000',
    compact: 'tb 1/90000',
    exportContains: '1/90000'
  },
  { label: '1/1 trivial', raw: '1/1', parsed: null, compact: null, exportContains: null }
] as const

export const FFPROBE_DURATION_TS_CASES = [
  {
    label: '90000',
    raw: '90000',
    parsed: 90000,
    compact: 'dur_ts 90000',
    exportContains: '90000'
  }
] as const

export const FFPROBE_START_TIME_CASES = [
  {
    label: 'zero → null',
    raw: '0',
    parsed: null,
    compactContains: null as string | null,
    exportContains: null as string | null,
    realExportContains: null as string | null
  },
  {
    label: '1.5s',
    raw: '1.5',
    parsed: 1.5,
    compactContains: 'start',
    exportContains: 'start_time',
    realExportContains: 'start_time_real'
  }
] as const

export const FFPROBE_SIZE_CASES = [
  {
    label: '1 MiB',
    raw: '1048576',
    parsed: 1048576,
    compact: '1.00 MiB',
    exportContains: '1024 B'
  }
] as const

export const FFPROBE_CREATION_TIME_TAGS = {
  creation_time: '2024-01-15T12:00:00.000000Z'
} as const

export const FFPROBE_BRAND_EXPORT_CASES = [
  {
    label: 'ru both',
    major: 'isom',
    compatible: 'mp41' as string | null,
    locale: 'ru' as const,
    contains: 'isom'
  },
  {
    label: 'en major only',
    major: 'isom',
    compatible: null,
    locale: 'en' as const,
    contains: 'Container brand: isom'
  }
] as const

export const FFPROBE_PROBE_SCORE_EXPORT_CASES: readonly FfprobeUnaryCase<number, string>[] = [
  { label: '99 ru', input: 99, expected: '99' }
]

export const FFPROBE_START_OFFSET_EXPORT_CASES = [
  { label: 'mismatch', startSec: 0.5, startRealSec: 0.75, locale: 'ru' as const, partCount: 2 },
  { label: 'same', startSec: 0.5, startRealSec: 0.5, locale: 'ru' as const, partCount: 1 }
] as const

export const FFPROBE_START_OFFSET_COMPACT_CASES = [
  {
    label: 'mismatch ms',
    startSec: 0.5,
    startRealSec: 0.75,
    expected: 'start +500ms · real +750ms'
  },
  { label: 'same ms', startSec: 0.5, startRealSec: 0.5, expected: 'start +500ms' },
  { label: 'null', startSec: null, startRealSec: null, expected: null }
] as const

export const FFPROBE_PROBE_LAYOUT_COMPACT_INPUT = {
  probeScore: 100,
  containerNbStreams: 2,
  containerNbPrograms: 1,
  containerSizeBytes: 4096,
  containerFormatFlags: '0x0'
} as const

export const FFPROBE_PROBE_LAYOUT_COMPACT_EXPECTED =
  'probe 100 · 2 str. · 1 prog. · 4.00 KiB · flags 0x0'

export const FFPROBE_DIAGNOSTICS_EXPORT_CONTAINS = [
  'filename',
  'duration):',
  'bit_rate',
  'probe_score',
  'duration_ts'
] as const

export const FFPROBE_PROBE_LAYOUT_EXPORT_CONTAINS = ['probe_score', 'nb_streams'] as const
