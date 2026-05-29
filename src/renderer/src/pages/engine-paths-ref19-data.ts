/** Mock engine paths UI for ref.19 (not backend model). */

export type EnginePathMock = {
  id: string
  name: string
  description: string
  path: string
  version: string
  valid: boolean
  selected?: boolean
}

export const ENG_MODAL_CHIP = '3 OK' as const

export const ENG_MODAL_SUMMARY = '3 движка · FFmpeg · FFprobe · yt-dlp · все валидны' as const

/** @deprecated Use ENG_MODAL_SUMMARY */
export const ENG_MODAL_META = ENG_MODAL_SUMMARY

export const ENG_ENGINES: readonly EnginePathMock[] = [
  {
    id: 'ffmpeg',
    name: 'FFmpeg',
    description: 'Мультимедийный фреймворк для обработки аудио и видео',
    path: 'D:\\Tools\\ffmpeg\\bin\\ffmpeg.exe',
    version: '6.1.1-essentials_build',
    valid: true,
    selected: true
  },
  {
    id: 'ffprobe',
    name: 'FFprobe',
    description: 'Инструмент анализа медиапотоков',
    path: 'D:\\Tools\\ffmpeg\\bin\\ffprobe.exe',
    version: '6.1.1-essentials_build',
    valid: true
  },
  {
    id: 'ytdlp',
    name: 'yt-dlp',
    description: 'Загрузчик видео для YouTube и других платформ',
    path: 'D:\\Tools\\yt-dlp\\yt-dlp.exe',
    version: '2024.05.27',
    valid: true
  }
]

export const ENG_SUMMARY = {
  status: 'Все движки настроены и готовы к работе',
  lastCheck: 'Сегодня, 14:35:21',
  checkStats: '7 выполнено · 7 успешно'
} as const

export const ENG_STATUS_READY = 'Готово · 3 движка валидны' as const

export type EnginePathsStatusAccent = 'cyan' | 'magenta'

export type EnginePathsStatusRow = {
  label: string
  value: string
  accent?: EnginePathsStatusAccent
  mono?: boolean
}

export const ENG_STATUS_ROWS: readonly EnginePathsStatusRow[] = [
  {
    label: 'Проект',
    value: 'НОВЫЙ СЕЗОН.vlxr · 01:36:53:08 · 3840×2160 (4K)',
    mono: true
  },
  { label: 'Движки', value: 'FFmpeg 6.1.1 · NVIDIA GeForce RTX 4090', accent: 'cyan' }
]
