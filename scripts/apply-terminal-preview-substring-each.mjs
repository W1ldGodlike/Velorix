/**
 * Maint: hoist single-substring preview expects into TERMINAL_PREVIEW_LINE_SUBSTRINGS it.each.
 * Run after updating tests/fixtures/terminal-preview-line-substring-cases.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'

const testPath = 'tests/shared/terminal-contract-scenarios.test.ts'
let t = readFileSync(testPath, 'utf8')

const stripRe =
  / {4}expect\(lines\.some\(\(l\) => l\.includes\('(?:\\'|[^']*)'\)\)\)\.toBe\(true\)\r?\n/g
const stripped = t.replace(stripRe, '')
const removed = (t.match(stripRe) ?? []).length
t = stripped

const importFixture =
  "import { TERMINAL_PREVIEW_LINE_SUBSTRINGS } from '../fixtures/terminal-preview-line-substring-cases'"
if (!t.includes(importFixture)) {
  t = t.replace(
    "from '../fixtures/terminal-downloads-line-batches'",
    "from '../fixtures/terminal-downloads-line-batches'\nimport { TERMINAL_PREVIEW_LINE_SUBSTRINGS } from '../fixtures/terminal-preview-line-substring-cases'"
  )
}
if (!t.includes('expectPreviewLineSubstring')) {
  t = t.replace(
    'expectDownloadsFullLinesContain\n} from',
    'expectDownloadsFullLinesContain,\n  expectPreviewLineSubstring\n} from'
  )
}

const eachBlock = `
  it.each(TERMINAL_PREVIEW_LINE_SUBSTRINGS)(
    'preview: fullLine содержит фрагмент %s',
    (substring) => {
      expectPreviewLineSubstring(substring)
    }
  )
`

if (!t.includes('TERMINAL_PREVIEW_LINE_SUBSTRINGS)')) {
  const anchor = "  it('preview: fullLine без кавычек, плейсхолдер ровно один раз', () => {"
  const end = t.indexOf('  })', t.indexOf(anchor))
  if (end < 0) {
    throw new Error('preview fullLine anchor not found')
  }
  const insertAt = end + '  })'.length
  t = t.slice(0, insertAt) + eachBlock + t.slice(insertAt)
}

writeFileSync(testPath, t, 'utf8')
console.log(`[apply-preview-substrings] removed=${removed}`)
