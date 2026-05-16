import type { FfprobeSummaryLocale } from '../../src/shared/ffprobe-summary-export-locale'

export type FfprobeSideDataSummaryCase = {
  label: string
  input: readonly Record<string, unknown>[]
  expected: string | null
  locale?: FfprobeSummaryLocale
}

export const FFPROBE_SIDE_DATA_SUMMARY_CASES: readonly FfprobeSideDataSummaryCase[] = [
  {
    label: 'Stereo 3D',
    input: [{ side_data_type: 'Stereo 3D', stereo_mode: 'side_by_side' }],
    expected: '3D'
  },
  {
    label: 'AFD with active_format',
    input: [{ side_data_type: 'Active format description', active_format: '8' }],
    expected: 'AFD 8'
  },
  {
    label: 'AFD bare',
    input: [{ side_data_type: 'AFD' }],
    expected: 'AFD'
  },
  {
    label: 'Closed Captions ATSC',
    input: [{ side_data_type: 'MPEG-2 ATSC A53 Closed Captions' }],
    expected: 'CC'
  },
  {
    label: 'EIA-608',
    input: [{ side_data_type: 'EIA-608' }],
    expected: 'CC'
  },
  {
    label: 'Replay gain track',
    input: [{ side_data_type: 'Replay Gain', track_gain: '-6.5 dB' }],
    expected: 'Replay gain -6.5 dB'
  },
  {
    label: 'Replay gain fallback',
    input: [{ side_data_type: 'Replay Gain' }],
    expected: 'Replay gain'
  },
  {
    label: 'Skip samples',
    input: [{ side_data_type: 'Skip Samples' }],
    expected: 'Skip samples'
  },
  {
    label: 'SMPTE TC with timecode',
    input: [{ side_data_type: 'SMPTE 12-1 timecode', timecode: '01:00:00:00' }],
    expected: 'SMPTE TC 01:00:00:00'
  },
  {
    label: 'SMPTE TC bare',
    input: [{ side_data_type: 'SMPTE 12M timecode' }],
    expected: 'SMPTE TC'
  },
  {
    label: 'CPB max ru',
    input: [{ side_data_type: 'CPB properties', max_bitrate: '5000000' }],
    expected: 'CPB max 5.0 Мбит/с'
  },
  {
    label: 'CPB avg ru',
    input: [{ side_data_type: 'CPB properties', avg_bitrate: 768000 }],
    expected: 'CPB avg 768 кбит/с'
  },
  {
    label: 'CPB fallback',
    input: [{ side_data_type: 'CPB properties' }],
    expected: 'CPB'
  },
  {
    label: 'GOP TC',
    input: [{ side_data_type: 'GOP timecode', timecode: '00:00:10:00' }],
    expected: 'GOP TC 00:00:10:00'
  },
  {
    label: 'CPB max en',
    input: [{ side_data_type: 'CPB properties', max_bitrate: '5000000' }],
    expected: 'CPB max 5.0 Mb/s',
    locale: 'en'
  },
  {
    label: 'CPB avg en',
    input: [{ side_data_type: 'CPB properties', avg_bitrate: 768000 }],
    expected: 'CPB avg 768 kb/s',
    locale: 'en'
  },
  {
    label: 'PRFT wallclock',
    input: [{ side_data_type: 'Producer Reference Time', wallclock: '1700000000' }],
    expected: 'PRFT 1700000000'
  },
  {
    label: 'PRFT fallback',
    input: [{ side_data_type: 'Producer Reference Time' }],
    expected: 'PRFT'
  },
  {
    label: 'AV1 film grain',
    input: [{ side_data_type: 'AV1 film grain params' }],
    expected: 'AV1 film grain'
  },
  {
    label: 'Display Matrix omitted',
    input: [{ side_data_type: 'Display Matrix' }],
    expected: null
  }
]
