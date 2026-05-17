/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Split downloads line-batch fixture (~900+ lines) into 3 parts (<400 each).
 * Run: node scripts/split-terminal-downloads-line-batches.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const fixtureDir = path.join('tests/fixtures')
const srcPath = path.join(fixtureDir, 'terminal-downloads-line-batches.ts')
const lines = fs.readFileSync(srcPath, 'utf8').split(/\r?\n/)

const arrayStart = lines.findIndex((l) => l.includes('TERMINAL_DOWNLOADS_LINE_BATCHES'))
const batchStarts = []
for (let i = arrayStart + 1; i < lines.length; i++) {
  if (/^ {2}\{$/.test(lines[i])) {
    batchStarts.push(i)
  }
}

const splits = [
  { name: 'a', from: 0, to: 20 },
  { name: 'b', from: 20, to: 40 },
  { name: 'c', from: 40, to: batchStarts.length }
]

function normalizeBatchChunk(rawLines) {
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

const partImports = `import type { TerminalDownloadsLineBatch } from './terminal-downloads-line-batches-types'
`

for (const { name, from, to } of splits) {
  const start = batchStarts[from]
  const end = to < batchStarts.length ? batchStarts[to] : lines.length
  const body = normalizeBatchChunk(lines.slice(start, end))
  const constName = `TERMINAL_DOWNLOADS_LINE_BATCHES_${name.toUpperCase()}`
  const file = path.join(fixtureDir, `terminal-downloads-line-batches-${name}.ts`)
  fs.writeFileSync(
    file,
    `${partImports}
export const ${constName}: readonly TerminalDownloadsLineBatch[] = [
${body}
]
`
  )
  console.log(`  ${file}: batches ${to - from}`)
}

const typesPath = path.join(fixtureDir, 'terminal-downloads-line-batches-types.ts')
fs.writeFileSync(
  typesPath,
  `/** Пакет expected fullLine для smoke downloads-сценариев терминала (§8). */
export type TerminalDownloadsLineBatch = { label: string; lines: readonly string[] }
`
)

const entry = `/** §8 — пакеты expected fullLine для smoke downloads-сценариев терминала. */
export type { TerminalDownloadsLineBatch } from './terminal-downloads-line-batches-types'
import { TERMINAL_DOWNLOADS_LINE_BATCHES_A } from './terminal-downloads-line-batches-a'
import { TERMINAL_DOWNLOADS_LINE_BATCHES_B } from './terminal-downloads-line-batches-b'
import { TERMINAL_DOWNLOADS_LINE_BATCHES_C } from './terminal-downloads-line-batches-c'

export const TERMINAL_DOWNLOADS_LINE_BATCHES = [
  ...TERMINAL_DOWNLOADS_LINE_BATCHES_A,
  ...TERMINAL_DOWNLOADS_LINE_BATCHES_B,
  ...TERMINAL_DOWNLOADS_LINE_BATCHES_C
] as const
`

fs.writeFileSync(srcPath, entry)
console.log('[split-terminal-downloads-line-batches] entry + 3 parts + types')
