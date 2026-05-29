/** Mock NLE data for ref.1 visual (not backend model). */

export type ProcessingNavSlug =
  | 'processing'
  | 'downloads'
  | 'terminal'
  | 'history'
  | 'inspector'
  | 'planner'
  | 'scenarios'
  | 'tools'
  | 'settings'
  | 'knowledge'
  | 'help'

export type ProcessingNavItem = {
  slug: ProcessingNavSlug
  label: string
}

export const PROCESSING_NAV: readonly ProcessingNavItem[] = [
  { slug: 'processing', label: 'Обработка' },
  { slug: 'downloads', label: 'Загрузки' },
  { slug: 'terminal', label: 'Терминал' },
  { slug: 'history', label: 'История' },
  { slug: 'inspector', label: 'Инспектор' },
  { slug: 'planner', label: 'Планировщик' },
  { slug: 'scenarios', label: 'Сценарии' },
  { slug: 'tools', label: 'Инструменты' },
  { slug: 'settings', label: 'Настройки' },
  { slug: 'knowledge', label: 'База знаний' },
  { slug: 'help', label: 'Справка' }
]

export type ProcessingClipMock = {
  name: string
  /** flex-grow weight on the lane (visual width only). */
  grow: number
  badges?: readonly string[]
  thumb?: boolean
  waveform?: boolean
}

export const V1_CLIPS: readonly ProcessingClipMock[] = [
  { name: 'city_night_4k.mp4', grow: 4, badges: ['4K'], thumb: true },
  { name: 'drive_sequence.mov', grow: 3, thumb: true },
  { name: 'neon_building.mp4', grow: 2, badges: ['fx'], thumb: true },
  { name: 'digital_billboard.mov', grow: 2, thumb: true },
  { name: 'glitch_effect.mov', grow: 2, badges: ['fx'], thumb: true },
  { name: 'rain_reflections.mp4', grow: 3, thumb: true }
]

export const V2_CLIPS: readonly ProcessingClipMock[] = [
  { name: 'b_roll_01.mp4', grow: 2, thumb: true },
  { name: 'b_roll_02.mp4', grow: 2, thumb: true }
]

export const V3_CLIPS: readonly ProcessingClipMock[] = [
  { name: 'overlay.mov', grow: 3, badges: ['fx'], thumb: true }
]

export const A1_CLIPS: readonly ProcessingClipMock[] = [
  { name: 'music_background.mp3', grow: 6, waveform: true }
]

export const A2_CLIPS: readonly ProcessingClipMock[] = [
  { name: 'ambience_city.wav', grow: 5, waveform: true }
]

export const TIMELINE_RULER_MARKS = [
  '01:30:00:00',
  '01:33:00:00',
  '01:36:00:00',
  '01:39:00:00',
  '01:42:00:00'
] as const

/** Visual-only waveform bars (count fixed for CSS nth-child). */
export const CLIP_WAVEFORM_BAR_COUNT = 22 as const
