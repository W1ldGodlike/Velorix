/** Mock knowledge portal UI for ref.5 (not backend model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const KNOWLEDGE_ACTIVE_NAV: ProcessingNavSlug = 'knowledge'

export const KNOWLEDGE_CATEGORY_PILLS = [
  { id: 'all', label: 'Все категории', count: null, active: true },
  { id: 'guides', label: 'Руководства', count: 24 },
  { id: 'solutions', label: 'Решения', count: 15 },
  { id: 'faq', label: 'FAQ', count: 32 },
  { id: 'settings', label: 'Настройки', count: 18 },
  { id: 'codecs', label: 'Кодеки', count: 12 },
  { id: 'templates', label: 'Шаблоны', count: 9 },
  { id: 'refs', label: 'Справочники', count: 7 }
] as const

export type KnowledgeCategorySlug =
  | 'start'
  | 'processing'
  | 'export'
  | 'downloads'
  | 'automation'
  | 'codecs'
  | 'settings'
  | 'troubleshoot'

export const KNOWLEDGE_SIDEBAR_CATEGORIES = [
  { slug: 'start' as KnowledgeCategorySlug, label: 'Начало работы', count: 13 },
  { slug: 'processing' as KnowledgeCategorySlug, label: 'Обработка видео', count: 28 },
  { slug: 'export' as KnowledgeCategorySlug, label: 'Экспорт и кодеки', count: 19 },
  { slug: 'downloads' as KnowledgeCategorySlug, label: 'Загрузки', count: 11 },
  { slug: 'automation' as KnowledgeCategorySlug, label: 'Автоматизация', count: 14 },
  { slug: 'codecs' as KnowledgeCategorySlug, label: 'Кодеки', count: 12 },
  { slug: 'settings' as KnowledgeCategorySlug, label: 'Настройки', count: 18 },
  { slug: 'troubleshoot' as KnowledgeCategorySlug, label: 'Troubleshooting', count: 22 }
] as const

export type KnowledgePopularCard = {
  id: string
  title: string
  description: string
  readMin: number
  views: string
  accent: 'violet' | 'cyan' | 'teal' | 'magenta'
}

export const KNOWLEDGE_POPULAR: readonly KnowledgePopularCard[] = [
  {
    id: 'p1',
    title: 'Как начать работу с Velorix',
    description: 'Первый запуск, интерфейс и базовые настройки проекта',
    readMin: 12,
    views: '8.4K',
    accent: 'violet'
  },
  {
    id: 'p2',
    title: 'Аппаратное ускорение',
    description: 'NVENC, QSV, AMF — выбор и диагностика GPU',
    readMin: 8,
    views: '6.1K',
    accent: 'cyan'
  },
  {
    id: 'p3',
    title: 'Оптимальные настройки экспорта',
    description: 'H.265, битрейт, two-pass и social presets',
    readMin: 15,
    views: '5.7K',
    accent: 'teal'
  },
  {
    id: 'p4',
    title: 'Работа с субтитрами',
    description: 'Импорт SRT/ASS, burn-in и стили',
    readMin: 10,
    views: '4.2K',
    accent: 'magenta'
  }
]

export type KnowledgeRecentRow = {
  id: string
  title: string
  subtitle: string
  category: string
  categorySlug: KnowledgeCategorySlug
  updated: string
  views: string
  selected?: boolean
}

export const KNOWLEDGE_RECENT_ROWS: readonly KnowledgeRecentRow[] = [
  {
    id: 'r1',
    title: 'Troubleshooting frame drops',
    subtitle: 'Диагностика просадок FPS при preview',
    category: 'Troubleshooting',
    categorySlug: 'troubleshoot',
    updated: '31.05.2024',
    views: '1.2K',
    selected: true
  },
  {
    id: 'r2',
    title: 'Proxy and Cache settings',
    subtitle: 'Когда включать proxy и где хранить cache',
    category: 'Настройки',
    categorySlug: 'settings',
    updated: '30.05.2024',
    views: '980'
  },
  {
    id: 'r3',
    title: 'HEVC (H.265) format guide',
    subtitle: 'Профили, level и совместимость',
    category: 'Кодеки',
    categorySlug: 'codecs',
    updated: '29.05.2024',
    views: '2.4K'
  },
  {
    id: 'r4',
    title: 'yt-dlp cookies workflow',
    subtitle: 'Экспорт cookies и private playlists',
    category: 'Загрузки',
    categorySlug: 'downloads',
    updated: '28.05.2024',
    views: '876'
  },
  {
    id: 'r5',
    title: 'Batch export queue tips',
    subtitle: 'Параллельность и приоритеты',
    category: 'Экспорт',
    categorySlug: 'export',
    updated: '27.05.2024',
    views: '654'
  },
  {
    id: 'r6',
    title: 'Workflow planner triggers',
    subtitle: 'Cron, file-watch и зависимости',
    category: 'Автоматизация',
    categorySlug: 'automation',
    updated: '26.05.2024',
    views: '512'
  }
]

export const KNOWLEDGE_PREVIEW = {
  title: 'Как начать работу с Velorix',
  description:
    'Пошаговое руководство для новых пользователей: установка, первый проект, обзор интерфейса и рекомендуемые настройки.',
  updated: '30.05.2024',
  author: 'Velorix Team',
  readMin: 12,
  views: '8,428',
  category: 'Начало работы',
  tags: ['основы', 'настройка', 'интерфейс'],
  toc: [
    'Введение',
    'Обзор интерфейса',
    'Базовые настройки',
    'Импорт медиа',
    'Первый экспорт',
    'Горячие клавиши'
  ],
  attachments: [
    { id: 'a1', name: 'velorix-quickstart.pdf', size: '2.4 MB', kind: 'pdf' as const },
    { id: 'a2', name: 'interface-map.png', size: '840 KB', kind: 'image' as const },
    { id: 'a3', name: 'default-presets.json', size: '12 KB', kind: 'json' as const }
  ]
} as const
