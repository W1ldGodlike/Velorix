/** Mock export preset name modal UI for ref.18 (not backend model). */

export const EPN_PRESET_NAME = 'Мой пресет экспорта 4K'

export const EPN_NAME_COUNT = { current: 22, max: 50 } as const

export const EPN_CATEGORY = 'Пользовательские пресеты'

export const EPN_MODAL_CHIP = '4K H.264' as const

export const EPN_MODAL_SUMMARY = 'MP4 H.264 · 4K · High · 6 параметров' as const

/** @deprecated Use EPN_MODAL_SUMMARY */
export const EPN_MODAL_META = EPN_MODAL_SUMMARY

export const EPN_FILES = [
  {
    id: 'f1',
    name: 'cyberpunk_city_4k.mp4',
    meta: '3840×2160 · H.264 · 01:12:08 · 8.2 GB',
    selected: true
  },
  { id: 'f2', name: 'neon_street_scene.mkv', meta: '3840×2160 · H.265 · 00:45:22 · 4.1 GB' },
  { id: 'f3', name: 'synthwave_animation.mov', meta: '1920×1080 · ProRes · 00:08:15 · 1.8 GB' }
] as const

export const EPN_PRESET_TILES = [
  { id: 'yt4k', label: 'YouTube 4K', active: true },
  { id: 'yt1080', label: 'YouTube 1080p' },
  { id: 'ig', label: 'Instagram' },
  { id: 'tt', label: 'TikTok' },
  { id: 'tw', label: 'Twitter' }
] as const

export const EPN_INFO_ROWS = [
  { id: 'i1', label: 'Формат', value: 'MP4 (H.264)' },
  { id: 'i2', label: 'Разрешение', value: '3840×2160 (4K)' },
  { id: 'i3', label: 'Качество', value: 'High' },
  { id: 'i4', label: 'FPS', value: '60' },
  { id: 'i5', label: 'Битрейт', value: '50 Mbps' },
  { id: 'i6', label: 'Аудио', value: 'AAC, 320 kbps' }
] as const

export const EPN_STATUS_READY = 'Готово · 3 файла · YouTube 4K' as const

export type ExportPresetStatusAccent = 'cyan' | 'magenta'

export type ExportPresetStatusRow = {
  label: string
  value: string
  accent?: ExportPresetStatusAccent
  mono?: boolean
}

export const EPN_STATUS_ROWS: readonly ExportPresetStatusRow[] = [
  {
    label: 'Проект',
    value: 'НОВЫЙ СЕЗОН.vlxr · 01:36:53:08 · 3840×2160 (4K)',
    mono: true
  },
  { label: 'Движки', value: 'FFmpeg 6.1.1 · NVIDIA GeForce RTX 4090', accent: 'cyan' }
]
