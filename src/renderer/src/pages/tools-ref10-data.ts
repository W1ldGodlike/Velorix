/** Mock tools hub UI for ref.10 (not backend model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const TOOLS_ACTIVE_NAV: ProcessingNavSlug = 'tools'

export const TOOLS_GRID_SUMMARY = '10 инструментов' as const

export const TOOLS_STATUS_READY = 'Готово · 10 инструментов' as const

export type ToolsStatusAccent = 'cyan' | 'magenta'

export type ToolsStatusRow = {
  label: string
  value: string
  accent?: ToolsStatusAccent
  mono?: boolean
}

export const TOOLS_STATUS_ROWS: readonly ToolsStatusRow[] = [
  {
    label: 'Проект',
    value: 'НОВЫЙ СЕЗОН.vlxr · 01:36:53:08 · 3840×2160 (4K)',
    mono: true
  },
  { label: 'Движки', value: 'FFmpeg 6.1.1 · NVIDIA GeForce RTX 4080', accent: 'cyan' }
]

export type ToolsCardKind =
  | 'about'
  | 'maintenance'
  | 'images'
  | 'noise'
  | 'slideshow'
  | 'builder'
  | 'script'
  | 'engines'
  | 'plugins'
  | 'diagnostics'

export type ToolsCardMock = {
  id: string
  title: string
  description: string
  kind: ToolsCardKind
  selected?: boolean
}

export const TOOLS_CARDS: readonly ToolsCardMock[] = [
  {
    id: 't1',
    title: 'О программе',
    description: 'Информация о системе, версии и разработчике',
    kind: 'about',
    selected: true
  },
  {
    id: 't2',
    title: 'Обслуживание файлов',
    description: 'Анализ, очистка и оптимизация файловых данных',
    kind: 'maintenance'
  },
  {
    id: 't3',
    title: 'Конвертация изображений',
    description: 'Пакетная конвертация и обработка изображений',
    kind: 'images'
  },
  {
    id: 't4',
    title: 'Генератор шума/тишины',
    description: 'Создание шума, тишины и тестовых аудиосигналов',
    kind: 'noise'
  },
  {
    id: 't5',
    title: 'Слайдшоу',
    description: 'Создание слайдшоу из изображений и видео',
    kind: 'slideshow'
  },
  {
    id: 't6',
    title: 'Конструктор сценариев',
    description: 'Визуальный конструктор сценариев и автоматизации',
    kind: 'builder'
  },
  {
    id: 't7',
    title: 'Script-filter',
    description: 'Фильтрация и обработка сценариев по правилам',
    kind: 'script'
  },
  {
    id: 't8',
    title: 'Пути к движкам',
    description: 'Управление путями к движкам и внешним компонентам',
    kind: 'engines'
  },
  {
    id: 't9',
    title: 'Плагины',
    description: 'Управление плагинами, расширениями и модулями',
    kind: 'plugins'
  },
  {
    id: 't10',
    title: 'Диагностика',
    description: 'Диагностика системы и проверка компонентов',
    kind: 'diagnostics'
  }
]

export const TOOLS_QUICK_ACTIONS = [
  { id: 'q1', title: 'Открыть конфигурацию', hint: 'Открывает папку с файлами конфигурации' },
  { id: 'q2', title: 'Очистить кэш', hint: 'Очищает временные файлы и кэш системы' },
  {
    id: 'q3',
    title: 'Сбросить настройки',
    hint: 'Сбрасывает все настройки к значениям по умолчанию'
  },
  { id: 'q4', title: 'Экспорт логов', hint: 'Сохраняет системные логи и отчёты' }
] as const

export const TOOLS_RESOURCES = [
  { id: 'cpu', label: 'CPU', percent: 18 },
  { id: 'ram', label: 'RAM', percent: 42 },
  { id: 'gpu', label: 'GPU', percent: 68 },
  { id: 'disk', label: 'Диск', percent: 38 }
] as const

export const TOOLS_SHORTCUTS = [
  { action: 'Открыть проект', keys: 'Ctrl + O' },
  { action: 'Новый проект', keys: 'Ctrl + N' },
  { action: 'Импорт медиа', keys: 'Ctrl + I' },
  { action: 'Настройки', keys: 'Ctrl + ,' }
] as const

export const TOOLS_RECENT = [
  { id: 'r1', label: 'Конвертация изображений', time: '2 мин назад' },
  { id: 'r2', label: 'Обслуживание файлов', time: '15 мин назад' },
  { id: 'r3', label: 'Генератор шума', time: '1 ч назад' },
  { id: 'r4', label: 'Диагностика системы', time: '3 ч назад' },
  { id: 'r5', label: 'Экспорт логов', time: '5 ч назад' }
] as const

export const TOOLS_LINKS = ['Документация', 'Сообщество', 'Проверить обновления'] as const
