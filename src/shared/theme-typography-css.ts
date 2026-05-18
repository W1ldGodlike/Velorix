/**
 * §5 — типографика (font-size) через токены base.css.
 */

export const THEME_FONT_SIZE_MD_TOKEN = '--fa-font-size-md'
export const THEME_FONT_SIZE_SM_TOKEN = '--fa-font-size-sm'
export const THEME_FONT_SIZE_BODY_TOKEN = '--fa-font-size-body'
export const THEME_FONT_SIZE_BODY_SM_TOKEN = '--fa-font-size-body-sm'

/** Селекторы с обязательным --fa-font-size-* в font-size. */
export const THEME_SHELL_TYPOGRAPHY_ASSERTIONS: ReadonlyArray<{
  selector: string
  mustInclude: string
}> = [
  { selector: '.app-topbar-title', mustInclude: '--fa-font-size-lead' },
  { selector: '.app-btn', mustInclude: THEME_FONT_SIZE_BODY_TOKEN },
  { selector: '.app-settings-dialog-pane-title', mustInclude: '--fa-font-size-lg' },
  { selector: '.app-statusbar', mustInclude: THEME_FONT_SIZE_BODY_SM_TOKEN }
]

/** Запрещены rem в font-size без var(--fa-font-size-*). */
export const THEME_FORBIDDEN_MAIN_CSS_FONT_SIZE_REM =
  /font-size:\s*(?![^;]*var\(--fa-font-size)[^;]*\d+(?:\.\d+)?rem/g

/** Запрещены px в font-size без var(--fa-font-size-*). */
export const THEME_FORBIDDEN_MAIN_CSS_FONT_SIZE_PX =
  /font-size:\s*(?![^;]*var\(--fa-font-size)[^;]*\d+px/g
