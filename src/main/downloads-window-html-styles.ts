import { DOWNLOADS_WINDOW_HTML_STYLES_DPI } from './downloads-window-html-styles-dpi'
import { DOWNLOADS_WINDOW_HTML_STYLES_LAYOUT_RAIL } from './downloads-window-html-styles-layout-rail'
import { DOWNLOADS_WINDOW_HTML_STYLES_LAYOUT_WORKSPACE } from './downloads-window-html-styles-layout-workspace'
import { DOWNLOADS_WINDOW_HTML_STYLES_NARROW } from './downloads-window-html-styles-narrow'
import { DOWNLOADS_WINDOW_HTML_STYLES_THEME } from './downloads-window-html-styles-theme'

/** Inline `<style>` for pop-out downloads window. */
export const DOWNLOADS_WINDOW_HTML_STYLE_BLOCK = `  <style>
${DOWNLOADS_WINDOW_HTML_STYLES_THEME}
${DOWNLOADS_WINDOW_HTML_STYLES_DPI}
${DOWNLOADS_WINDOW_HTML_STYLES_LAYOUT_WORKSPACE}
${DOWNLOADS_WINDOW_HTML_STYLES_LAYOUT_RAIL}
${DOWNLOADS_WINDOW_HTML_STYLES_NARROW}
  </style>`
