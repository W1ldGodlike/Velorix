/** Mock slideshow UI for ref.15 (not backend model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const SS_ACTIVE_NAV: ProcessingNavSlug = 'tools'

export const SS_WORKSPACE_SUMMARY = '12 изображений · 00:00:48 · Fade · 4K' as const

export const SS_STATUS_READY = 'Готово · 12 кадров · 48 s' as const

export type SlideshowStatusAccent = 'cyan' | 'magenta'

export type SlideshowStatusRow = {
  label: string
  value: string
  accent?: SlideshowStatusAccent
  mono?: boolean
}

export const SS_STATUS_ROWS: readonly SlideshowStatusRow[] = [
  {
    label: 'Проект',
    value: 'НОВЫЙ СЕЗОН.vlxr · 01:36:53:08 · 3840×2160 (4K)',
    mono: true
  },
  { label: 'Движки', value: 'FFmpeg 6.1.1 · NVIDIA GeForce RTX 4090', accent: 'cyan' }
]

export type SlideshowImageMock = {
  id: string
  name: string
  dims: string
  size: string
  duration: string
  selected?: boolean
}

export const SS_IMAGES: readonly SlideshowImageMock[] = [
  {
    id: 'i1',
    name: 'image_01.jpg',
    dims: '3840×2160',
    size: '3.2 MB',
    duration: '4.0s',
    selected: true
  },
  { id: 'i2', name: 'image_02.jpg', dims: '3840×2160', size: '2.9 MB', duration: '4.0s' },
  { id: 'i3', name: 'image_03.png', dims: '1920×1080', size: '1.8 MB', duration: '4.0s' },
  { id: 'i4', name: 'image_04.jpg', dims: '3840×2160', size: '3.1 MB', duration: '4.0s' },
  { id: 'i5', name: 'image_05.webp', dims: '2560×1440', size: '2.1 MB', duration: '4.0s' }
]

export const SS_IMAGE_COUNT = 12

export const SS_TRANSITIONS = [
  { id: 'none', label: 'None' },
  { id: 'fade', label: 'Fade', active: true },
  { id: 'slide-l', label: 'Slide Left' },
  { id: 'slide-r', label: 'Slide Right' },
  { id: 'zoom-in', label: 'Zoom In' },
  { id: 'zoom-out', label: 'Zoom Out' },
  { id: 'blur', label: 'Cross Blur' },
  { id: 'flash', label: 'Flash' },
  { id: 'more', label: 'More…' }
] as const

export const SS_MUSIC = {
  name: 'cyberpunk_ambient_track.mp3',
  duration: '03:24'
} as const

export const SS_OUTPUT_PATH = 'D:\\Projects\\VELORIX\\Media\\Slideshow\\output\\'

export const SS_RESOURCES = [
  { id: 'cpu', label: 'CPU', percent: 18 },
  { id: 'gpu', label: 'GPU', percent: 42 },
  { id: 'ram', label: 'RAM', percent: 38 },
  { id: 'disk', label: 'Диск', percent: 22 }
] as const

export const SS_SHORTCUTS = [
  { action: 'Новый проект', keys: 'Ctrl + N' },
  { action: 'Открыть проект', keys: 'Ctrl + O' },
  { action: 'Импорт медиа', keys: 'Ctrl + I' },
  { action: 'Экспорт', keys: 'Ctrl + E' }
] as const

export const SS_RECENT = [
  { id: 'r1', label: 'Импорт медиафайла', time: '2 мин. назад' },
  { id: 'r2', label: 'Экспорт слайдшоу', time: '12 мин. назад' },
  { id: 'r3', label: 'Смена перехода Fade', time: '25 мин. назад' }
] as const

export const SS_ACTIVE_TASKS = [
  { id: 't1', label: 'Render', percent: 68 },
  { id: 't2', label: 'Export', percent: 42 },
  { id: 't3', label: 'Backup', percent: 18 }
] as const

export const SS_TIMELINE_MARKS = ['00:00', '00:12', '00:24', '00:36', '00:48'] as const
