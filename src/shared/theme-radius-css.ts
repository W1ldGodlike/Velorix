/**
 * §5 — канон скруглений (ТЗ: контролы 6–10 px, панели 8–12 px).
 * Значения задаются в base.css; main.css — только var(--fa-radius-*).
 */

export const THEME_RADIUS_CONTROL_TOKEN = '--fa-radius-control'
export const THEME_RADIUS_PANEL_TOKEN = '--fa-radius-panel'
export const THEME_RADIUS_LG_TOKEN = '--fa-radius-lg'

/** Запрещены литералы px/% в border-radius main.css. */
export const THEME_FORBIDDEN_MAIN_CSS_RADIUS_LITERAL = /border-radius:[^;]*(?:\d+px|\d+%)/g
