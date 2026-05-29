/** Mock encoder benchmark UI for ref.24 (not backend benchmark model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const EB_ACTIVE_NAV: ProcessingNavSlug = 'tools'

export const EB_CENTER_SUMMARY = 'H.265 (NVENC) лидер · 5 кодеров · GPU 96%' as const

export const EB_HEAD_CHIP = '5 encoders' as const

export const EB_TABS = [
  { id: 'overview', label: 'Обзор', active: true },
  { id: 'compare', label: 'Сравнение', active: false },
  { id: 'gpu', label: 'GPU', active: false },
  { id: 'cpu', label: 'CPU', active: false },
  { id: 'settings', label: 'Настройки теста', active: false },
  { id: 'history', label: 'История', active: false }
] as const

export const EB_PROFILE = 'Balanced (по умолчанию)'

export const EB_KPIS = [
  {
    id: 'best',
    title: 'Лучший результат',
    value: 'H.265 (NVENC)',
    sub: '5.41× относительно x264 (Veryfast)',
    icon: 'trophy'
  },
  {
    id: 'speed',
    title: 'Средняя скорость',
    value: '467.2 FPS',
    sub: '1080p → 4K 10bit',
    icon: 'speed'
  },
  {
    id: 'time',
    title: 'Среднее время рендера',
    value: '00:02:14',
    sub: '4K (60fps · 10bit)',
    icon: 'clock'
  },
  {
    id: 'energy',
    title: 'Энергоэффективность',
    value: '0.72',
    sub: 'кадра на ватт',
    icon: 'leaf'
  }
] as const

export type EbEncoderRowTone = 'best' | 'good' | 'mid' | 'low'

export type EbEncoderRowMock = {
  id: string
  rank: number
  codec: string
  fps: string
  time: string
  size: string
  vmaf: string
  energy: string
  tone: EbEncoderRowTone
  selected?: boolean
}

export const EB_ENCODER_ROWS: readonly EbEncoderRowMock[] = [
  {
    id: 'e1',
    rank: 1,
    codec: 'H.265 (NVENC) · P7',
    fps: '512.4',
    time: '00:01:52',
    size: '1.24',
    vmaf: '96.8',
    energy: '0.82',
    tone: 'best',
    selected: true
  },
  {
    id: 'e2',
    rank: 2,
    codec: 'H.264 (NVENC) · HQ',
    fps: '468.2',
    time: '00:02:04',
    size: '1.58',
    vmaf: '94.2',
    energy: '0.74',
    tone: 'good'
  },
  {
    id: 'e3',
    rank: 3,
    codec: 'AV1 (NVENC) · P5',
    fps: '421.7',
    time: '00:02:18',
    size: '0.98',
    vmaf: '97.1',
    energy: '0.69',
    tone: 'good'
  },
  {
    id: 'e4',
    rank: 4,
    codec: 'x265 (CPU) · medium',
    fps: '84.3',
    time: '00:11:42',
    size: '1.12',
    vmaf: '96.4',
    energy: '0.31',
    tone: 'mid'
  },
  {
    id: 'e5',
    rank: 5,
    codec: 'x264 (CPU) · veryfast',
    fps: '94.7',
    time: '00:10:28',
    size: '1.86',
    vmaf: '91.5',
    energy: '0.28',
    tone: 'low'
  }
]

export const EB_CHART_CURSOR = { at: '60s', fps: '468 FPS' } as const

export const EB_GPU_LOAD = {
  name: 'NVIDIA RTX 4090',
  load: 96,
  vram: '18.3 / 24.0 GB',
  temp: '72°C',
  power: '312W',
  core: '2382 MHz',
  mem: '2730 MHz',
  bandwidth: '10502 MHz'
} as const

export const EB_CPU_LOAD = {
  name: 'AMD Ryzen 9 7950X',
  load: 68,
  thread: '86%',
  freq: '4.6 GHz',
  temp: '64°C',
  power: '142W',
  packets: '158.2K'
} as const

export const EB_RAM_DISK = [
  { id: 'ram', label: 'RAM', percent: 83, detail: '13.2 / 16.0 GB' },
  { id: 'disk', label: 'Disk', percent: 64, detail: '2.1 GB/s' }
] as const

export const EB_FRAME_STATS = [
  { id: 'avg', label: 'Avg', value: '1.91 ms' },
  { id: 'med', label: 'Median', value: '1.84 ms' },
  { id: 'min', label: 'Min', value: '1.32 ms' },
  { id: 'max', label: 'Max', value: '4.87 ms' },
  { id: 'p95', label: 'P95', value: '2.71 ms' }
] as const

export const EB_GPU_INFO = [
  { id: 'g1', label: 'Модель', value: 'NVIDIA GeForce RTX 4090' },
  { id: 'g2', label: 'Драйвер', value: '552.22' },
  { id: 'g3', label: 'CUDA ядра', value: '16384' },
  { id: 'g4', label: 'Память', value: '24 GB GDDR6X' }
] as const

export const EB_CODEC_BADGES = [
  'NVENC H.264',
  'NVENC H.265',
  'NVENC AV1',
  'NVDEC H.264',
  'NVDEC H.265',
  'NVDEC AV1'
] as const

export const EB_TEMP_PROFILE = { min: '42°C', avg: '72°C', max: '82°C' } as const

export const EB_TEST_DETAILS = [
  { id: 'r', label: 'Разрешение', value: '4K (3840×2160)' },
  { id: 'fps', label: 'FPS', value: '60' },
  { id: 'bit', label: 'Глубина', value: '10-bit' },
  { id: 'dur', label: 'Длительность', value: '120 с' },
  { id: 'src', label: 'Источник', value: 'Big Buck Bunny' },
  { id: 'prof', label: 'Профиль', value: 'Balanced' },
  { id: 'rep', label: 'Повторы', value: '3' },
  { id: 'pri', label: 'Приоритет', value: 'Высокий' }
] as const

export const EB_RAIL_ACTIONS = [
  'Запустить полный тест',
  'Сравнить выбранные',
  'Экспортировать отчёт',
  'Сохранить профиль'
] as const

export const EB_STATUS_READY = 'Готово · H.265 (NVENC) лидер' as const

export type EncoderBenchmarkStatusAccent = 'cyan' | 'magenta'

export type EncoderBenchmarkStatusRow = {
  label: string
  value: string
  accent?: EncoderBenchmarkStatusAccent
  mono?: boolean
}

export const EB_STATUS_ROWS: readonly EncoderBenchmarkStatusRow[] = [
  {
    label: 'Проект',
    value: 'НОВЫЙ СЕЗОН.vlxr · 01:36:53:08 · 3840×2160 (4K) · 174,708 · TC 00:00:00:00',
    mono: true
  },
  { label: 'Движки', value: 'FFmpeg 6.1.1 · NVIDIA GeForce RTX 4090', accent: 'cyan' }
]
