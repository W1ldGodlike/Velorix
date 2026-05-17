/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Maint: (re)split RU summary pairs into ≤400-line modules + thin runner.
 * Run: node scripts/split-apply-terminal-summary-ru-pairs.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PARTS = 6

function parsePairElements(body) {
  const elements = []
  let depth = 0
  let start = -1
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]
    if (ch === '[') {
      if (depth === 0) {
        start = i
      }
      depth++
    } else if (ch === ']') {
      depth--
      if (depth === 0 && start >= 0) {
        elements.push(body.slice(start, i + 1).trim())
        start = -1
      }
    }
  }
  return elements
}

function loadAllPairElements() {
  const aggPath = path.join(__dirname, 'apply-terminal-summary-ru-pairs.mjs')
  if (fs.existsSync(aggPath)) {
    const parts = fs
      .readdirSync(__dirname)
      .filter((n) => /^apply-terminal-summary-ru-pairs-\d+\.mjs$/.test(n))
      .sort()
    const elements = []
    for (const name of parts) {
      const text = fs.readFileSync(path.join(__dirname, name), 'utf8')
      const m = text.match(/= \[([\s\S]*)\]\s*$/m)
      if (!m) {
        throw new Error(`pairs body not found in ${name}`)
      }
      elements.push(...parsePairElements(m[1]))
    }
    return elements
  }

  const srcPath = path.join(__dirname, 'apply-terminal-summary-ru.mjs')
  const src = fs.readFileSync(srcPath, 'utf8')
  const match = src.match(/const pairs = \[([\s\S]*)\]\n\nlet total/)
  if (!match) {
    throw new Error('pairs block not found in apply-terminal-summary-ru.mjs')
  }
  return parsePairElements(match[1])
}

const elements = loadAllPairElements()

for (const name of fs.readdirSync(__dirname)) {
  if (/^apply-terminal-summary-ru-pairs-\d+\.mjs$/.test(name)) {
    fs.unlinkSync(path.join(__dirname, name))
  }
}

const per = Math.ceil(elements.length / PARTS)
const partBodies = []
for (let p = 0; p < PARTS; p++) {
  const slice = elements.slice(p * per, (p + 1) * per)
  if (slice.length === 0) {
    continue
  }
  const suffix = String(p + 1).padStart(2, '0')
  const constName = `TERMINAL_SUMMARY_RU_PAIRS_${suffix}`
  const file = path.join(__dirname, `apply-terminal-summary-ru-pairs-${suffix}.mjs`)
  fs.writeFileSync(
    file,
    `/** RU summary replace pairs (part ${suffix}). */
export const ${constName} = [
  ${slice.join(',\n  ')}
]
`
  )
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).length
  partBodies.push({
    suffix,
    constName,
    file: `./apply-terminal-summary-ru-pairs-${suffix}.mjs`,
    lines
  })
  console.log(`  ${path.basename(file)}: ${slice.length} pairs, ${lines} lines`)
}

const aggImports = partBodies.map((p) => `import { ${p.constName} } from '${p.file}'`).join('\n')
const aggSpreads = partBodies.map((p) => `  ...${p.constName},`).join('\n')
fs.writeFileSync(
  path.join(__dirname, 'apply-terminal-summary-ru-pairs.mjs'),
  `/** Merged RU summary replacement table for terminal hint files. */
${aggImports}

export const TERMINAL_SUMMARY_RU_PAIRS = [
${aggSpreads}
]
`
)

const runner = `/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Re-applies Russian wording to \`summary\` fields in terminal-contract hint parts
 * (fullLine is untouched). Safe to run repeatedly; skips missing needles.
 *
 * Usage: node scripts/apply-terminal-summary-ru.mjs
 *        npm run locales:terminal-summaries-ru
 *
 * After merge or if summaries look reverted (URL vs ссылка, flux without «(поле …)»),
 * run twice until the second run prints 0 replacements and 0 flux (поле) gloss.
 */
import fs from 'node:fs'

import { TERMINAL_SUMMARY_RU_PAIRS } from './apply-terminal-summary-ru-pairs.mjs'
import { glossFluxPrintToFileSummary } from './inject-flux-summary-pole.mjs'
import { listTerminalContractHintFiles } from './terminal-contract-hint-paths.mjs'

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

function glossSummariesInText(s) {
  const summaryRe = /summary: '((?:[^'\\\\]|\\\\.)*)'/g
  let glossHits = 0
  const next = s.replace(summaryRe, (full, inner) => {
    const glossed = glossFluxPrintToFileSummary(inner)
    if (glossed !== inner) {
      glossHits++
      return \`summary: '\${glossed}'\`
    }
    return full
  })
  return { s: next, glossHits }
}

let replacements = 0
let glossTotal = 0
for (const filePath of listTerminalContractHintFiles()) {
  let s = fs.readFileSync(filePath, 'utf8')
  const applied = applyPairsToText(s, TERMINAL_SUMMARY_RU_PAIRS)
  s = applied.s
  replacements += applied.total
  const glossed = glossSummariesInText(s)
  s = glossed.s
  glossTotal += glossed.glossHits
  fs.writeFileSync(filePath, s, 'utf8')
  console.log('file', filePath.replace(/\\\\/g, '/'), 'gloss:', glossed.glossHits)
}

console.log('OK terminal-contract hints', 'replacements:', replacements, 'flux (поле) gloss:', glossTotal)
`

fs.writeFileSync(path.join(__dirname, 'apply-terminal-summary-ru.mjs'), runner)
console.log(
  `[split-apply-terminal-summary-ru-pairs] ${elements.length} pairs → ${partBodies.length} parts + runner`
)
