export const FFMPEG_HWACCEL_OUTPUT_FORMAT_CASES = [
  { hwaccel: 'cuda', expected: 'cuda' },
  { hwaccel: 'd3d11va', expected: 'd3d11' },
  { hwaccel: 'auto', expected: null },
  { hwaccel: null, expected: null }
] as const

export const FFMPEG_HWACCEL_DECODE_CASES = [
  { vcodec: 'h264_nvenc' as const, hwaccels: ['cuda', 'dxva2'], expected: 'cuda' },
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
