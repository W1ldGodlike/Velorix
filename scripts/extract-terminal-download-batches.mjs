/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Maint: merge pure `expect(lines).toContain` downloads tests into line-batches fixture.
 * Run: node scripts/extract-terminal-download-batches.mjs
 */
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const testPath = 'tests/shared/terminal-contract-scenarios.test.ts'
const fixturePath = 'tests/fixtures/terminal-downloads-line-batches.ts'
let t = readFileSync(testPath, 'utf8')

const startNeedle = "describe('TERMINAL_SCENARIO_HINTS_*', () => {"
const startIdx = t.indexOf(startNeedle)
if (startIdx < 0) {
  throw new Error('describe block not found')
}

function findDescribeClose(source, openIdx) {
  const openBrace = source.indexOf('{', openIdx)
  let depth = 0
  for (let i = openBrace; i < source.length; i++) {
    const ch = source[i]
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) {
        return i + 1
      }
    }
  }
  throw new Error('unclosed describe')
}

function unescLabel(s) {
  return s.replace(/\\'/g, "'")
}

function loadExistingBatches() {
  if (!existsSync(fixturePath)) {
    return []
  }
  const src = readFileSync(fixturePath, 'utf8')
  const out = []
  const blockRe = /\{\s*label:\s*'((?:\\'|[^'])*)',\s*lines:\s*\[([\s\S]*?)\]\s*as const\s*\}/g
  let bm
  while ((bm = blockRe.exec(src)) !== null) {
    const label = unescLabel(bm[1])
    const lines = []
    const lineRe = /^\s*'((?:\\'|[^'])*)',/gm
    let lm
    while ((lm = lineRe.exec(bm[2])) !== null) {
      lines.push(lm[1].replace(/\\'/g, "'"))
    }
    out.push({ label, lines })
  }
  return out
}

function nextSiblingTestStart(source, fromPos, endBound) {
  const slice = source.slice(fromPos + 1, endBound)
  const m = slice.match(/\n {2}it(?:\.each)?\(/)
  return m ? fromPos + 1 + m.index : endBound
}

const describeEnd = findDescribeClose(t, startIdx)
const describeStart = startIdx + startNeedle.length
const describeInner = t.slice(describeStart, describeEnd - 2)

const newBatches = []
const itRe = /\n {2}it\('downloads:((?:\\'|[^'])*)', \(\) => \{/g
const markers = []
let m
while ((m = itRe.exec(describeInner)) !== null) {
  const label = unescLabel(m[1])
  const headerStart = describeStart + m.index
  markers.push({
    label,
    bodyStart: headerStart + m[0].length,
    headerStart
  })
}

const containRe = /expect\(lines\)\.toContain\(\s*(['"])((?:\\.|(?!\1)[\s\S])*?)\1\s*\)/g
const removeRanges = []

for (let i = 0; i < markers.length; i++) {
  const { label, bodyStart, headerStart } = markers[i]
  const bodyEnd = nextSiblingTestStart(t, headerStart, describeEnd)
  const body = t.slice(bodyStart, bodyEnd)

  if (body.includes('TERMINAL_DOWNLOADS_LINE_BATCHES')) {
    continue
  }
  if (!body.includes('const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map')) {
    continue
  }
  const contains = []
  for (const cm of body.matchAll(containRe)) {
    contains.push(cm[2].replace(/\\'/g, "'").replace(/\\"/g, '"'))
  }
  const some = (body.match(/lines\.some/g) ?? []).length
  if (contains.length >= 2 && some === 0) {
    newBatches.push({ label: label.trim(), lines: contains })
    removeRanges.push({ start: headerStart, end: bodyEnd })
  }
}

const mergedByLabel = new Map(loadExistingBatches().map((b) => [b.label, b]))
for (const b of newBatches) {
  mergedByLabel.set(b.label, b)
}
const batches = [...mergedByLabel.values()]

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

const batchTs = `/** §8 — пакеты expected fullLine для smoke downloads-сценариев терминала. */
export type TerminalDownloadsLineBatch = { label: string; lines: readonly string[] }

export const TERMINAL_DOWNLOADS_LINE_BATCHES: readonly TerminalDownloadsLineBatch[] = [
${batches
  .map(
    (b) => `  {
    label: '${esc(b.label)}',
    lines: [
${b.lines.map((l) => `      '${esc(l)}',`).join('\n')}
    ] as const
  }`
  )
  .join(',\n')}
]
`

writeFileSync(fixturePath, batchTs, 'utf8')
execSync('node scripts/split-terminal-downloads-line-batches.mjs', { stdio: 'inherit' })

for (const { start, end } of removeRanges.sort((a, b) => b.start - a.start)) {
  t = t.slice(0, start) + t.slice(end)
}

const batchItNeedle = "it.each(TERMINAL_DOWNLOADS_LINE_BATCHES)('downloads batch: $label'"
if (!t.includes(batchItNeedle)) {
  const closeIdx = findDescribeClose(t, startIdx)
  const insert =
    `\n  it.each(TERMINAL_DOWNLOADS_LINE_BATCHES)('downloads batch: $label', ({ lines }) => {\n` +
    `    expectDownloadsFullLinesContain(lines)\n` +
    `  })\n`
  t = t.slice(0, closeIdx) + insert + t.slice(closeIdx)
}

if (!t.includes('TERMINAL_DOWNLOADS_LINE_BATCHES')) {
  t = t.replace(
    "from '../fixtures/terminal-downloads-full-line-expectations'",
    "from '../fixtures/terminal-downloads-full-line-expectations'\nimport { TERMINAL_DOWNLOADS_LINE_BATCHES } from '../fixtures/terminal-downloads-line-batches'"
  )
}
if (!t.includes('expectDownloadsFullLinesContain')) {
  t = t.replace(
    "import { downloadsScenarioFullLines } from '../fixtures/terminal-scenario-test-helpers'",
    "import {\n  downloadsScenarioFullLines,\n  expectDownloadsFullLinesContain\n} from '../fixtures/terminal-scenario-test-helpers'"
  )
}

writeFileSync(testPath, t, 'utf8')
const keptDownloadsIt = (t.match(/\n {2}it\('downloads:/g) ?? []).length
console.log(
  `[extract] new=${newBatches.length} merged=${batches.length} lines=${batches.reduce((s, b) => s + b.lines.length, 0)} keptDownloadsIt=${keptDownloadsIt}`
)
