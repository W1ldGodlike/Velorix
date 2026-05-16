/**
 * Hoist compound preview `lines.some` tests into TERMINAL_PREVIEW_LINE_PREDICATES it.each.
 * Run after: node scripts/collect-terminal-preview-predicates.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const testPath = 'tests/shared/terminal-contract-scenarios.test.ts'
let t = readFileSync(testPath, 'utf8')

const KEEP = new Set(['fullLine без кавычек, плейсхолдер ровно один раз'])

const previewItRe = /\n {2}it\('preview:((?:\\'|[^'])*)', \(\) => \{[\s\S]*?\n {2}\}\)/g
let removed = 0
t = t.replace(previewItRe, (block, labelRaw) => {
  const label = labelRaw.replace(/\\'/g, "'").trim()
  if (KEEP.has(label)) {
    return block
  }
  if (!block.includes('lines.some')) {
    return block
  }
  removed++
  return ''
})

const importFixture =
  "import { TERMINAL_PREVIEW_LINE_PREDICATES } from '../fixtures/terminal-preview-line-predicate-cases'"
if (!t.includes(importFixture)) {
  t = t.replace(
    "from '../fixtures/terminal-preview-line-substring-cases'",
    "from '../fixtures/terminal-preview-line-substring-cases'\nimport { TERMINAL_PREVIEW_LINE_PREDICATES } from '../fixtures/terminal-preview-line-predicate-cases'"
  )
}
if (!t.includes('expectPreviewLinePredicate')) {
  t = t.replace(
    'expectPreviewLineSubstring\n} from',
    'expectPreviewLineSubstring,\n  expectPreviewLinePredicate\n} from'
  )
}

const eachBlock = `
  it.each(TERMINAL_PREVIEW_LINE_PREDICATES)(
    'preview: $label',
    (predicate) => {
      expectPreviewLinePredicate(predicate)
    }
  )
`

if (!t.includes('TERMINAL_PREVIEW_LINE_PREDICATES)')) {
  const anchor = '  it.each(TERMINAL_PREVIEW_LINE_SUBSTRINGS)('
  const idx = t.indexOf(anchor)
  if (idx < 0) {
    throw new Error('substring it.each anchor not found')
  }
  const insertAt = t.indexOf('\n  it.each(TERMINAL_DOWNLOADS_PRINT', idx)
  if (insertAt < 0) {
    throw new Error('insert point not found')
  }
  t = t.slice(0, insertAt) + eachBlock + t.slice(insertAt)
}

writeFileSync(testPath, t, 'utf8')
console.log(`[apply-preview-predicates] removedPreviewIt=${removed}`)
