/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Re-applies Russian wording to `summary` fields in terminal-contract hint parts
 * (fullLine is untouched). Safe to run repeatedly; skips missing needles.
 *
 * Usage: node scripts/apply-terminal-summary-ru.mjs
 *        npm run locales:terminal-summaries-ru
 *
 * Replace table: `scripts/data/terminal-summary-ru-pairs.json` (not split across .mjs shards).
 * After merge or if summaries look reverted (URL vs ссылка, flux without «(поле …)»),
 * run twice until the second run prints 0 replacements and 0 flux (поле) gloss.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'

import { glossFluxPrintToFileSummary } from './inject-flux-summary-pole.mjs'
import { listTerminalContractHintFiles } from './terminal-contract-hint-paths.mjs'

const PAIRS_JSON_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'data',
  'terminal-summary-ru-pairs.json'
)
const TERMINAL_SUMMARY_RU_PAIRS = JSON.parse(fs.readFileSync(PAIRS_JSON_PATH, 'utf8'))

function applyPairsToText(s, pairs) {
  let total = 0
  for (const [a, b] of pairs) {
    if (!s.includes(a)) continue
    const n = s.split(a).length - 1
    s = s.split(a).join(b)
    total += n
    console.log(String(n).padStart(4), a.slice(0, 64))
  }
  return { s, total }
}

/** Apply replace pairs only inside `summary: '…'` (never fullLine / token). */
function applyPairsToSummariesInFile(s, pairs) {
  const summaryRe = /summary:\s*'((?:[^'\\]|\\.)*)'/g
  let total = 0
  const next = s.replace(summaryRe, (full, inner) => {
    const applied = applyPairsToText(inner, pairs)
    total += applied.total
    if (applied.s === inner) {
      return full
    }
    return `summary: '${applied.s}'`
  })
  return { s: next, total }
}

function glossSummariesInText(s) {
  const summaryRe = /summary: '((?:[^'\\]|\\.)*)'/g
  let glossHits = 0
  const next = s.replace(summaryRe, (full, inner) => {
    const glossed = glossFluxPrintToFileSummary(inner)
    if (glossed !== inner) {
      glossHits++
      return `summary: '${glossed}'`
    }
    return full
  })
  return { s: next, glossHits }
}

let replacements = 0
let glossTotal = 0
for (const filePath of listTerminalContractHintFiles()) {
  let s = fs.readFileSync(filePath, 'utf8')
  const applied = applyPairsToSummariesInFile(s, TERMINAL_SUMMARY_RU_PAIRS)
  s = applied.s
  replacements += applied.total
  const glossed = glossSummariesInText(s)
  s = glossed.s
  glossTotal += glossed.glossHits
  fs.writeFileSync(filePath, s, 'utf8')
  console.log('file', filePath.replace(/\\/g, '/'), 'gloss:', glossed.glossHits)
}

console.log(
  'OK terminal-contract hints',
  'replacements:',
  replacements,
  'flux (поле) gloss:',
  glossTotal
)
