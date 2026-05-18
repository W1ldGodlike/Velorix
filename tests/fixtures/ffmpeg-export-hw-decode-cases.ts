export const FFMPEG_HWACCEL_OUTPUT_FORMAT_CASES = [
  { hwaccel: 'cuda', expected: 'cuda' },
  { hwaccel: 'd3d11va', expected: 'd3d11' },
  { hwaccel: 'auto', expected: null },
  { hwaccel: null, expected: null }
] as const

export const FFMPEG_HWACCEL_DECODE_CASES = [
  { vcodec: 'h264_nvenc' as const, hwaccels: ['cuda', 'dxva2'], expected: 'cuda' },
  { vcodec: 'hevc_nvenc' as const, hwaccels: ['cuda'], expected: 'cuda' },
  { vcodec: 'av1_nvenc' as const, hwaccels: ['cuda', 'qsv'], expected: 'cuda' },
  { vcodec: 'h264_videotoolbox' as const, hwaccels: ['videotoolbox', 'qsv'], expected: 'videotoolbox' },
  { vcodec: 'hevc_videotoolbox' as const, hwaccels: ['videotoolbox'], expected: 'videotoolbox' },
  { vcodec: 'h264_amf' as const, hwaccels: ['cuda', 'd3d11va', 'dxva2'], expected: 'd3d11va' },
  { vcodec: 'hevc_amf' as const, hwaccels: ['d3d11va'], expected: 'd3d11va' },
  { vcodec: 'h264_qsv' as const, hwaccels: ['qsv', 'dxva2'], expected: 'qsv' },
  { vcodec: 'av1_qsv' as const, hwaccels: ['qsv'], expected: 'qsv' },
  { vcodec: 'h264_vaapi' as const, hwaccels: ['vaapi', 'qsv'], expected: 'vaapi' },
  { vcodec: 'libx264' as const, hwaccels: ['auto', 'dxva2'], expected: 'auto' }
] as const

export const FFMPEG_HWACCEL_APPEND_CASES = [
  {
    label: 'cuda + output format',
    hwaccel: 'cuda',
    explicitOut: undefined as string | null | undefined,
    expected: ['-y', '-hwaccel', 'cuda', '-hwaccel_output_format', 'cuda']
  },
  {
    label: 'auto без output format',
    hwaccel: 'auto',
    explicitOut: undefined as string | null | undefined,
    expected: ['-y', '-hwaccel', 'auto']
  },
  {
    label: 'cuda без авто output',
    hwaccel: 'cuda',
    explicitOut: null,
    expected: ['-y', '-hwaccel', 'cuda']
  }
] as const
