/** Mock scenario builder UI for ref.16 (not backend model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const SB_ACTIVE_NAV: ProcessingNavSlug = 'scenarios'

export type ScenarioNodePaletteItem = {
  id: string
  label: string
}

export type ScenarioNodePaletteGroup = {
  id: string
  title: string
  items: readonly ScenarioNodePaletteItem[]
}

export const SB_NODE_GROUPS: readonly ScenarioNodePaletteGroup[] = [
  {
    id: 'src',
    title: 'ИСТОЧНИКИ',
    items: [
      { id: 'file', label: 'Файл' },
      { id: 'folder', label: 'Папка' },
      { id: 'http', label: 'HTTP Запрос' }
    ]
  },
  {
    id: 'proc',
    title: 'ОБРАБОТКА',
    items: [
      { id: 'convert', label: 'Конвертация' },
      { id: 'compress', label: 'Сжатие' },
      { id: 'edit', label: 'Редактирование' },
      { id: 'filter', label: 'Фильтр' }
    ]
  },
  {
    id: 'analysis',
    title: 'АНАЛИЗ',
    items: [
      { id: 'analyze', label: 'Анализ медиа' },
      { id: 'integrity', label: 'Проверка целостности' },
      { id: 'preview', label: 'Генерация превью' }
    ]
  },
  {
    id: 'out',
    title: 'ВЫВОД',
    items: [
      { id: 'save', label: 'Сохранить файл' },
      { id: 'send', label: 'Отправить' },
      { id: 'notify', label: 'Уведомление' }
    ]
  }
]

export const SB_CANVAS_NODES = [
  { id: 'n1', label: 'Файл', x: 4, y: 8 },
  { id: 'n2', label: 'Настройки', x: 4, y: 28 },
  { id: 'n3', label: 'Проверка целостности', x: 22, y: 12 },
  { id: 'n4', label: 'Конвертация', x: 40, y: 12 },
  { id: 'n5', label: 'Сжатие', x: 58, y: 12 },
  { id: 'n6', label: 'Генерация превью', x: 76, y: 12 },
  { id: 'n7', label: 'Сохранить файл', x: 88, y: 4 },
  { id: 'n8', label: 'Уведомление', x: 88, y: 24 }
] as const

export const SB_LOG_LINES = [
  { id: 'l1', time: '14:32:01', text: 'Сценарий запущен' },
  { id: 'l2', time: '14:32:02', text: 'Файл загружен (2.13 GB)' },
  { id: 'l3', time: '14:32:05', text: 'Проверка целостности: Success' },
  { id: 'l4', time: '14:32:18', text: 'Конвертация: 45% complete', selected: true },
  { id: 'l5', time: '14:32:31', text: 'Сжатие: 30% complete' },
  { id: 'l6', time: '14:32:48', text: 'Сценарий завершён успешно' }
] as const

export const SB_LOG_TABS = ['log', 'vars', 'results', 'errors'] as const

export const SB_WORKSPACE_SUMMARY = '8 узлов · Конвертация выбрана · Лог: 6 записей' as const

export const SB_STATUS_READY = 'Готово · 8 узлов · 6 log' as const

export type ScenarioBuilderStatusAccent = 'cyan' | 'magenta'

export type ScenarioBuilderStatusRow = {
  label: string
  value: string
  accent?: ScenarioBuilderStatusAccent
  mono?: boolean
}

export const SB_STATUS_ROWS: readonly ScenarioBuilderStatusRow[] = [
  {
    label: 'Проект',
    value: 'НОВЫЙ СЕЗОН.vlxr · 01:36:53:08 · 3840×2160 (4K)',
    mono: true
  },
  { label: 'Движки', value: 'FFmpeg 6.1.1 · NVIDIA GeForce RTX 4090', accent: 'cyan' }
]
