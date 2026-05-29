/** Mock planner UI for ref.4 (not backend model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const PLANNER_ACTIVE_NAV: ProcessingNavSlug = 'planner'

export const PLANNER_TABS = [
  { id: 'schedule', label: 'Расписание задач' },
  { id: 'done', label: 'Выполненные' },
  { id: 'templates', label: 'Шаблоны' },
  { id: 'calendar', label: 'Календарь' },
  { id: 'triggers', label: 'Триггеры' },
  { id: 'dependencies', label: 'Зависимости' }
] as const

export type PlannerTaskKind = 'processing' | 'archive' | 'upload' | 'report' | 'backup' | 'system'

export type PlannerScheduledTask = {
  id: string
  title: string
  subtitle: string
  schedule: string
  active: boolean
  kind: PlannerTaskKind
  selected?: boolean
}

export const PLANNER_SCHEDULED_TASKS: readonly PlannerScheduledTask[] = [
  {
    id: 't1',
    title: 'Ежедневная обработка 4K',
    subtitle: 'H.265 · NVENC · 4K',
    schedule: 'Ежедневно в 08:00',
    active: true,
    kind: 'processing',
    selected: true
  },
  {
    id: 't2',
    title: 'Архивация проектов',
    subtitle: 'ZIP · D:\\Projects',
    schedule: 'Пн, Ср, Пт в 14:00',
    active: true,
    kind: 'archive'
  },
  {
    id: 't3',
    title: 'Загрузка роликов',
    subtitle: 'yt-dlp · playlist',
    schedule: 'Ежедневно в 22:00',
    active: true,
    kind: 'upload'
  },
  {
    id: 't4',
    title: 'Отчёт об ошибках',
    subtitle: 'CSV · email',
    schedule: 'Воскресенье 09:00',
    active: false,
    kind: 'report'
  },
  {
    id: 't5',
    title: 'Резервное копирование',
    subtitle: 'settings + presets',
    schedule: 'Ежедневно в 03:00',
    active: true,
    kind: 'backup'
  },
  {
    id: 't6',
    title: 'Batch export social',
    subtitle: 'TikTok · Reels',
    schedule: 'Сб 18:00',
    active: true,
    kind: 'processing'
  },
  {
    id: 't7',
    title: 'Очистка temp',
    subtitle: 'D:\\Velorix\\Temp',
    schedule: 'Ежедневно в 04:30',
    active: true,
    kind: 'system'
  },
  {
    id: 't8',
    title: 'Sync cloud assets',
    subtitle: 'S3 bucket',
    schedule: 'Вт, Чт 11:00',
    active: true,
    kind: 'upload'
  }
]

export const PLANNER_WEEK_DAYS = [
  { id: 'sat', label: 'Сб', date: '01.06' },
  { id: 'sun', label: 'Вс', date: '02.06' },
  { id: 'mon', label: 'Пн', date: '03.06' },
  { id: 'tue', label: 'Вт', date: '04.06' },
  { id: 'wed', label: 'Ср', date: '05.06', today: true },
  { id: 'thu', label: 'Чт', date: '06.06' },
  { id: 'fri', label: 'Пт', date: '07.06' }
] as const

export type PlannerTimelineBlock = {
  id: string
  label: string
  dayIndex: number
  startRow: number
  spanRows: number
  color: 'violet' | 'cyan' | 'green' | 'orange' | 'magenta'
}

/** Rows = 2-hour slots from 00:00 (row 1 = 00–02). */
export const PLANNER_TIMELINE_BLOCKS: readonly PlannerTimelineBlock[] = [
  { id: 'b1', label: '4K batch', dayIndex: 0, startRow: 5, spanRows: 2, color: 'violet' },
  { id: 'b2', label: '4K batch', dayIndex: 1, startRow: 5, spanRows: 2, color: 'violet' },
  { id: 'b3', label: '4K batch', dayIndex: 2, startRow: 5, spanRows: 2, color: 'violet' },
  { id: 'b4', label: '4K batch', dayIndex: 3, startRow: 5, spanRows: 2, color: 'violet' },
  { id: 'b5', label: '4K batch', dayIndex: 4, startRow: 5, spanRows: 2, color: 'violet' },
  { id: 'b6', label: '4K batch', dayIndex: 5, startRow: 5, spanRows: 2, color: 'violet' },
  { id: 'b7', label: '4K batch', dayIndex: 6, startRow: 5, spanRows: 2, color: 'violet' },
  { id: 'b8', label: 'Archive', dayIndex: 2, startRow: 8, spanRows: 1, color: 'cyan' },
  { id: 'b9', label: 'Upload', dayIndex: 4, startRow: 12, spanRows: 1, color: 'green' },
  { id: 'b10', label: 'Report', dayIndex: 6, startRow: 5, spanRows: 1, color: 'orange' }
]

export const PLANNER_TIMELINE_HOURS = [
  '00:00',
  '02:00',
  '04:00',
  '06:00',
  '08:00',
  '10:00',
  '12:00',
  '14:00',
  '16:00',
  '18:00',
  '20:00',
  '22:00'
] as const

export const PLANNER_NOW_MARKER = { dayIndex: 4, percent: 60.7, label: '14:32' } as const

export const PLANNER_SELECTED_DETAIL = {
  title: 'Ежедневная обработка 4K',
  kind: 'processing' as PlannerTaskKind,
  description:
    'Автоматическая пакетная обработка 4K-роликов из папки входа с кодированием H.265 через NVENC и выгрузкой в архив проекта.',
  nextRun: '06.06.2024 08:00',
  duration: '~4 часа',
  status: 'Активна',
  format: 'H.265',
  resolution: '3840×2160',
  bitrate: '45 Mbps',
  path: 'D:\\Velorix\\Input\\4K_Daily'
} as const

export type PlannerQueueItem = {
  id: string
  title: string
  percent: number
}

export const PLANNER_QUEUE: readonly PlannerQueueItem[] = [
  { id: 'q1', title: 'Cyberpunk_Edit', percent: 45 },
  { id: 'q2', title: 'Ocean_Waves', percent: 72 },
  { id: 'q3', title: 'Promo_Video', percent: 28 }
]

export const PLANNER_STATS = {
  done: 24,
  doneDelta: '+20%',
  success: 22,
  successRate: '91.7%',
  errors: 2,
  errorRate: '8.3%'
} as const

export const PLANNER_CALENDAR_DAYS = [
  null,
  null,
  null,
  null,
  null,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30
] as const

export const PLANNER_CALENDAR_ACTIVE_DAY = 5 as const
