/**
 * §4.4 — `prefers-reduced-motion` в `src/renderer/src/assets/main.css`.
 */
export const UI_REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion: reduce)' as const

/** Селекторы с заметными transition (details chevron, pill switch, downloads progress). */
export const UI_REDUCED_MOTION_TRANSITION_SELECTORS = [
  '.app-url-summary::before',
  '.app-export-preview-summary::before',
  '.app-downloads-progress-fill',
  '.app-pill-switch-knob'
] as const
