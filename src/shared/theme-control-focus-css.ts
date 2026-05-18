/**
 * §5 — канон focus/hover/disabled для основных контролов (проверяется в main.css).
 */

export const THEME_CONTROL_FOCUS_TOKEN = '--fa-focus-ring'
export const THEME_CONTROL_HOVER_TOKEN = '--fa-hover'
export const THEME_CONTROL_DISABLED_TOKEN = '--fa-disabled'

/** Пары «селектор → обязательный фрагмент в блоке правила». */
export const THEME_PRIMARY_CONTROL_CSS_ASSERTIONS: ReadonlyArray<{
  selector: string
  mustInclude: string
}> = [
  { selector: '.app-btn:hover:not(:disabled)', mustInclude: THEME_CONTROL_HOVER_TOKEN },
  { selector: '.app-btn:disabled', mustInclude: THEME_CONTROL_DISABLED_TOKEN },
  { selector: '.app-btn:focus-visible', mustInclude: THEME_CONTROL_FOCUS_TOKEN },
  { selector: '.app-icon-btn:hover:not(:disabled)', mustInclude: THEME_CONTROL_HOVER_TOKEN },
  { selector: '.app-icon-btn:disabled', mustInclude: THEME_CONTROL_DISABLED_TOKEN },
  { selector: '.app-icon-btn:focus-visible', mustInclude: THEME_CONTROL_FOCUS_TOKEN },
  { selector: '.app-control:disabled', mustInclude: THEME_CONTROL_DISABLED_TOKEN },
  { selector: '.app-control:focus-visible', mustInclude: THEME_CONTROL_FOCUS_TOKEN },
  { selector: '.app-pill-switch:disabled', mustInclude: THEME_CONTROL_DISABLED_TOKEN },
  { selector: '.app-pill-switch:focus-visible', mustInclude: THEME_CONTROL_FOCUS_TOKEN },
  { selector: '.app-toolbar-select:disabled', mustInclude: THEME_CONTROL_DISABLED_TOKEN },
  { selector: '.app-toolbar-select:focus-visible', mustInclude: THEME_CONTROL_FOCUS_TOKEN },
  { selector: '.app-workspace-tab:focus-visible', mustInclude: THEME_CONTROL_FOCUS_TOKEN }
]

/** Запрещённые тёмные hex-литералы в main.css (§5 — только токены). */
export const THEME_FORBIDDEN_MAIN_CSS_HEX = [
  '#111827',
  '#020617',
  '#0a0a0c',
  '#000000',
  '#f87171'
] as const
