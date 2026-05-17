/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'node:fs'
import path from 'node:path'

const mainDir = path.join('src/main')
const srcPath = path.join(mainDir, 'downloads-window-html-styles.ts')
const lines = fs.readFileSync(srcPath, 'utf8').split(/\r?\n/)

/** @param {string} s */
function escTpl(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`')
}

/** @param {number} fileStart @param {number} fileEnd 1-based inclusive */
function slice(fileStart, fileEnd) {
  return lines.slice(fileStart - 1, fileEnd).join('\n')
}

const parts = [
  { file: 'downloads-window-html-styles-theme.ts', const: 'THEME', start: 5, end: 72, note: 'dark/light tokens + body base' },
  { file: 'downloads-window-html-styles-dpi.ts', const: 'DPI', start: 73, end: 304, note: 'HiDPI @media 120–192dpi' },
  {
    file: 'downloads-window-html-styles-layout-workspace.ts',
    const: 'LAYOUT_WORKSPACE',
    start: 305,
    end: 546,
    note: 'shell, queue, history panels'
  },
  {
    file: 'downloads-window-html-styles-layout-rail.ts',
    const: 'LAYOUT_RAIL',
    start: 547,
    end: 815,
    note: 'log, settings rail, focus rings'
  },
  {
    file: 'downloads-window-html-styles-narrow.ts',
    const: 'NARROW',
    start: 816,
    end: 843,
    note: '@media max-width 960px'
  }
]

for (const p of parts) {
  const chunk = slice(p.start, p.end)
  fs.writeFileSync(
    path.join(mainDir, p.file),
    `/**
 * Pop-out downloads CSS — ${p.note} (\`buildDownloadsHtml\`).
 */
export const DOWNLOADS_WINDOW_HTML_STYLES_${p.const} = \`${escTpl(chunk)}\`
`
  )
}

const entry = `import { DOWNLOADS_WINDOW_HTML_STYLES_DPI } from './downloads-window-html-styles-dpi'
import { DOWNLOADS_WINDOW_HTML_STYLES_LAYOUT_RAIL } from './downloads-window-html-styles-layout-rail'
import { DOWNLOADS_WINDOW_HTML_STYLES_LAYOUT_WORKSPACE } from './downloads-window-html-styles-layout-workspace'
import { DOWNLOADS_WINDOW_HTML_STYLES_NARROW } from './downloads-window-html-styles-narrow'
import { DOWNLOADS_WINDOW_HTML_STYLES_THEME } from './downloads-window-html-styles-theme'

/** Inline \`<style>\` for pop-out downloads window. */
export const DOWNLOADS_WINDOW_HTML_STYLE_BLOCK = \`  <style>
\${DOWNLOADS_WINDOW_HTML_STYLES_THEME}
\${DOWNLOADS_WINDOW_HTML_STYLES_DPI}
\${DOWNLOADS_WINDOW_HTML_STYLES_LAYOUT_WORKSPACE}
\${DOWNLOADS_WINDOW_HTML_STYLES_LAYOUT_RAIL}
\${DOWNLOADS_WINDOW_HTML_STYLES_NARROW}
  </style>\`
`

fs.writeFileSync(srcPath, entry)
console.log('[split-downloads-window-html-styles] wrote 5 parts + entry')
