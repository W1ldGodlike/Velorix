/** Mock plugins manager UI for ref.25 (not backend plugin model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const PL_ACTIVE_NAV: ProcessingNavSlug = 'tools'

export const PL_CENTER_SUMMARY =
  '9 плагинов · 8 включено · 2 обновления · выбран ProRes Encoder' as const

export const PL_HEAD_CHIP = '9 plugins' as const

export const PL_TABS = [
  { id: 'installed', label: 'Установленные', active: true, badge: null },
  { id: 'sandbox', label: 'Песочница', active: false, badge: null },
  { id: 'updates', label: 'Обновления', active: false, badge: 2 },
  { id: 'settings', label: 'Настройки', active: false, badge: null }
] as const

export type PluginRowMock = {
  id: string
  abbr: string
  abbrTone: string
  name: string
  description: string
  version: string
  category: string
  developer: string
  enabled: boolean
  selected: boolean
}

export const PL_PLUGINS: readonly PluginRowMock[] = [
  {
    id: 'prores',
    abbr: 'Pr',
    abbrTone: 'purple',
    name: 'ProRes Encoder',
    description: 'Экспорт и кодирование Apple ProRes',
    version: 'v1.4.2',
    category: 'Кодеки',
    developer: 'Velorix Labs',
    enabled: true,
    selected: true
  },
  {
    id: 'ffpack',
    abbr: 'FF',
    abbrTone: 'blue',
    name: 'FFmpeg Filters Pack',
    description: 'Расширенный набор видеофильтров FFmpeg',
    version: 'v2.1.0',
    category: 'Фильтры',
    developer: 'Velorix Labs',
    enabled: true,
    selected: false
  },
  {
    id: 'pixel',
    abbr: 'PX',
    abbrTone: 'cyan',
    name: 'Pixel Formatter',
    description: 'Конвертация пиксельных форматов и цветовых пространств',
    version: 'v1.0.8',
    category: 'Утилиты',
    developer: 'Community',
    enabled: true,
    selected: false
  },
  {
    id: 'proxy',
    abbr: 'PG',
    abbrTone: 'orange',
    name: 'Proxy Generator',
    description: 'Автоматическое создание прокси-файлов для монтажа',
    version: 'v0.9.3',
    category: 'Производство',
    developer: 'Velorix Labs',
    enabled: false,
    selected: false
  },
  {
    id: 'av1',
    abbr: 'AV',
    abbrTone: 'green',
    name: 'AV1 Toolkit',
    description: 'Кодирование и анализ AV1 с аппаратным ускорением',
    version: 'v1.2.5',
    category: 'Кодеки',
    developer: 'Velorix Labs',
    enabled: true,
    selected: false
  },
  {
    id: 'lut',
    abbr: 'LU',
    abbrTone: 'pink',
    name: 'LUT Manager',
    description: 'Управление LUT и цветокоррекцией в проекте',
    version: 'v1.1.1',
    category: 'Цвет',
    developer: 'Community',
    enabled: true,
    selected: false
  },
  {
    id: 'stream',
    abbr: 'ST',
    abbrTone: 'blue',
    name: 'Stream Bridge',
    description: 'Интеграция RTMP/SRT потоков в timeline',
    version: 'v0.8.4',
    category: 'Сеть',
    developer: 'Velorix Labs',
    enabled: true,
    selected: false
  },
  {
    id: 'meta',
    abbr: 'MD',
    abbrTone: 'gray',
    name: 'Metadata Extractor',
    description: 'Извлечение EXIF/XMP и технических метаданных',
    version: 'v1.3.0',
    category: 'Утилиты',
    developer: 'Community',
    enabled: true,
    selected: false
  },
  {
    id: 'denoise',
    abbr: 'ND',
    abbrTone: 'purple',
    name: 'Neural Denoise',
    description: 'Шумоподавление на GPU с нейросетевой моделью',
    version: 'v2.0.2',
    category: 'AI',
    developer: 'Velorix Labs',
    enabled: true,
    selected: false
  }
]

export const PL_SELECTED = {
  name: 'ProRes Encoder',
  abbr: 'Pr',
  abbrTone: 'purple',
  version: 'v1.4.2',
  latest: 'v1.4.2',
  versionStatus: 'Актуальная',
  description:
    'Экспорт и кодирование видео в Apple ProRes с расширенными настройками профилей и битрейта.',
  developer: 'Velorix Labs',
  category: 'Кодеки',
  installed: '12.05.2025',
  size: '8.7 MB',
  compatibility: '1.7.0+',
  pluginId: 'com.velorix.proresencoder',
  sandboxStatus: 'Тестировался',
  sandboxLastRun: 'Сегодня, 13:42:18',
  sandboxResult: 'Успешно'
} as const

export const PL_PERMISSIONS = ['Кодеки', 'Файлы (чтение/запись)', 'Сеть', 'GPU'] as const

export const PL_RAIL_ACTIONS = [
  'Отключить плагин',
  'Проверить обновления',
  'Удалить плагин'
] as const

export const PL_STATUS_READY = 'Готово · 9 плагинов' as const

export type PluginsStatusAccent = 'cyan' | 'magenta'

export type PluginsStatusRow = {
  label: string
  value: string
  accent?: PluginsStatusAccent
  mono?: boolean
}

export const PL_STATUS_ROWS: readonly PluginsStatusRow[] = [
  {
    label: 'Проект',
    value: 'НОВЫЙ СЕЗОН.vlxr · 01:36:53:08 · 3840×2160 (4K) · 174,708 · TC 00:00:00:00',
    mono: true
  },
  { label: 'Движки', value: 'FFmpeg 6.1.1 · NVIDIA GeForce RTX 4090', accent: 'cyan' }
]
