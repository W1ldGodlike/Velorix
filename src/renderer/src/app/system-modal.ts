/** System modals refs 11, 18–25 (bootstrap ids). */

export type SystemModalId = 'about' | 'quit-confirm' | 'ffmpeg-error' | 'export-preset-name'

export const SYSTEM_MODAL_TITLES: Record<SystemModalId, string> = {
  about: 'О программе',
  'quit-confirm': 'Закрыть Velorix?',
  'ffmpeg-error': 'Ошибка FFmpeg',
  'export-preset-name': 'Имя пресета экспорта'
}
