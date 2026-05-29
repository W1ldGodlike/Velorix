/** Mock image conversion UI for ref.13 (not backend model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const IC_ACTIVE_NAV: ProcessingNavSlug = 'tools'

export const IC_FILES_SUMMARY = '3 файла · PNG · качество 85%' as const

export const IC_STATUS_READY = 'Готово · 3 файла PNG' as const

export type ImageConversionStatusAccent = 'cyan' | 'magenta'

export type ImageConversionStatusRow = {
  label: string
  value: string
  accent?: ImageConversionStatusAccent
  mono?: boolean
}

export const IC_STATUS_ROWS: readonly ImageConversionStatusRow[] = [
  {
    label: 'Проект',
    value: 'НОВЫЙ СЕЗОН.vlxr · 01:36:53:08 · 3840×2160 (4K)',
    mono: true
  },
  { label: 'Движки', value: 'FFmpeg 6.1.1 · NVIDIA GeForce RTX 4090', accent: 'cyan' }
]

export type ImageConversionFileMock = {
  id: string
  name: string
  dims: string
  size: string
  format: string
  checked: boolean
}

export const IC_FILES: readonly ImageConversionFileMock[] = [
  {
    id: 'f1',
    name: 'landscape_001.jpg',
    dims: '3840×2160',
    size: '3.24 MB',
    format: 'JPG',
    checked: true
  },
  {
    id: 'f2',
    name: 'ui_mockup.png',
    dims: '1920×1080',
    size: '1.45 MB',
    format: 'PNG',
    checked: true
  },
  {
    id: 'f3',
    name: 'texture_pack.webp',
    dims: '4096×4096',
    size: '2.87 MB',
    format: 'WEBP',
    checked: true
  }
]

export const IC_FORMAT_QUICK = ['JPG', 'PNG', 'WEBP', 'BMP', 'TIFF'] as const

export const IC_OUTPUT_PATH = 'D:\\Projects\\VELORIX\\Media\\Converted\\Images\\'

export const IC_RESOURCES = [
  { id: 'cpu', label: 'CPU', percent: 18 },
  { id: 'gpu', label: 'GPU', percent: 42 },
  { id: 'ram', label: 'RAM', percent: 38 },
  { id: 'disk', label: 'Диск', percent: 22 }
] as const

export const IC_SHORTCUTS = [
  { action: 'Новый проект', keys: 'Ctrl + N' },
  { action: 'Открыть проект', keys: 'Ctrl + O' },
  { action: 'Импорт медиа', keys: 'Ctrl + I' },
  { action: 'Настройки', keys: 'Ctrl + ,' }
] as const

export const IC_RECENT = [
  { id: 'r1', label: 'Импорт медиафайла', time: '2 мин. назад' },
  { id: 'r2', label: 'Конвертация изображений', time: '15 мин. назад' },
  { id: 'r3', label: 'Экспорт проекта', time: '1 ч назад' }
] as const

export const IC_ACTIVE_TASKS = [
  { id: 't1', label: 'Render', percent: 68 },
  { id: 't2', label: 'Export', percent: 42 },
  { id: 't3', label: 'Backup', percent: 18 }
] as const
