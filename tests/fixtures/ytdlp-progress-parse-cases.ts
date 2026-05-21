import type { YtdlpDownloadProgressParts } from '../../src/main/services/ytdlp/ytdlp-progress-parser'

type ProgressCase = {
  label: string
  line: string
  expected: YtdlpDownloadProgressParts | null
}

export const YTDLP_PROGRESS_NULL_LINES: readonly string[] = [
  '[info] some',
  'random output',
  '',
  '[download] Destination: video.mp4'
]

export const YTDLP_PROGRESS_EQUAL_CASES: readonly ProgressCase[] = [
  {
    label: 'процент + скорость + ETA',
    line: '[download]  42.1% of   12.34MiB at  1.20MiB/s ETA 00:15',
    expected: {
      percent: '42.1%',
      speed: '1.20MiB/s',
      eta: '00:15',
      sizeTotal: '12.34MiB'
    }
  },
  {
    label: 'только процент',
    line: '[download] 7%',
    expected: { percent: '7%', speed: null, eta: null }
  },
  {
    label: 'fragment X of Y',
    line: '[download] fragment 5 of 120',
    expected: { percent: null, speed: 'фрагмент 5/120', eta: null }
  },
  {
    label: 'Total progress',
    line: '[download] Total progress: 33.3%',
    expected: { percent: '33.3%', speed: null, eta: null }
  },
  {
    label: 'Total progress над фрагментом',
    line: '[download] Total progress: 33.3% (fragment 5 of 120)',
    expected: { percent: '33.3%', speed: null, eta: null }
  },
  {
    label: 'playlist item',
    line: '[download] Downloading item 3 of 25',
    expected: { percent: null, speed: 'плейлист 3/25', eta: null }
  },
  {
    label: 'playlist video',
    line: '[download] Downloading video 1 of 5',
    expected: { percent: null, speed: 'плейлист 1/5', eta: null }
  },
  {
    label: 'N of M videos',
    line: '[download] Downloading 3 of 10 videos',
    expected: { percent: null, speed: 'плейлист 3/10', eta: null }
  },
  {
    label: 'frag без процентов',
    line: '[download] (frag 12/120)',
    expected: { percent: null, speed: 'фрагмент 12/120', eta: null }
  },
  {
    label: 'Sleeping',
    line: '[download] Sleeping 6.00 seconds ...',
    expected: { percent: null, speed: 'пауза 6.00 с', eta: null }
  },
  {
    label: 'Waiting reconnect',
    line: '[download] Waiting for reconnect after forced IP bind...',
    expected: { percent: null, speed: 'ожидание переподключения', eta: null }
  },
  {
    label: 'Waiting formats',
    line: '[download] Waiting for available formats...',
    expected: { percent: null, speed: 'ожидание', eta: null }
  },
  {
    label: 'Resuming byte',
    line: '[download] Resuming download at byte 1048576',
    expected: { percent: null, speed: 'продолжение загрузки', eta: null }
  },
  {
    label: 'm3u8',
    line: '[download] Downloading m3u8 information',
    expected: { percent: null, speed: 'манифест HLS', eta: null }
  },
  {
    label: 'player API',
    line: '[download] Downloading android player API JSON',
    expected: { percent: null, speed: 'метаданные API плеера', eta: null }
  },
  {
    label: 'webpage',
    line: '[download] Downloading webpage',
    expected: { percent: null, speed: 'веб-страница', eta: null }
  }
]

export const YTDLP_PROGRESS_PERCENT_NUMBER_CASES = [
  { input: '42.1%', expected: 42.1 },
  { input: '100%', expected: 100 },
  { input: null as string | null, expected: null },
  { input: '3 of 10', expected: null }
] as const

export const YTDLP_SPEED_TO_BPS_CASES = [
  { input: '999.36KiB/s', expected: 999.36 * 1024 },
  { input: '1.20MiB/s', expected: 1.2 * 1024 ** 2 },
  { input: '', expected: null },
  { input: 'Unknown', expected: null },
  { input: 'fragment 3 of 10', expected: null }
] as const
