export const FFPROBE_BITRATE_FROM_BPS_CASES = [
  { bps: 5_000_000, locale: 'ru' as const, expected: '5.0 Мбит/с' },
  { bps: 768_000, locale: 'ru' as const, expected: '768 кбит/с' },
  { bps: 500, locale: 'ru' as const, expected: '500 бит/с' },
  { bps: 5_000_000, locale: 'en' as const, expected: '5.0 Mb/s' },
  { bps: 768_000, locale: 'en' as const, expected: '768 kb/s' }
] as const

export const FFPROBE_BITRATE_FROM_KBPS_CASES = [
  { kbps: 12_000, locale: 'ru' as const, expected: '12.00 Мбит/с' },
  { kbps: 192, locale: 'ru' as const, expected: '192 кбит/с' },
  { kbps: null, locale: 'ru' as const, expected: null }
] as const
