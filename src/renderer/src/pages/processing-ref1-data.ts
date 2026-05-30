import {
  processingRef1DemoPreviewUrl,
  type ProcessingRef1DemoClipThumbId
} from '../../../shared/processing-ref1-demo-media'

/** ref.1 demo preview frame (`velorixref:///`). */
export const PROCESSING_REF1_DEMO_PREVIEW_URL = processingRef1DemoPreviewUrl()

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

/** Sidebar GPU widget (mock; ref.1 PNG). */
export const PROCESSING_GPU = {
  name: 'NVIDIA RTX 3090',
  vram: '24GB GDDR6X',
  loadPercent: 68,
  tempCelsius: 58
} as const

export const PROCESSING_PREVIEW_SAVED_LABEL = 'Сохранено 2 мин назад' as const

export const PROCESSING_PREVIEW_BADGE = '4K ULTRA HD' as const

export const PROCESSING_PREVIEW_ZOOM_PERCENT = 70 as const

export const PROCESSING_PREVIEW_VOLUME_PERCENT = 72 as const

export const PROCESSING_CENTER_EYEBROW = 'Обработка · монтаж' as const

export const PROCESSING_HEAD_CHIP = '4K · 60 fps' as const

/** Timeline selection length (ref.1 PNG statusbar). */
export const PROCESSING_SELECTION_TIMECODE = '00:00:00:00' as const

/** A1 lane hint pill (ref.1 PNG). */
export const PROCESSING_A1_TRACK_HINT = 'Высокая громк.' as const

/** Sidebar system rings (mock %; ref.1 PNG). */
export const PROCESSING_SYSTEM_RINGS = {
  cpu: 18,
  ram: 42,
  disk: 38
} as const

export const PROCESSING_CENTER_SUMMARY =
  'НОВЫЙ СЕЗОН · 5 дорожек · TC 01:36:53:08 · H.264 NVENC · 4K 60fps' as const

export const PROCESSING_STATUS_READY = 'Готово' as const

/** Statusbar project filename (ref.1 PNG left cluster). */
export const PROCESSING_STATUS_PROJECT = 'НОВЫЙ СЕЗОН.vlxr' as const

export const PROCESSING_TIMECODE = '01:36:53:08' as const

/** Timeline zoom slider mock (ref.1 PNG). */
export const PROCESSING_TIMELINE_ZOOM_PERCENT = 42 as const

/** Playhead position over lane area only (ref.1 PNG ~01:36:53:08). */
export const PROCESSING_TIMELINE_PLAYHEAD_PERCENT = 57 as const

export type ProcessingStatusAccent = 'cyan' | 'magenta'

export type ProcessingStatusRow = {
  label: string
  value: string
  accent?: ProcessingStatusAccent
  /** Mono timecode styling in statusbar. */
  mono?: boolean
}

export const PROCESSING_STATUS_CENTER: readonly ProcessingStatusRow[] = [
  { label: 'Длительность', value: PROCESSING_TIMECODE, accent: 'magenta', mono: true },
  { label: 'Разрешение', value: '3840×2160 (4K)', accent: 'cyan' },
  { label: 'Кадров', value: '174 708' },
  { label: 'Выделение', value: PROCESSING_SELECTION_TIMECODE, mono: true }
]

export const PROCESSING_STATUS_RIGHT: readonly ProcessingStatusRow[] = [
  { label: 'FFmpeg', value: '6.1.1' },
  { label: 'GPU', value: 'NVIDIA GeForce RTX 4080', accent: 'cyan' }
]

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

export type ProcessingRailFieldMock = {
  label: string
  value: string
}

export type ProcessingClipThumbTone = 'violet' | 'cyan' | 'magenta' | 'amber'

export type ProcessingClipMock = {
  name: string
  /** flex-grow weight on the lane (visual width only). */
  grow: number
  badges?: readonly string[]
  thumb?: boolean
  /** Strip tint for video clip thumbs (mock). */
  thumbTone?: ProcessingClipThumbTone
  /** Dedicated demo thumb PNG id (ref.1 mock). */
  thumbDemoId?: ProcessingRef1DemoClipThumbId
  waveform?: boolean
  /** Playhead / selection highlight (mock). */
  highlight?: boolean
  /** Linked to previous clip (ref.1 PNG corner chain). */
  linked?: boolean
}

/** Audio rail fields (ref.1 PNG; collapsed section). */
export const PROCESSING_RAIL_AUDIO_FIELDS: readonly ProcessingRailFieldMock[] = [
  { label: 'Кодек', value: 'AAC' },
  { label: 'Частота', value: '48 kHz' },
  { label: 'Каналы', value: 'Stereo' },
  { label: 'Битрейт', value: '320 kbps' }
]

export const PROCESSING_RAIL_FORMAT_FIELDS: readonly ProcessingRailFieldMock[] = [
  { label: 'Контейнер', value: 'MP4' },
  { label: 'Поток', value: 'Faststart' },
  { label: 'Цвет', value: 'bt709' }
]

export const PROCESSING_RAIL_PRESET_ACTIVE = 'YouTube 4K Premium' as const

/** FFmpeg rail header subtitle (ref.1 PNG). */
export const PROCESSING_RAIL_SUBTITLE = 'Профессиональная обработка медиафайлов' as const

/** Collapsed rail section hints (ref.1 PNG). */
export const PROCESSING_RAIL_SECTION_HINTS = {
  audio: 'AAC',
  format: 'MP4',
  presets: 'YouTube 4K',
  scenarios: '2',
  filters: 'FX',
  metadata: 'ID3'
} as const

export type ProcessingRailPresetMock = {
  name: string
  active?: boolean
}

/** FFmpeg rail preset list (ref.1 PNG; collapsed section). */
export const PROCESSING_RAIL_PRESETS: readonly ProcessingRailPresetMock[] = [
  { name: PROCESSING_RAIL_PRESET_ACTIVE, active: true },
  { name: 'Instagram Reels 1080p', active: false },
  { name: 'Archive ProRes HQ', active: false }
]

export const V1_CLIPS: readonly ProcessingClipMock[] = [
  {
    name: 'city_night_4k.mp4',
    grow: 4,
    badges: ['4K'],
    thumb: true,
    thumbTone: 'violet',
    thumbDemoId: 'city-night',
    highlight: true
  },
  {
    name: 'drive_sequence.mov',
    grow: 3,
    thumb: true,
    thumbTone: 'cyan',
    thumbDemoId: 'drive-sequence',
    linked: true
  },
  {
    name: 'neon_building.mp4',
    grow: 2,
    badges: ['fx'],
    thumb: true,
    thumbTone: 'magenta',
    thumbDemoId: 'neon-building',
    linked: true
  },
  {
    name: 'digital_billboard.mov',
    grow: 2,
    thumb: true,
    thumbTone: 'amber',
    thumbDemoId: 'digital-billboard',
    linked: true
  },
  {
    name: 'glitch_effect.mov',
    grow: 2,
    badges: ['fx'],
    thumb: true,
    thumbTone: 'magenta',
    thumbDemoId: 'glitch-effect',
    linked: true
  },
  {
    name: 'rain_reflections.mp4',
    grow: 3,
    thumb: true,
    thumbTone: 'violet',
    thumbDemoId: 'rain-reflections',
    linked: true
  }
]

/** ref.1 PNG: V2/V3 video lanes empty; clips only on V1. */
export const V2_CLIPS: readonly ProcessingClipMock[] = []

export const V3_CLIPS: readonly ProcessingClipMock[] = []

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
