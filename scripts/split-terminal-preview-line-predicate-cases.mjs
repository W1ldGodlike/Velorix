/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Split terminal preview predicate fixture (~800+ lines) into parts (<400 each).
 * Run: node scripts/split-terminal-preview-line-predicate-cases.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const fixtureDir = path.join('tests/fixtures')
const srcPath = path.join(fixtureDir, 'terminal-preview-line-predicate-cases.ts')
const lines = fs.readFileSync(srcPath, 'utf8').split(/\r?\n/)

const arrayStart = lines.findIndex((l) => l.includes('TERMINAL_PREVIEW_LINE_PREDICATES'))
const caseStarts = []
for (let i = arrayStart + 1; i < lines.length; i++) {
  if (/^ {2}\{$/.test(lines[i])) {
    caseStarts.push(i)
  }
}

const splits = [
  { name: 'json', from: 0, to: 55 },
  { name: 'stream-a', from: 55, to: 97 },
  { name: 'stream-b', from: 97, to: 140 },
  { name: 'format', from: 140, to: caseStarts.length }
]

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

for (const { name, from, to } of splits) {
  const start = caseStarts[from]
  const end = to < caseStarts.length ? caseStarts[to] : lines.length
  const body = normalizeCaseChunk(lines.slice(start, end))
  const suffix = name.toUpperCase().replace(/-/g, '_')
  const constName = `TERMINAL_PREVIEW_LINE_PREDICATE_CASES_${suffix}`
  const file = path.join(fixtureDir, `terminal-preview-line-predicate-cases-${name}.ts`)
  fs.writeFileSync(
    file,
    `${partImports}
export const ${constName}: readonly TerminalPreviewLinePredicate[] = [
${body}
]
`
  )
  console.log(`  ${file}: cases ${to - from}`)
}

const typesPath = path.join(fixtureDir, 'terminal-preview-line-predicate-cases-types.ts')
const typeBlock = `/** Тип составного предиката fullLine для smoke preview/ffprobe (§8 терминал). */
export type TerminalPreviewLinePredicate = {
  label: string
  includes: readonly string[]
  excludes?: readonly string[]
  needPlaceholder?: boolean
}
`
fs.writeFileSync(typesPath, typeBlock)

const entry = `/** Составные предикаты fullLine для smoke preview/ffprobe (§8 терминал). */
export type { TerminalPreviewLinePredicate } from './terminal-preview-line-predicate-cases-types'
import { TERMINAL_PREVIEW_LINE_PREDICATE_CASES_JSON } from './terminal-preview-line-predicate-cases-json'
import { TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM_A } from './terminal-preview-line-predicate-cases-stream-a'
import { TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM_B } from './terminal-preview-line-predicate-cases-stream-b'
import { TERMINAL_PREVIEW_LINE_PREDICATE_CASES_FORMAT } from './terminal-preview-line-predicate-cases-format'

export const TERMINAL_PREVIEW_LINE_PREDICATES = [
  ...TERMINAL_PREVIEW_LINE_PREDICATE_CASES_JSON,
  ...TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM_A,
  ...TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM_B,
  ...TERMINAL_PREVIEW_LINE_PREDICATE_CASES_FORMAT
] as const
`

fs.writeFileSync(srcPath, entry)

try {
  fs.unlinkSync(path.join(fixtureDir, 'terminal-preview-line-predicate-cases-stream.ts'))
} catch {
  // already removed
}

console.log('[split-terminal-preview-line-predicate-cases] entry + 4 parts + types')
