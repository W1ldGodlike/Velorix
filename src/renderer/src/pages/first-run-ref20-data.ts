/** Mock first-run engines wizard UI for ref.20 (not backend model). */

export type FirstRunEngineStatus = 'detected' | 'missing'

export type FirstRunEngineMock = {
  id: string
  name: string
  status: FirstRunEngineStatus
  version: string
  path: string
  selected?: boolean
}

export const FR_MAIN_SUMMARY = '2/3 движка обнаружены · yt-dlp требует установки' as const

export const FR_STATUS_READY = 'Шаг 1/5 · приветствие' as const

export type FirstRunStatusAccent = 'cyan' | 'magenta'

export type FirstRunStatusRow = {
  label: string
  value: string
  accent?: FirstRunStatusAccent
  mono?: boolean
}

export const FR_STATUS_ROWS: readonly FirstRunStatusRow[] = [
  { label: 'Движки', value: 'FFmpeg · FFprobe OK · yt-dlp missing', accent: 'cyan' },
  { label: 'GPU', value: 'NVIDIA GeForce RTX 4090', mono: true }
]

export const FR_STEPS = [
  { id: 's1', label: 'ПРИВЕТСТВИЕ' },
  { id: 's2', label: 'ПРОВЕРКА СИСТЕМЫ' },
  { id: 's3', label: 'УСТАНОВКА ДВИЖКОВ' },
  { id: 's4', label: 'НАСТРОЙКА ПУТЕЙ' },
  { id: 's5', label: 'ЗАВЕРШЕНИЕ' }
] as const

export const FR_ENGINES: readonly FirstRunEngineMock[] = [
  {
    id: 'ffmpeg',
    name: 'FFmpeg',
    status: 'detected',
    version: '6.1.1-essentials_build',
    path: 'D:\\Tools\\ffmpeg\\bin\\ffmpeg.exe',
    selected: true
  },
  {
    id: 'ffprobe',
    name: 'FFprobe',
    status: 'detected',
    version: '6.1.1-essentials_build',
    path: 'D:\\Tools\\ffmpeg\\bin\\ffprobe.exe'
  },
  {
    id: 'ytdlp',
    name: 'yt-dlp',
    status: 'missing',
    version: 'Не установлен',
    path: 'Не найден'
  }
]

export const FR_SCAN_PATHS = [
  'C:\\Tools\\ffmpeg\\bin',
  'C:\\ffmpeg\\bin',
  'C:\\Program Files\\ffmpeg\\bin',
  'D:\\Tools\\Media',
  'E:\\Portable\\ffmpeg\\bin'
] as const

export const FR_SYSTEM_SPECS = [
  { id: 'os', label: 'СИСТЕМА', value: 'Windows 10/11 (64-bit), Build 22631' },
  { id: 'cpu', label: 'ПРОЦЕССОР', value: 'Intel Core i7-12700K (12 ядер / 20 потоков)' },
  { id: 'ram', label: 'ПАМЯТЬ', value: '32 GB DDR4 (18.7 GB доступно)' },
  { id: 'gpu', label: 'ВИДЕОКАРТА', value: 'NVIDIA GeForce RTX 4090 (24 GB GDDR6X)' }
] as const
