/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'node:fs'
import path from 'node:path'

const mainDir = path.join('src/main')
const srcPath = path.join(mainDir, 'downloads-window-html-script.ts')
const lines = fs.readFileSync(srcPath, 'utf8').split(/\r?\n/)

/** @param {string} s */
function escTpl(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`')
}

/** @param {number} fileStart @param {number} fileEnd 1-based inclusive */
function sliceFileLines(fileStart, fileEnd) {
  return lines.slice(fileStart - 1, fileEnd).join('\n')
}

/** @param {string} chunk @param {string} note @param {string} constName */
function writeConstFragment(file, chunk, note, constName) {
  const body = `/**
 * Pop-out downloads inline script — ${note} (\`buildDownloadsHtml\`).
 */
export const DOWNLOADS_WINDOW_HTML_SCRIPT_${constName} = \`${escTpl(chunk)}\`
`
  fs.writeFileSync(path.join(mainDir, file), body)
}

const slices = [
  {
    file: 'downloads-window-html-script-fragment-shell.ts',
    const: 'SHELL',
    start: 91,
    end: 257,
    note: 'scroll rail, pills, CLI preview'
  },
  {
    file: 'downloads-window-html-script-fragment-queue.ts',
    const: 'QUEUE',
    start: 767,
    end: 1147,
    note: 'queue rows, toolbar row actions'
  },
  {
    file: 'downloads-window-html-script-fragment-wireup.ts',
    const: 'WIREUP',
    start: 1148,
    end: 1476,
    note: 'toolbar, DnD, IPC bootstrap'
  }
]

for (const slice of slices) {
  writeConstFragment(slice.file, sliceFileLines(slice.start, slice.end), slice.note, slice.const)
}

const historyBefore = sliceFileLines(258, 311)
const historyAfter = sliceFileLines(314, 472)
fs.writeFileSync(
  path.join(mainDir, 'downloads-window-html-script-fragment-history.ts'),
  `import { emitDownloadsQueueRowIcoBootstrapJs } from '../shared/lucide-downloads-icons'

/**
 * Pop-out downloads inline script — history table + handlers (\`buildDownloadsHtml\`).
 */
export function buildDownloadsWindowHtmlScriptHistoryFragment(): string {
  return \`${escTpl(historyBefore)}
\${emitDownloadsQueueRowIcoBootstrapJs()}
${escTpl(historyAfter)}\`
}
`
)

const optsLogChunk = sliceFileLines(474, 766)
fs.writeFileSync(
  path.join(mainDir, 'downloads-window-html-script-fragment-opts-log.ts'),
  `import { DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED } from '../shared/downloads-log-contract'

/**
 * Pop-out downloads inline script — hints, refreshCliOpts, log panel (\`buildDownloadsHtml\`).
 */
export function buildDownloadsWindowHtmlScriptOptsLogFragment(): string {
  return \`${escTpl(optsLogChunk)}\`
}
`
)

const preamble = sliceFileLines(21, 90)

const entry = `import {
  YTDLP_QUEUE_STATUS_CANCELLED,
  YTDLP_QUEUE_STATUS_DONE,
  YTDLP_QUEUE_STATUS_ERROR_PREFIX,
  YTDLP_QUEUE_STATUS_RUNNING,
  YTDLP_QUEUE_STATUS_WAITING,
  YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX
} from '../shared/ytdlp-queue-status'
import { buildDownloadsWindowHtmlScriptHistoryFragment } from './downloads-window-html-script-fragment-history'
import { buildDownloadsWindowHtmlScriptOptsLogFragment } from './downloads-window-html-script-fragment-opts-log'
import { DOWNLOADS_WINDOW_HTML_SCRIPT_QUEUE } from './downloads-window-html-script-fragment-queue'
import { DOWNLOADS_WINDOW_HTML_SCRIPT_SHELL } from './downloads-window-html-script-fragment-shell'
import { DOWNLOADS_WINDOW_HTML_SCRIPT_WIREUP } from './downloads-window-html-script-fragment-wireup'

export type DownloadsWindowHtmlScriptContext = {
  dlScriptI18nJson: string
  dlLocaleCmpJson: string
  ytdlpHintCatOrderJson: string
}

export function buildDownloadsWindowHtmlScript(ctx: DownloadsWindowHtmlScriptContext): string {
  const { dlScriptI18nJson, dlLocaleCmpJson, ytdlpHintCatOrderJson } = ctx
  return \`  <script>
${escTpl(preamble)}
\${DOWNLOADS_WINDOW_HTML_SCRIPT_SHELL}
\${buildDownloadsWindowHtmlScriptHistoryFragment()}
\${buildDownloadsWindowHtmlScriptOptsLogFragment()}
\${DOWNLOADS_WINDOW_HTML_SCRIPT_QUEUE}
\${DOWNLOADS_WINDOW_HTML_SCRIPT_WIREUP}
    })();
  </script>\`
}
`

fs.writeFileSync(srcPath, entry)
console.log('[split-downloads-window-html-script] wrote 5 fragments + entry')
