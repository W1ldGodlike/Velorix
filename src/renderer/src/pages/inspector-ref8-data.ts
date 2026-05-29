/** Mock media inspector UI for ref.8 (not backend model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const INSPECTOR_ACTIVE_NAV: ProcessingNavSlug = 'inspector'

export const INSPECTOR_CENTER_SUMMARY =
  'Cyberpunk_Edit_4K.mp4 · 3840×2160 · H.265 · 2.48 GB · ffprobe OK' as const

export const INSPECTOR_TABS = [
  { id: 'overview', label: 'Обзор', count: 1, active: true },
  { id: 'video', label: 'Видео', count: 12 },
  { id: 'audio', label: 'Аудио', count: 3 },
  { id: 'streams', label: 'Потоки', count: 4 },
  { id: 'frames', label: 'Кадры', count: 7963 },
  { id: 'analysis', label: 'Анализ', count: 7 },
  { id: 'metadata', label: 'Метаданные', count: 24 },
  { id: 'log', label: 'Журнал', count: 18 }
] as const

export const INSPECTOR_STATUS_READY = 'Cyberpunk_Edit_4K.mp4 · ffprobe OK' as const

export type InspectorStatusAccent = 'cyan' | 'magenta'

export type InspectorStatusRow = {
  label: string
  value: string
  accent?: InspectorStatusAccent
  mono?: boolean
}

export const INSPECTOR_STATUS_ROWS: readonly InspectorStatusRow[] = [
  { label: 'Очередь', value: '0 файлов', accent: 'cyan' },
  { label: 'Ресурсы', value: 'CPU 12% · RAM 42% · VRAM 6.2/24 GB', mono: true }
]

export const INSPECTOR_FILE = {
  name: 'Cyberpunk_Edit_4K.mp4',
  specs: '3840×2160 · 23.976 fps · 10-bit · H.265 (HEVC)',
  path: 'D:\\Velorix\\Projects\\Cyberpunk\\Cyberpunk_Edit_4K.mp4',
  container: 'MP4 (MPEG-4)',
  duration: '00:05:32:18',
  size: '2.48 GB',
  created: '28.05.2024 14:22',
  modified: '28.05.2024 18:45',
  app: 'Adobe Premiere Pro 24.2',
  md5: 'a3f8c2…9e1b'
} as const

export const INSPECTOR_TIMECODE = {
  current: '00:01:24:17',
  total: '00:05:32:18'
} as const

export const INSPECTOR_STREAMS = [
  { id: 'v1', label: 'Video #1', detail: 'HEVC · 4K · 23.976 fps · 10 bit', active: true },
  { id: 'a1', label: 'Audio #1', detail: 'AAC · 2.0 · 48 kHz · 320 kbps', active: true },
  { id: 's1', label: 'Subtitles (2)', detail: 'SRT, ASS', active: false }
] as const

export const INSPECTOR_ANALYSIS = [
  { label: 'Кадров всего', value: '7,963' },
  { label: 'Первый TC', value: '00:00:00:00' },
  { label: 'Последний TC', value: '00:05:32:17' },
  { label: 'Keyframes', value: '198 (2.49%)' },
  { label: 'Средний размер кадра', value: '312 KB' },
  { label: 'Aspect ratio', value: '16:9' },
  { label: 'Bit depth', value: '10 bit' }
] as const

export const INSPECTOR_FILMSTRIP = [
  { id: 'f1', time: '00:00:12' },
  { id: 'f2', time: '00:01:24' },
  { id: 'f3', time: '00:02:08' },
  { id: 'f4', time: '00:03:45' },
  { id: 'f5', time: '00:04:22' },
  { id: 'f6', time: '00:05:10' }
] as const

export const INSPECTOR_TECH_VIDEO = [
  { label: 'Codec', value: 'H.265 / HEVC' },
  { label: 'Profile', value: 'Main 10' },
  { label: 'Resolution', value: '3840×2160 (4K UHD)' },
  { label: 'Frame rate', value: '23.976 fps' },
  { label: 'Field order', value: 'Progressive' },
  { label: 'Color space', value: 'BT.2020' },
  { label: 'Color range', value: 'Limited' },
  { label: 'Bit depth', value: '10 bit' },
  { label: 'Bitrate avg', value: '62.4 Mbps' }
] as const

export const INSPECTOR_TECH_AUDIO = [
  { label: 'Codec', value: 'AAC LC' },
  { label: 'Channels', value: '2.0 Stereo' },
  { label: 'Sample rate', value: '48.0 kHz' },
  { label: 'Bit depth', value: '16 bit' },
  { label: 'Bitrate', value: '320 kbps' },
  { label: 'Language', value: 'und' }
] as const

export const INSPECTOR_TOOLS = [
  'Анализ качества видео',
  'Проверка битых кадров',
  'Извлечь субтитры',
  'Конвертировать файл',
  'Создать превью',
  'Открыть в плеере',
  'Показать в проводнике'
] as const
