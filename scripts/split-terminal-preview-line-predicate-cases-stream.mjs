/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'node:fs'
import path from 'node:path'

const fixtureDir = path.join('tests/fixtures')
const srcPath = path.join(fixtureDir, 'terminal-preview-line-predicate-cases-stream.ts')
const lines = fs.readFileSync(srcPath, 'utf8').split(/\r?\n/)

const arrayStart = lines.findIndex((l) =>
  l.includes('TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM')
)
const caseStarts = []
for (let i = arrayStart + 1; i < lines.length; i++) {
  if (/^ {4}\{$/.test(lines[i])) {
    caseStarts.push(i)
  }
}

const mid = Math.ceil(caseStarts.length / 2)

function normalizeCaseChunk(rawLines) {
  const chunk = [...rawLines]
  while (
    chunk.length > 0 &&
    (chunk[chunk.length - 1].trim() === ']' || chunk[chunk.length - 1].trim() === '')
  ) {
    chunk.pop()
  }
  const last = chunk.length - 1
  if (last >= 0 && chunk[last].trim() === '},') {
    chunk[last] = '  }'
  } else if (last >= 0 && chunk[last].trim().endsWith(',')) {
    chunk[last] = chunk[last].replace(/,\s*$/, '')
  }
  return chunk.join('\n')
}

const partImports = `import type { TerminalPreviewLinePredicate } from './terminal-preview-line-predicate-cases-types'
`

for (const [name, from, to] of [
  ['a', 0, mid],
  ['b', mid, caseStarts.length]
]) {
  const start = caseStarts[from]
  const end = to < caseStarts.length ? caseStarts[to] : lines.length
  const body = normalizeCaseChunk(lines.slice(start, end))
  const constName = `TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM_${name.toUpperCase()}`
  fs.writeFileSync(
    path.join(fixtureDir, `terminal-preview-line-predicate-cases-stream-${name}.ts`),
    `${partImports}
export const ${constName}: readonly TerminalPreviewLinePredicate[] = [
${body}
]
`
  )
  console.log(`  stream-${name}: cases ${to - from}`)
}

const entryPath = path.join(fixtureDir, 'terminal-preview-line-predicate-cases.ts')
const entry = fs.readFileSync(entryPath, 'utf8')
const next = entry
  .replace(
    "import { TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM } from './terminal-preview-line-predicate-cases-stream'",
    "import { TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM_A } from './terminal-preview-line-predicate-cases-stream-a'\nimport { TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM_B } from './terminal-preview-line-predicate-cases-stream-b'"
  )
  .replace(
    '...TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM,',
    '...TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM_A,\n  ...TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM_B,'
  )
fs.writeFileSync(entryPath, next)
fs.unlinkSync(srcPath)
console.log('[split-terminal-preview-line-predicate-cases-stream] stream-a + stream-b')
