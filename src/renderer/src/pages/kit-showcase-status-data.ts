/** Shared status chrome for ref.26 / ref.27 kit showcase (mock; not sign-off). */

export const KIT_STATUS_READY = 'Готово · 31 секции' as const

export type KitShowcaseStatusAccent = 'cyan' | 'magenta'

export type KitShowcaseStatusRow = {
  label: string
  value: string
  accent?: KitShowcaseStatusAccent
  mono?: boolean
}

export const KIT_STATUS_ROWS: readonly KitShowcaseStatusRow[] = [
  {
    label: 'Проект',
    value: 'НОВЫЙ СЕЗОН.vlxr · 01:36:53:08 · 3840×2160 (4K) · 174,708',
    mono: true
  },
  { label: 'Движки', value: 'FFmpeg 6.1.1 · NVIDIA GeForce RTX 4090', accent: 'cyan' }
]

export const KIT_SUMMARY_REF27 = 'UI kit · 31 blocks · components · v1.7.0' as const

export const KIT_SUMMARY_REF26 = 'UI states · 31 blocks · hover/focus/disabled · v1.7.0' as const
