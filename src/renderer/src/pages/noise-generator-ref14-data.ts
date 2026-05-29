/** Mock noise/silence generator UI for ref.14 (not backend model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const NG_ACTIVE_NAV: ProcessingNavSlug = 'tools'

export const NG_CENTER_SUMMARY = 'WHITE NOISE · 48 kHz · Stereo · 60 s' as const

export const NG_STATUS_READY = 'Готово · WHITE NOISE 60 s' as const

export type NoiseGeneratorStatusAccent = 'cyan' | 'magenta'

export type NoiseGeneratorStatusRow = {
  label: string
  value: string
  accent?: NoiseGeneratorStatusAccent
  mono?: boolean
}

export const NG_STATUS_ROWS: readonly NoiseGeneratorStatusRow[] = [
  {
    label: 'Проект',
    value: 'НОВЫЙ СЕЗОН.vlxr · 01:36:53:08 · 3840×2160 (4K)',
    mono: true
  },
  { label: 'Движки', value: 'FFmpeg 6.1.1 · NVIDIA GeForce RTX 4090', accent: 'cyan' }
]

export type NoiseGenTypeId = 'white' | 'pink' | 'silence' | 'custom'

export type NoiseGenTypeMock = {
  id: NoiseGenTypeId
  title: string
  hint: string
  active?: boolean
}

export const NG_TYPES: readonly NoiseGenTypeMock[] = [
  {
    id: 'white',
    title: 'WHITE NOISE',
    hint: 'Равномерный спектр на всех частотах',
    active: true
  },
  { id: 'pink', title: 'PINK NOISE', hint: 'Спад −3 dB на октаву, естественный фон' },
  { id: 'silence', title: 'SILENCE', hint: 'Цифровая тишина с заданной длительностью' },
  { id: 'custom', title: 'CUSTOM', hint: 'Пользовательский профиль амплитуды' }
]

export const NG_OUTPUT_PATH = 'D:\\Projects\\VELORIX\\Media\\Generated\\noise_white_48k.wav'

export const NG_RESOURCES = [
  { id: 'cpu', label: 'CPU', percent: 18 },
  { id: 'gpu', label: 'GPU', percent: 42 },
  { id: 'ram', label: 'RAM', percent: 38 },
  { id: 'disk', label: 'Диск', percent: 22 }
] as const

export const NG_SHORTCUTS = [
  { action: 'Новый проект', keys: 'Ctrl + N' },
  { action: 'Открыть проект', keys: 'Ctrl + O' },
  { action: 'Превью', keys: 'Space' },
  { action: 'Экспорт', keys: 'Ctrl + E' }
] as const

export const NG_RECENT = [
  { id: 'r1', label: 'Генерация white noise', time: '2 мин. назад' },
  { id: 'r2', label: 'Экспорт WAV 48 kHz', time: '18 мин. назад' },
  { id: 'r3', label: 'Импорт пресета pink', time: '1 ч назад' }
] as const

export const NG_ACTIVE_TASKS = [
  { id: 't1', label: 'Render', percent: 68 },
  { id: 't2', label: 'Export', percent: 42 },
  { id: 't3', label: 'Backup', percent: 18 }
] as const

export const NG_WAVEFORM_MARKS = [
  '00:00:00',
  '00:00:15',
  '00:00:30',
  '00:00:45',
  '00:01:00'
] as const

export const NG_SPECTRUM_MARKS = ['20 Hz', '200', '2 kHz', '20 kHz'] as const
