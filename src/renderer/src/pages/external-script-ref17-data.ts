/** Mock external script-filter UI for ref.17 (not backend model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const ESF_ACTIVE_NAV: ProcessingNavSlug = 'tools'

export const ESF_SCRIPT_PATH = 'D:\\Scripts\\filters\\denoise_filter.py'

export const ESF_SCRIPT_ARGS = '--preset medium --strength 0.75 --input "$input" --output "$output"'

export const ESF_WORK_DIR = 'D:\\Projects\\VELORIX\\Temp\\'

export const ESF_ENV_LINES = [
  'PYTHONPATH=D:\\Scripts\\libs;D:\\Scripts\\venv\\Lib\\site-packages',
  'PATH=D:\\Scripts\\bin;%PATH%'
] as const

export const ESF_VALIDATION = [
  { id: 'v1', label: 'Файл существует', ok: true },
  { id: 'v2', label: 'Права доступа', ok: true },
  { id: 'v3', label: 'Синтаксис скрипта', ok: true },
  { id: 'v4', label: 'Зависимости', ok: true }
] as const

export const ESF_COMMAND_PREVIEW =
  'python "D:\\Scripts\\filters\\denoise_filter.py" --preset medium --strength 0.75 --input "input.mkv" --output "output.mkv"'

export const ESF_CENTER_SUMMARY = 'denoise_filter.py · валидация OK · выполнение 78.9%' as const

export const ESF_LOG_LINES = [
  { id: 'l1', text: 'Python 3.10.11' },
  { id: 'l2', text: 'Инициализация фильтра…' },
  { id: 'l3', text: 'Загрузка модели: denoise_model_v2.onnx' },
  { id: 'l4', text: 'Обработка кадра 1214/1538…', selected: true }
] as const

export const ESF_PROGRESS = {
  percent: 78.9,
  elapsed: '00:00:05',
  remaining: '00:00:01'
} as const

export const ESF_STATUS_READY = 'Готово · denoise_filter.py · 78.9%' as const

export type ExternalScriptStatusAccent = 'cyan' | 'magenta'

export type ExternalScriptStatusRow = {
  label: string
  value: string
  accent?: ExternalScriptStatusAccent
  mono?: boolean
}

export const ESF_STATUS_ROWS: readonly ExternalScriptStatusRow[] = [
  {
    label: 'Проект',
    value: 'НОВЫЙ СЕЗОН.vlxr · 01:36:53:08 · 3840×2160 (4K)',
    mono: true
  },
  { label: 'Движки', value: 'FFmpeg 6.1.1 · NVIDIA GeForce RTX 4090', accent: 'cyan' }
]

export const ESF_RESOURCES = [
  { id: 'cpu', label: 'CPU', percent: 18 },
  { id: 'gpu', label: 'GPU', percent: 48 },
  { id: 'ram', label: 'RAM', percent: 68 },
  { id: 'disk', label: 'Диск', percent: 38 }
] as const

export const ESF_RECENT = [
  { id: 'r1', label: 'Импорт медиафайла', time: '2 мин. назад' },
  { id: 'r2', label: 'Анализ шума', time: '1 ч назад' },
  { id: 'r3', label: 'Запуск denoise_filter', time: '3 ч назад' }
] as const

export const ESF_ACTIVE_TASKS = [
  { id: 't1', label: 'Render', percent: 68 },
  { id: 't2', label: 'Export', percent: 42 }
] as const
