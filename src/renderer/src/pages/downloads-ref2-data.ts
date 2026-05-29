/** Mock downloads UI for ref.2 (not backend model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const DOWNLOADS_ACTIVE_NAV: ProcessingNavSlug = 'downloads'

export const DOWNLOAD_FILTER_TABS = [
  { id: 'all', label: 'Все' },
  { id: 'active', label: 'Активные', count: 5 },
  { id: 'done', label: 'Завершённые', count: 142 },
  { id: 'errors', label: 'Ошибки', count: 3 },
  { id: 'paused', label: 'Пауза' }
] as const

export type DownloadRowMock = {
  id: string
  title: string
  source: string
  platform: 'youtube' | 'vimeo'
  badges: readonly string[]
  percent: number
  downloaded: string
  total: string
  speed: string
  eta: string
  selected?: boolean
}

export const ACTIVE_DOWNLOADS: readonly DownloadRowMock[] = [
  {
    id: 'd1',
    title: 'Cyberpunk 2077 — Phantom Liberty | Official Trailer',
    source: 'youtube.com/watch?v=…',
    platform: 'youtube',
    badges: ['4K', 'H.265'],
    percent: 45,
    downloaded: '2.24 GB',
    total: '4.97 GB',
    speed: '18.4 MB/s',
    eta: '02:14',
    selected: true
  },
  {
    id: 'd2',
    title: 'Blade Runner 2049 — Cityscape 8K HDR',
    source: 'vimeo.com/…',
    platform: 'vimeo',
    badges: ['8K', 'HEVC', 'HDR'],
    percent: 72,
    downloaded: '6.1 GB',
    total: '8.4 GB',
    speed: '24.1 MB/s',
    eta: '01:05'
  },
  {
    id: 'd3',
    title: 'Neon City Drive — NVENC Test Clip',
    source: 'youtube.com/watch?v=…',
    platform: 'youtube',
    badges: ['4K', 'NVENC'],
    percent: 12,
    downloaded: '420 MB',
    total: '3.2 GB',
    speed: '9.8 MB/s',
    eta: '04:52'
  },
  {
    id: 'd4',
    title: 'IMAX Documentary — Deep Space 4K',
    source: 'youtube.com/watch?v=…',
    platform: 'youtube',
    badges: ['4K', 'IMAX'],
    percent: 88,
    downloaded: '1.9 GB',
    total: '2.1 GB',
    speed: '31.2 MB/s',
    eta: '00:18'
  },
  {
    id: 'd5',
    title: 'Velorix Showcase — HEVC Master',
    source: 'youtube.com/watch?v=…',
    platform: 'youtube',
    badges: ['4K', 'HEVC'],
    percent: 33,
    downloaded: '890 MB',
    total: '2.7 GB',
    speed: '12.6 MB/s',
    eta: '03:01'
  }
]

export const QUEUE_DOWNLOADS: readonly Pick<DownloadRowMock, 'id' | 'title' | 'badges'>[] = [
  { id: 'q1', title: 'Massive Attack — Teardrop (Official Video)', badges: ['4K'] },
  { id: 'q2', title: 'Depeche Mode — Enjoy the Silence 4K Remaster', badges: ['4K'] }
]

export const DOWNLOADS_STATUS = {
  parallel: 5,
  speedLimit: 'Неограниченно',
  folder: 'D:\\Velorix\\Downloads'
} as const

export const DOWNLOADS_STATS = {
  todayGb: '42.7 GB',
  avgSpeed: '18.6 MB/s',
  peakSpeed: '82.4 MB/s',
  timeSpent: '01:42:37'
} as const
