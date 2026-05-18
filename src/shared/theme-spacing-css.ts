/**
 * §5 — сетка отступов 8 px (0.5 rem) и guard margin/padding в main.css.
 */

export const THEME_SPACE_2_TOKEN = '--fa-space-2'
export const THEME_SPACE_3_TOKEN = '--fa-space-3'
export const THEME_SPACE_4_TOKEN = '--fa-space-4'
export const THEME_SPACE_COMPACT_TOKEN = '--fa-space-compact'
export const THEME_SPACE_ROW_TOKEN = '--fa-space-row'

/** Селекторы оболочки, обязанные ссылаться на --fa-space-* в padding/gap. */
export const THEME_SHELL_SPACING_ASSERTIONS: ReadonlyArray<{
  selector: string
  mustInclude: string
}> = [
  { selector: '.app-topbar', mustInclude: THEME_SPACE_2_TOKEN },
  { selector: '.app-btn', mustInclude: THEME_SPACE_3_TOKEN },
  { selector: '.app-modal', mustInclude: THEME_SPACE_4_TOKEN },
  { selector: '.app-terminal-workspace', mustInclude: THEME_SPACE_4_TOKEN },
  { selector: '.app-downloads-settings-stack', mustInclude: '--fa-space-inline' },
  { selector: '.app-downloads-rail-section-body', mustInclude: THEME_SPACE_ROW_TOKEN },
  { selector: '.app-url-body', mustInclude: THEME_SPACE_2_TOKEN },
  { selector: '.app-export-preview-body', mustInclude: '--fa-space-gap-sm' },
  { selector: '.app-timeline-stack', mustInclude: '--fa-space-gap-tight' },
  { selector: '.app-timeline-toolbar', mustInclude: '--fa-space-inline' },
  { selector: '.app-statusbar', mustInclude: THEME_SPACE_3_TOKEN }
]

/** Запрещены px в margin/padding main.css (overlap-токены задаются в base.css). */
export const THEME_FORBIDDEN_MAIN_CSS_MARGIN_PADDING_PX =
  /(?:padding|margin)(?:-(?:top|right|bottom|left))?\s*:[^;]*(?:^|[\s,])(-?\d+(?:\.\d+)?)px/g

/** Запрещены rem-литералы в gap main.css (допускается `gap: 0`). */
export const THEME_FORBIDDEN_MAIN_CSS_GAP_REM = /gap:\s*(?!0\b)[^;]*\d+(?:\.\d+)?rem/g
