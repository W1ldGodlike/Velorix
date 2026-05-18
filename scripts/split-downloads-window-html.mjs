/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'node:fs'
import path from 'node:path'

const mainDir = path.join('src/main')
const srcPath = path.join(mainDir, 'downloads-window-html.ts')
const text = fs.readFileSync(srcPath, 'utf8')
const lines = text.split(/\r?\n/)

const returnIdx = lines.findIndex((l) => l.includes('return `<!DOCTYPE'))
if (returnIdx === -1) {
  throw new Error('return template not found')
}

const styleStart = lines.findIndex((l, i) => i > returnIdx && l.trim() === '<style>')
const styleEnd = lines.findIndex((l, i) => i > styleStart && l.trim() === '</style>')
const bodyStart = lines.findIndex((l, i) => i > styleEnd && l.trim() === '<body>')
const scriptStart = lines.findIndex((l, i) => i > bodyStart && l.trim() === '<script>')
const scriptEnd = lines.findIndex((l, i) => i > scriptStart && l.trim() === '</script>')

if ([styleStart, styleEnd, bodyStart, scriptStart, scriptEnd].some((n) => n === -1)) {
  throw new Error('section markers not found')
}

const styleBlock = lines.slice(styleStart, styleEnd + 1).join('\n')
const bodyBlock = lines.slice(bodyStart, scriptStart).join('\n')
const scriptBlock = lines.slice(scriptStart, scriptEnd + 1).join('\n')

/** Escape only backticks/backslashes so \`${L.*}\` survives in generated TS. */
/** @param {string} s */
function escTpl(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`')
}

const stylesTs = `/**
 * Pop-out downloads window — inline CSS block for \`buildDownloadsHtml\`.
 */
export const DOWNLOADS_WINDOW_HTML_STYLE_BLOCK = \`${escTpl(styleBlock)}\`
`

const bodyTs = `import type { DownloadsWindowUiPanelState } from '../shared/settings-contract'
import type { DownloadsWindowUiStrings } from '../shared/app-ui-locale'
import {
  YTDLP_DOC_FORMAT_SELECTION,
  YTDLP_DOC_OUTPUT_TEMPLATE,
  YTDLP_DOC_POSTPROCESS,
  YTDLP_DOC_README
} from '../shared/external-doc-urls'
import {
  DOWNLOADS_TOPBAR_CLUSTER_ICONS,
  EDITOR_TOPBAR_ACTION_ICONS,
  EDITOR_TOPBAR_TOOLS_ICONS,
  QUEUE_ROW_ACTION_ICONS,
  emitDownloadsTopbarClusterHtml,
  emitInlineStrokeSvg
} from '../shared/lucide-downloads-icons'

export type DownloadsWindowHtmlBodyContext = {
  L: DownloadsWindowUiStrings
  openAttr: (key: keyof DownloadsWindowUiPanelState, defaultOpen: boolean) => string
}

export function buildDownloadsWindowHtmlBody(ctx: DownloadsWindowHtmlBodyContext): string {
  const { L, openAttr } = ctx
  return \`${escTpl(bodyBlock)}\`
}
`

const scriptTs = `import { DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED } from '../shared/downloads-log-contract'
import {
  YTDLP_QUEUE_STATUS_CANCELLED,
  YTDLP_QUEUE_STATUS_DONE,
  YTDLP_QUEUE_STATUS_ERROR_PREFIX,
  YTDLP_QUEUE_STATUS_RUNNING,
  YTDLP_QUEUE_STATUS_WAITING,
  YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX
} from '../shared/ytdlp-queue-status'
import { emitDownloadsQueueRowIcoBootstrapJs } from '../shared/lucide-downloads-icons'

export type DownloadsWindowHtmlScriptContext = {
  dlScriptI18nJson: string
  dlLocaleCmpJson: string
  ytdlpHintCatOrderJson: string
}

export function buildDownloadsWindowHtmlScript(ctx: DownloadsWindowHtmlScriptContext): string {
  const { dlScriptI18nJson, dlLocaleCmpJson, ytdlpHintCatOrderJson } = ctx
  return \`${escTpl(scriptBlock)}\`
}
`

const entryTs = `import type { DownloadsWindowUiPanelState, ResolvedAppTheme } from '../shared/settings-contract'
import type { AppUiLocale } from '../shared/app-ui-locale'
import {
  buildDownloadsWindowScriptI18nJson,
  REMOVED_getDownloadsWindowUiStrings
} from '../shared/app-ui-locale'
import { getYtdlpHintCategoryOrder } from '../shared/ytdlp-hint-category-order'
import { buildDownloadsWindowHtmlBody } from './downloads-window-html-body'
import { DOWNLOADS_WINDOW_HTML_STYLE_BLOCK } from './downloads-window-html-styles'
import { buildDownloadsWindowHtmlScript } from './downloads-window-html-script'

export function buildDownloadsHtml(
  panelState?: DownloadsWindowUiPanelState,
  appTheme: ResolvedAppTheme = 'dark',
  uiLocale: AppUiLocale = 'ru'
): string {
  const L = REMOVED_getDownloadsWindowUiStrings(uiLocale)
  const dlScriptI18nJson = buildDownloadsWindowScriptI18nJson(uiLocale)
  const dlLocaleCmpJson = JSON.stringify(uiLocale === 'en' ? 'en' : 'ru')
  const ytdlpHintCatOrderJson = JSON.stringify([...getYtdlpHintCategoryOrder(uiLocale)])
  const openAttr = (key: keyof DownloadsWindowUiPanelState, defaultOpen: boolean): string => {
    const v = panelState?.[key]
    const isOpen = typeof v === 'boolean' ? v : defaultOpen
    return isOpen ? ' open' : ''
  }
  const dataThemeAttr = appTheme === 'light' ? 'light' : 'dark'
  return \`<!DOCTYPE html>
<html lang="\${L.htmlLang}" data-theme="\${dataThemeAttr}">
<head>
  <meta charset="UTF-8" />
  <title>\${L.pageTitle}</title>
\${DOWNLOADS_WINDOW_HTML_STYLE_BLOCK}
</head>
\${buildDownloadsWindowHtmlBody({ L, openAttr })}
\${buildDownloadsWindowHtmlScript({ dlScriptI18nJson, dlLocaleCmpJson, ytdlpHintCatOrderJson })}
</html>\`
}
`

fs.writeFileSync(path.join(mainDir, 'downloads-window-html-styles.ts'), stylesTs)
fs.writeFileSync(path.join(mainDir, 'downloads-window-html-body.ts'), bodyTs)
fs.writeFileSync(path.join(mainDir, 'downloads-window-html-script.ts'), scriptTs)
fs.writeFileSync(srcPath, entryTs)

console.log('[split-downloads-window-html] wrote styles/body/script + entry')
