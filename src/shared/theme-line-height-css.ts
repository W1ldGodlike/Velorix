/**
 * §5 — line-height через токены base.css.
 */

export const THEME_LINE_HEIGHT_BODY_TOKEN = '--fa-line-height-body'
export const THEME_LINE_HEIGHT_UI_TOKEN = '--fa-line-height-ui'

/** Селекторы с обязательным --fa-line-height-* в line-height. */
export const THEME_SHELL_LINE_HEIGHT_ASSERTIONS: ReadonlyArray<{
  selector: string
  mustInclude: string
}> = [
  { selector: '.app-modal-hint', mustInclude: THEME_LINE_HEIGHT_UI_TOKEN },
  { selector: '.app-topbar-engine-short', mustInclude: '--fa-line-height-normal' },
  { selector: '.app-terminal-suggest-item small', mustInclude: THEME_LINE_HEIGHT_BODY_TOKEN }
]

/** Запрещены unitless литералы в line-height без var(--fa-line-height-*). */
export const THEME_FORBIDDEN_MAIN_CSS_LINE_HEIGHT_LITERAL =
  /line-height:\s*(?![^;]*var\(--fa-line-height)[^;]*\d+(?:\.\d+)?\s*;/g
