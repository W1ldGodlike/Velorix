/** Mock scenarios UI for ref.7 (not backend model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const SCENARIOS_ACTIVE_NAV: ProcessingNavSlug = 'scenarios'

export const SCENARIOS_CENTER_SUMMARY = '24 сценария · 18 активных · 1 выполняется сейчас' as const

export const SCENARIOS_PAGINATION_SUMMARY = 'Показано 9 из 24' as const

export const SCENARIO_RUNS_SUMMARY = '3 из 156 запусков' as const

export const SCENARIOS_COUNT = 24 as const

export const SCENARIOS_STATUS_READY = `${SCENARIOS_COUNT} сценария · 1 running` as const

export type ScenariosStatusAccent = 'cyan' | 'magenta'

export type ScenariosStatusRow = {
  label: string
  value: string
  accent?: ScenariosStatusAccent
  mono?: boolean
}

export const SCENARIOS_STATUS_ROWS: readonly ScenariosStatusRow[] = [
  { label: 'Активных', value: '18', accent: 'cyan' },
  { label: 'Сейчас', value: '1', accent: 'magenta' },
  { label: 'Сегодня', value: '12 запусков', mono: true }
]

export const SCENARIOS_FILTER_PILLS = [
  { id: 'all', label: 'Все сценарии', count: 24, active: true },
  { id: 'video', label: 'Видео', count: 12 },
  { id: 'audio', label: 'Аудио', count: 6 },
  { id: 'subs', label: 'Субтитры', count: 4 },
  { id: 'export', label: 'Экспорт', count: 8 },
  { id: 'custom', label: 'Пользовательские', count: 16 }
] as const

export type ScenarioKind = 'video' | 'audio' | 'subs' | 'export' | 'custom' | 'organize'

export type ScenarioCardMock = {
  id: string
  title: string
  description: string
  tags: readonly string[]
  kind: ScenarioKind
  active: boolean
  lastUsed: string
  selected?: boolean
}

export const SCENARIO_CARDS: readonly ScenarioCardMock[] = [
  {
    id: 's1',
    title: 'YouTube 4K Downloader',
    description: 'Скачивание видео в максимальном качестве с автоматическими субтитрами',
    tags: ['Видео', 'Скачивание'],
    kind: 'video',
    active: true,
    lastUsed: '28.05.2024, 14:32',
    selected: true
  },
  {
    id: 's2',
    title: 'TikTok Batch Downloader',
    description: 'Пакетная загрузка роликов из списка URL',
    tags: ['Видео', 'Batch'],
    kind: 'video',
    active: true,
    lastUsed: '27.05.2024, 09:15'
  },
  {
    id: 's3',
    title: 'Video to H.265 (NVENC)',
    description: 'Перекодирование в H.265 с аппаратным ускорением NVIDIA',
    tags: ['Экспорт', 'NVENC'],
    kind: 'export',
    active: true,
    lastUsed: '26.05.2024, 22:40'
  },
  {
    id: 's4',
    title: 'Audio Extractor',
    description: 'Извлечение аудиодорожки в FLAC или AAC',
    tags: ['Аудио'],
    kind: 'audio',
    active: false,
    lastUsed: '25.05.2024, 18:02'
  },
  {
    id: 's5',
    title: 'Live Stream Recorder',
    description: 'Запись live-потоков с автоматическим split по размеру',
    tags: ['Видео', 'Live'],
    kind: 'video',
    active: true,
    lastUsed: '24.05.2024, 21:30'
  },
  {
    id: 's6',
    title: 'Subtitle Downloader',
    description: 'Загрузка и конвертация субтитров SRT/ASS',
    tags: ['Субтитры'],
    kind: 'subs',
    active: true,
    lastUsed: '23.05.2024, 11:08'
  },
  {
    id: 's7',
    title: 'File Organizer',
    description: 'Сортировка медиафайлов по дате и типу',
    tags: ['Custom'],
    kind: 'organize',
    active: true,
    lastUsed: '22.05.2024, 16:44'
  },
  {
    id: 's8',
    title: 'Media Info Reporter',
    description: 'Отчёт ffprobe по папке в CSV',
    tags: ['Custom', 'ffprobe'],
    kind: 'custom',
    active: false,
    lastUsed: '21.05.2024, 08:55'
  },
  {
    id: 's9',
    title: 'Custom Workflow',
    description: 'Пользовательский граф узлов без шаблона',
    tags: ['Пользовательские'],
    kind: 'custom',
    active: true,
    lastUsed: '20.05.2024, 19:12'
  }
]

export type ScenarioRunStatus = 'done' | 'running' | 'error'

export type ScenarioRunMock = {
  id: string
  title: string
  kind: ScenarioKind
  selected?: boolean
  status: ScenarioRunStatus
  statusLabel: string
  percent: number
  started: string
  duration: string
  result: string
}

export const SCENARIO_RECENT_RUNS: readonly ScenarioRunMock[] = [
  {
    id: 'r1',
    title: 'YouTube 4K Downloader',
    kind: 'video',
    selected: true,
    status: 'done',
    statusLabel: 'Завершён',
    percent: 100,
    started: '28.05.2024 14:32',
    duration: '00:07:18',
    result: '4 files saved'
  },
  {
    id: 'r2',
    title: 'Video to H.265 (NVENC)',
    kind: 'export',
    status: 'running',
    statusLabel: 'Выполняется',
    percent: 67,
    started: '28.05.2024 15:01',
    duration: '00:12:04',
    result: '—'
  },
  {
    id: 'r3',
    title: 'TikTok Batch Downloader',
    kind: 'video',
    status: 'error',
    statusLabel: 'Ошибка',
    percent: 0,
    started: '28.05.2024 12:44',
    duration: '00:00:32',
    result: 'yt-dlp timeout'
  }
]

export const SCENARIO_DETAIL = {
  title: 'YouTube 4K Downloader',
  kind: 'video' as ScenarioKind,
  active: true,
  id: 'SCN-2024-0001',
  created: '02.05.2024',
  updated: '28.05.2024, 14:32',
  description:
    'Автоматически скачивает видео с YouTube в максимальном доступном качестве, извлекает аудио и загружает субтитры при наличии.',
  tags: ['Видео', 'Скачивание', 'YouTube', '4K'],
  params: [
    { label: 'Quality', value: 'Максимальное (4K)' },
    { label: 'Format', value: 'MP4' },
    { label: 'Audio', value: 'AAC 320 kbps' },
    { label: 'Subtitles', value: 'Автоматически' },
    { label: 'Save folder', value: 'D:\\Velorix\\Downloads' },
    { label: 'Parallel', value: '3' }
  ],
  stats: {
    runs: 156,
    success: 142,
    successRate: '91%',
    errors: 14,
    errorRate: '9%',
    volume: '2.48 TB',
    timeSaved: '24h 32m'
  }
} as const
