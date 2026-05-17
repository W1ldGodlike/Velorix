/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Split renderer ui-text.ts into session + locale string parts + API helpers.
 * Run: node scripts/split-ui-text.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const localesDir = path.join('src/renderer/src/locales')
const srcPath = path.join(localesDir, 'ui-text.ts')
const lines = fs.readFileSync(srcPath, 'utf8').split(/\r?\n/)

const uiTextConstOpen = lines.findIndex((l) => l.startsWith('const UI_TEXT'))
const ruOpen = lines.findIndex((l) => l.trim() === 'ru: {')
const enOpen = lines.findIndex((l) => l.trim() === 'en: {')
const objectClose = lines.findIndex((l) => l.trim() === '} as const')
const apiStart = lines.findIndex((l) => l.startsWith('export type MiniIconTitleKey'))

if (uiTextConstOpen < 0 || ruOpen < 0 || enOpen < 0 || objectClose < 0 || apiStart < 0) {
  throw new Error('ui-text.ts structure changed; update split-ui-text.mjs')
}

const sessionBlock = lines.slice(18, uiTextConstOpen).join('\n')
const apiBlock = lines.slice(apiStart).join('\n')

function collectPropertyStarts(from, to) {
  const starts = []
  for (let i = from + 1; i < to; i++) {
    if (/^ {4}[a-zA-Z][\w$]*:/.test(lines[i])) {
      starts.push(i)
    }
  }
  return starts
}

function normalizeChunk(rawLines) {
  const chunk = [...rawLines]
  while (chunk.length > 0) {
    const t = chunk[chunk.length - 1].trim()
    if (t === '' || t === '}' || t === '},' || t === '} as const') {
      chunk.pop()
      continue
    }
    break
  }
  const last = chunk.length - 1
  if (last >= 0 && chunk[last].trim().endsWith(',')) {
    chunk[last] = chunk[last].replace(/,\s*$/, '')
  }
  return chunk.join('\n')
}

function writeLocaleParts(locale, starts, endLine, count) {
  const per = Math.ceil(starts.length / count)
  const partNames = []
  for (let p = 0; p < count; p++) {
    const from = p * per
    const to = Math.min((p + 1) * per, starts.length)
    if (from >= starts.length) {
      break
    }
    const start = starts[from]
    const end = to < starts.length ? starts[to] : endLine
    const body = normalizeChunk(lines.slice(start, end))
    const suffix = String(p + 1).padStart(2, '0')
    const constName = `uiTextStrings${locale}Part${suffix}`
    const file = path.join(localesDir, `ui-text-strings-${locale.toLowerCase()}-${suffix}.ts`)
    fs.writeFileSync(
      file,
      `/** Renderer UI copy (${locale}, part ${suffix}). */
export const ${constName} = {
${body}
} as const
`
    )
    partNames.push({ constName, importPath: `./ui-text-strings-${locale.toLowerCase()}-${suffix}` })
    console.log(`  ${path.basename(file)}: keys ${to - from}`)
  }
  return partNames
}

const ruStarts = collectPropertyStarts(ruOpen, enOpen)
const enStarts = collectPropertyStarts(enOpen, objectClose)

const PARTS_PER_LOCALE = 8
const ruParts = writeLocaleParts('Ru', ruStarts, enOpen, PARTS_PER_LOCALE)
const enParts = writeLocaleParts('En', enStarts, objectClose, PARTS_PER_LOCALE)

function buildMergeConst(locale, parts) {
  const spreads = parts.map((p) => `  ...${p.constName},`).join('\n')
  return `const uiTextStrings${locale} = {
${spreads}
} as const`
}

const stringsImports = [...ruParts, ...enParts]
  .map((p) => `import { ${p.constName} } from '${p.importPath}'`)
  .join('\n')

const stringsFile = `/** Merged UI_TEXT tables (ru/en) from split parts. */
${stringsImports}

${buildMergeConst('Ru', ruParts)}

${buildMergeConst('En', enParts)}

export const UI_TEXT = {
  ru: uiTextStringsRu,
  en: uiTextStringsEn
} as const

export type UiTextKey = keyof typeof uiTextStringsRu
`

