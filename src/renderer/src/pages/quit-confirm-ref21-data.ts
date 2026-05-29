/** Mock quit confirm UI for ref.21 (not backend quit-confirm-contract). */

export type QuitTaskStatus = 'running' | 'waiting'

export type QuitActiveTaskMock = {
  id: string
  icon: 'video' | 'wave' | 'export'
  title: string
  detail: string
  status: QuitTaskStatus
  selected?: boolean
}

export type QuitExitOptionMock = {
  id: string
  title: string
  description: string
  accent: 'green' | 'orange' | 'blue' | 'red'
  checked: boolean
}

export const QC_MODAL_CHIP = '3 tasks' as const

export const QC_MODAL_SUMMARY = '3 активные задачи · 2 опции при выходе' as const

/** @deprecated Use QC_MODAL_SUMMARY */
export const QC_MODAL_META = QC_MODAL_SUMMARY

export const QC_ACTIVE_TASKS: readonly QuitActiveTaskMock[] = [
  {
    id: 't1',
    icon: 'video',
    title: 'Конвертация видео',
    detail: 'Обработка: 78.9% (1214/1538 кадров)',
    status: 'running',
    selected: true
  },
  {
    id: 't2',
    icon: 'wave',
    title: 'Анализ медиа',
    detail: 'Сканирование: 45.7%',
    status: 'running'
  },
  {
    id: 't3',
    icon: 'export',
    title: 'Экспорт проекта',
    detail: 'Подготовка к экспорту',
    status: 'waiting'
  }
]

export const QC_EXIT_OPTIONS: readonly QuitExitOptionMock[] = [
  {
    id: 'save',
    title: 'Сохранить проект',
    description: 'Сохранить текущий проект и настройки перед выходом',
    accent: 'green',
    checked: true
  },
  {
    id: 'stop',
    title: 'Остановить задачи',
    description: 'Остановить все активные задачи и процессы',
    accent: 'orange',
    checked: true
  },
  {
    id: 'tray',
    title: 'Свернуть в трей',
    description: 'Продолжить работу в фоне и свернуть в трей',
    accent: 'blue',
    checked: false
  },
  {
    id: 'exit',
    title: 'Выйти из приложения',
    description: 'Полностью закрыть Velorix и завершить все процессы',
    accent: 'red',
    checked: false
  }
]

export const QC_WARNING =
  'У вас есть несохраненные изменения в проекте. Рекомендуется сохранить проект перед выходом из приложения.'

export const QC_STATUS_READY = 'Готово · 3 активные задачи' as const

export type QuitConfirmStatusAccent = 'cyan' | 'magenta'

export type QuitConfirmStatusRow = {
  label: string
  value: string
  accent?: QuitConfirmStatusAccent
  mono?: boolean
}

export const QC_STATUS_ROWS: readonly QuitConfirmStatusRow[] = [
  {
    label: 'Проект',
    value: 'НОВЫЙ СЕЗОН.vlxr · 01:36:53:08 · 3840×2160 (4K)',
    mono: true
  },
  { label: 'Движки', value: 'FFmpeg 6.1.1 · NVIDIA GeForce RTX 4090', accent: 'cyan' }
]
