/** Mock FFmpeg error dialog UI for ref.22 (not backend stderr model). */

export const FE_MODAL_CHIP = 'E_STARTUP' as const

export const FE_MODAL_SUMMARY = 'FFMPEG_E_STARTUP · ERROR_FILE_NOT_FOUND · 4 строки лога' as const

/** @deprecated Use FE_MODAL_SUMMARY */
export const FE_MODAL_META = FE_MODAL_SUMMARY

export const FE_ERROR_CODE = 'FFMPEG_E_STARTUP'

export const FE_STARTUP_MESSAGE =
  "'D:\\Tools\\ffmpeg\\bin\\ffmpeg.exe' не является внутренней или внешней командой, исполняемой программой или пакетным файлом."

export const FE_DETAIL_ROWS = [
  { id: 'tool', label: 'Инструмент', value: 'FFmpeg' },
  { id: 'path', label: 'Путь', value: 'D:\\Tools\\ffmpeg\\bin\\ffmpeg.exe', selected: true },
  { id: 'args', label: 'Аргументы', value: '-version' },
  { id: 'time', label: 'Время', value: '14:35:21' },
  { id: 'exit', label: 'Код выхода', value: '1 (ERROR_FILE_NOT_FOUND)' }
] as const

export const FE_POSSIBLE_CAUSES = [
  { id: 'c1', text: 'FFmpeg не установлен или удалён с диска' },
  { id: 'c2', text: 'Указан неверный путь к исполняемому файлу' },
  { id: 'c3', text: 'Антивирус или политика безопасности блокирует запуск' },
  { id: 'c4', text: 'Недостаточно прав для чтения каталога или файла' }
] as const

export const FE_LOG_LINES = [
  { id: 'l1', text: '[14:35:21] [INFO] Запуск проверки FFmpeg…' },
  { id: 'l2', text: '[14:35:21] [INFO] Путь: D:\\Tools\\ffmpeg\\bin\\ffmpeg.exe' },
  {
    id: 'l3',
    text: "[14:35:21] [ERROR] 'ffmpeg.exe' не является внутренней или внешней командой…",
    selected: true
  },
  { id: 'l4', text: '[14:35:21] [ERROR] Код выхода: 1 (ERROR_FILE_NOT_FOUND)' }
] as const

export type FfmpegErrorActionMock = {
  id: string
  title: string
  description: string
  selected?: boolean
}

export const FE_ACTIONS: readonly FfmpegErrorActionMock[] = [
  {
    id: 'paths',
    title: 'Проверить пути движков',
    description: 'Открыть настройки и исправить путь к FFmpeg',
    selected: true
  },
  {
    id: 'install',
    title: 'Установить FFmpeg',
    description: 'Velorix может скачать и установить FFmpeg автоматически'
  },
  {
    id: 'av',
    title: 'Проверить антивирус',
    description: 'Убедиться, что FFmpeg не заблокирован защитником'
  }
]

export const FE_STATUS_READY = 'Ошибка · FFmpeg startup' as const

export type FfmpegErrorStatusAccent = 'cyan' | 'magenta'

export type FfmpegErrorStatusRow = {
  label: string
  value: string
  accent?: FfmpegErrorStatusAccent
  mono?: boolean
}

export const FE_STATUS_ROWS: readonly FfmpegErrorStatusRow[] = [
  {
    label: 'Проект',
    value: 'НОВЫЙ СЕЗОН.vlxr · 01:36:53:08 · 3840×2160 (4K) · 174,708 · TC 00:00:00:00',
    mono: true
  },
  { label: 'Движки', value: 'FFmpeg — не найден · NVIDIA GeForce RTX 4090', accent: 'cyan' }
]
