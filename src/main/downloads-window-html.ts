import type { DownloadsWindowUiPanelState, ResolvedAppTheme } from '../shared/settings-contract'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import {
  buildDownloadsWindowScriptI18nJson,
  getDownloadsWindowUiStrings
} from '../shared/downloads-window-ui-locale'
import { getYtdlpHintCategoryOrder } from '../shared/ytdlp-hint-category-order'
import { buildDownloadsWindowHtmlBody } from './downloads-window-html-body'
import { DOWNLOADS_WINDOW_HTML_STYLE_BLOCK } from './downloads-window-html-styles'
import { buildDownloadsWindowHtmlScript } from './downloads-window-html-script'

export function buildDownloadsHtml(
  panelState?: DownloadsWindowUiPanelState,
  appTheme: ResolvedAppTheme = 'dark',
  uiLocale: DownloadsWindowUiLocale = 'ru'
): string {
  const L = getDownloadsWindowUiStrings(uiLocale)
  const dlScriptI18nJson = buildDownloadsWindowScriptI18nJson(uiLocale)
  const dlLocaleCmpJson = JSON.stringify(uiLocale === 'en' ? 'en' : 'ru')
  const ytdlpHintCatOrderJson = JSON.stringify([...getYtdlpHintCategoryOrder(uiLocale)])
  const openAttr = (key: keyof DownloadsWindowUiPanelState, defaultOpen: boolean): string => {
    const v = panelState?.[key]
    const isOpen = typeof v === 'boolean' ? v : defaultOpen
    return isOpen ? ' open' : ''
  }
  const dataThemeAttr = appTheme === 'light' ? 'light' : 'dark'
  return `<!DOCTYPE html>
<html lang="${L.htmlLang}" data-theme="${dataThemeAttr}">
<head>
  <meta charset="UTF-8" />
  <title>${L.pageTitle}</title>
${DOWNLOADS_WINDOW_HTML_STYLE_BLOCK}
</head>
${buildDownloadsWindowHtmlBody({ L, openAttr })}
${buildDownloadsWindowHtmlScript({ dlScriptI18nJson, dlLocaleCmpJson, ytdlpHintCatOrderJson })}
</html>`
}
