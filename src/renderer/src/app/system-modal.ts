/** System modals refs 11, 18–25 (bootstrap ids). */

export type SystemModalId =
  | 'about'
  | 'quit-confirm'
  | 'ffmpeg-error'
  | 'export-preset-name'
  | 'engine-paths'
  | 'first-run-engines'
  | 'critical-crash'
  | 'encoder-benchmark'
  | 'plugins'

export const SYSTEM_MODAL_TITLES: Record<SystemModalId, string> = {
  about: 'О программе',
  'quit-confirm': 'Закрыть Velorix?',
  'ffmpeg-error': 'Ошибка FFmpeg',
  'export-preset-name': 'Имя пресета экспорта',
  'engine-paths': 'Пути к движкам',
  'first-run-engines': 'Установка движков',
  'critical-crash': 'Критический сбой',
  'encoder-benchmark': 'Бенчмарк кодеров',
  plugins: 'Плагины'
}

export const SYSTEM_MODAL_WIDE: ReadonlySet<SystemModalId> = new Set([
  'engine-paths',
  'first-run-engines',
  'encoder-benchmark',
  'critical-crash',
  'plugins'
])