fs.writeFileSync(path.join(localesDir, 'ui-text-strings.ts'), stringsFile)

const sessionBlockExported = sessionBlock.replace(/^type UiLocale /m, 'export type UiLocale ')

const sessionFile = `import type { DownloadsWindowUiLocale } from '../../../shared/downloads-window-ui-locale'
import { parseDownloadsWindowUiLocale } from '../../../shared/downloads-window-ui-locale'

${sessionBlockExported}

export function getUiLocale(): UiLocale {
  return uiLocaleOverride ?? resolveUiLocaleFromNavigator()
}

/**
 * Sync renderer UI strings with persisted \`uiLocale\` (or persist navigator default once).
 * Caller should bump React state after this so components re-read \`getUiLocale()\` / \`uiText()\`.
 */
export function applyPersistedUiLocale(loaded: { uiLocale?: unknown }): {
  resolved: DownloadsWindowUiLocale
  shouldPersist: boolean
} {
  const fromFile = parseDownloadsWindowUiLocale(loaded.uiLocale)
  if (fromFile !== undefined) {
    uiLocaleOverride = fromFile
    return { resolved: fromFile, shouldPersist: false }
  }
  const resolved = resolveUiLocaleFromNavigator()
  uiLocaleOverride = resolved
  return { resolved, shouldPersist: true }
}

/** После \`settings.setUiLocale\` или события main \`uiLocaleChanged\`. */
export function setUiLocaleForSession(locale: DownloadsWindowUiLocale): void {
  uiLocaleOverride = locale
}
`

fs.writeFileSync(path.join(localesDir, 'ui-text-session.ts'), sessionFile)

const apiImports = `import type {
  ProcessingHistoryKind,
  ProcessingHistoryOutcome
} from '../../../shared/processing-history-contract'
import type { YtdlpDownloadHistoryOutcome } from '../../../shared/ytdlp-history-contract'
import {
  isYtdlpQueueStatusErrorLike,
  parseYtdlpQueueRetryPauseCounts,
  YTDLP_QUEUE_STATUS_CANCELLED,
  YTDLP_QUEUE_STATUS_DONE,
  YTDLP_QUEUE_STATUS_RUNNING,
  YTDLP_QUEUE_STATUS_WAITING,
  YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX
} from '../../../shared/ytdlp-queue-status'`

const apiFile = `${apiImports}

import { getUiLocale } from './ui-text-session'
import { UI_TEXT, type UiTextKey } from './ui-text-strings'

export type { UiTextKey }

${apiBlock}
`

fs.writeFileSync(path.join(localesDir, 'ui-text-api.ts'), apiFile)

const entry = `/** Barrel: renderer UI strings and formatters. */
export {
  applyPersistedUiLocale,
  getUiLocale,
  setUiLocaleForSession
} from './ui-text-session'
export type { UiLocale } from './ui-text-session'
export {
  formatDownloadsHistoryOutcomeLabel,
  formatDownloadsHistoryTime,
  formatDownloadsQueueRowStatus,
  formatFfmpegExportBatchStatusLabel,
  formatMaintenanceCleanDone,
  formatMaintenanceConfirmHint,
  formatMaintenanceSummary,
  formatProcessingDurationLabel,
  formatProcessingHistoryKindLabel,
  formatProcessingHistoryOutcomeLabel,
  formatTerminalCopyLineAria,
  formatTerminalExitLine,
  formatTerminalIntroTail,
  formatTerminalPreviewTooltip,
  formatUiBytes,
  miniIconTitle,
  uiText,
  uiTextVars
} from './ui-text-api'
export type { MiniIconTitleKey, TerminalIntroTailVars } from './ui-text-api'
`

fs.writeFileSync(srcPath, entry)
console.log(
  `[split-ui-text] session + strings ru×${ruParts.length} en×${enParts.length} + api + entry`
)
