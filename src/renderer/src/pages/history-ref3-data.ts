/** Mock history UI for ref.3 (not backend model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const HISTORY_ACTIVE_NAV: ProcessingNavSlug = 'history'

export const HISTORY_DOMAIN_TABS = [
  { id: 'all', label: 'Все события' },
  { id: 'processing', label: 'Обработка' },
  { id: 'downloads', label: 'Загрузки' },
  { id: 'scripts', label: 'Сценарии' },
  { id: 'system', label: 'Система' },
  { id: 'errors', label: 'Ошибки' }
] as const

export type HistoryStatus = 'success' | 'error' | 'paused'

export type HistoryTypeSlug =
  | 'processing'
  | 'download'
  | 'script'
  | 'system'
  | 'import'
  | 'planner'
  | 'export'

export type HistoryEventKind = 'video' | 'download' | 'script' | 'system' | 'import' | 'planner'

export type HistoryRowMock = {
  id: string
  event: string
  file: string
  fileMeta?: string
  typeLabel: string
  typeSlug: HistoryTypeSlug
  kind: HistoryEventKind
  status: HistoryStatus
  statusLabel: string
  datetime: string
  duration: string
  size: string
}

export const HISTORY_ROWS: readonly HistoryRowMock[] = [
  {
    id: 'h1',
    event: 'Video processing completed',
    file: 'Mountains_4K_Nature.mp4',
    fileMeta: '3840×2160 · 23.976 fps',
    typeLabel: 'Обработка',
    typeSlug: 'processing',
    kind: 'video',
    status: 'success',
    statusLabel: 'Успешно',
    datetime: '31.05.2024 14:22',
    duration: '00:18:42',
    size: '4.97 GB'
  },
  {
    id: 'h2',
    event: 'Download paused',
    file: 'cyberpunk_trailer_4k.mp4',
    typeLabel: 'Загрузка',
    typeSlug: 'download',
    kind: 'download',
    status: 'paused',
    statusLabel: 'Пауза',
    datetime: '31.05.2024 13:05',
    duration: '—',
    size: '892 MB'
  },
  {
    id: 'h3',
    event: 'Script execution failed',
    file: 'batch_export_v2.js',
    typeLabel: 'Сценарии',
    typeSlug: 'script',
    kind: 'script',
    status: 'error',
    statusLabel: 'Ошибка',
    datetime: '31.05.2024 11:40',
    duration: '00:00:12',
    size: '—'
  },
  {
    id: 'h4',
    event: 'System backup completed',
    file: 'settings_backup.zip',
    typeLabel: 'Система',
    typeSlug: 'system',
    kind: 'system',
    status: 'success',
    statusLabel: 'Успешно',
    datetime: '31.05.2024 09:15',
    duration: '00:02:04',
    size: '128 MB'
  },
  {
    id: 'h5',
    event: 'FFmpeg export started',
    file: 'NOVY_SEZON.vlxr',
    fileMeta: 'H.265 · NVENC',
    typeLabel: 'Обработка',
    typeSlug: 'processing',
    kind: 'video',
    status: 'success',
    statusLabel: 'Успешно',
    datetime: '30.05.2024 22:18',
    duration: '01:36:53',
    size: '12.4 GB'
  },
  {
    id: 'h6',
    event: 'Media import from folder',
    file: 'D:\\Footage\\2024\\May',
    fileMeta: '47 files',
    typeLabel: 'Импорт',
    typeSlug: 'import',
    kind: 'import',
    status: 'success',
    statusLabel: 'Успешно',
    datetime: '30.05.2024 18:02',
    duration: '00:04:18',
    size: '18.2 GB'
  },
  {
    id: 'h7',
    event: 'Scheduled render queued',
    file: 'night_city_batch.vlxr',
    typeLabel: 'Планировщик',
    typeSlug: 'planner',
    kind: 'planner',
    status: 'success',
    statusLabel: 'Успешно',
    datetime: '30.05.2024 16:44',
    duration: '—',
    size: '—'
  },
  {
    id: 'h8',
    event: 'CSV export completed',
    file: 'history_may_2024.csv',
    typeLabel: 'Экспорт',
    typeSlug: 'export',
    kind: 'system',
    status: 'success',
    statusLabel: 'Успешно',
    datetime: '30.05.2024 12:30',
    duration: '00:00:03',
    size: '2.1 MB'
  },
  {
    id: 'h9',
    event: 'Download completed',
    file: 'massive_attack_teardrop.mkv',
    fileMeta: '1080p · VP9',
    typeLabel: 'Загрузка',
    typeSlug: 'download',
    kind: 'download',
    status: 'success',
    statusLabel: 'Успешно',
    datetime: '30.05.2024 10:11',
    duration: '00:07:55',
    size: '1.24 GB'
  },
  {
    id: 'h10',
    event: 'NVENC session limit reached',
    file: 'render_queue_03.mp4',
    typeLabel: 'Обработка',
    typeSlug: 'processing',
    kind: 'video',
    status: 'error',
    statusLabel: 'Ошибка',
    datetime: '29.05.2024 23:58',
    duration: '00:01:02',
    size: '—'
  }
]

export type HistoryErrorMock = {
  id: string
  title: string
  file: string
  time: string
}

export const HISTORY_RECENT_ERRORS: readonly HistoryErrorMock[] = [
  {
    id: 'e1',
    title: 'Недостаточно памяти',
    file: 'Mountains_4K_Nature.mp4',
    time: '31.05.2024 14:18'
  },
  {
    id: 'e2',
    title: 'Timeout waiting for yt-dlp',
    file: 'cyberpunk_trailer_4k.mp4',
    time: '31.05.2024 13:02'
  },
  {
    id: 'e3',
    title: 'NVENC session limit reached',
    file: 'render_queue_03.mp4',
    time: '29.05.2024 23:58'
  },
  {
    id: 'e4',
    title: 'Disk full on output volume',
    file: 'D:\\Velorix\\Output',
    time: '29.05.2024 21:14'
  }
]

export const HISTORY_DONUT_SEGMENTS = [
  { label: 'Обработка', count: 512, percent: 41, color: 'violet' },
  { label: 'Загрузки', count: 298, percent: 24, color: 'cyan' },
  { label: 'Сценарии', count: 156, percent: 12, color: 'magenta' },
  { label: 'Система', count: 186, percent: 15, color: 'green' },
  { label: 'Ошибки', count: 96, percent: 8, color: 'red' }
] as const

export const HISTORY_TOTAL_EVENTS = 1248 as const

export const HISTORY_TOTAL_EVENTS_LABEL = '1,248' as const
