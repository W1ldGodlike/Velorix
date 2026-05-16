/**
 * Печатает префикс следующей строки журнала с **текущим** локальным временем ОС.
 * Использование: npm run journal:stamp
 * Затем допишите сводный текст после `[Assistant]: ` или `[SDK]: `.
 */
import { readFileSync } from 'node:fs'
import { formatJournalId, readLocalStamp } from './journal-lib.mjs'

const journalPath = 'IMPLEMENTATION_JOURNAL.md'
const text = readFileSync(journalPath, 'utf8')
const entryRe = /^- \[J-(\d+)\] /gm
let lastId = 0
for (const m of text.matchAll(entryRe)) {
  const n = Number.parseInt(m[1], 10)
  if (n > lastId) {
    lastId = n
  }
}
const nextId = lastId + 1
const stamp = readLocalStamp()
const author = process.argv.includes('--sdk') ? 'SDK' : 'Assistant'
console.log(`- [${formatJournalId(nextId)}] ${stamp} [${author}]: `)
