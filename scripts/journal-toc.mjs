/**
 * Вставляет/обновляет оглавление в IMPLEMENTATION_JOURNAL.md (якоря по J-NNN).
 *   node scripts/journal-toc.mjs           # dry-run
 *   node scripts/journal-toc.mjs --write
 */
import { readFileSync, writeFileSync } from 'node:fs'

const journalPath = 'IMPLEMENTATION_JOURNAL.md'
const write = process.argv.includes('--write')
const raw = readFileSync(journalPath, 'utf8')
const entryRe = /^- \[(J-\d+)\]/gm
const ids = []
let m
while ((m = entryRe.exec(raw)) !== null) {
  ids.push(m[1])
}
const recent = ids.slice(-40).reverse()
const tocLines = [
  '<!-- journal-toc: auto -->',
  '## Оглавление (последние записи)',
  '',
  ...recent.map((id) => `- [${id}](#${id.toLowerCase()})`),
  ''
]
const tocBlock = `${tocLines.join('\n')}\n`
const startMarker = '<!-- journal-toc: auto -->'
const endMarker = '<!-- /journal-toc -->'
const start = raw.indexOf(startMarker)
const end = raw.indexOf(endMarker)
let next
if (start >= 0 && end > start) {
  next = `${raw.slice(0, start)}${tocBlock}${endMarker}\n${raw.slice(end + endMarker.length)}`
} else {
  const entriesIdx = raw.indexOf('## Записи')
  if (entriesIdx < 0) {
    console.error('[journal-toc] missing ## Записи')
    process.exit(1)
  }
  next = `${raw.slice(0, entriesIdx)}${tocBlock}${endMarker}\n\n${raw.slice(entriesIdx)}`
}
if (next === raw) {
  console.log('[journal-toc] unchanged')
  process.exit(0)
}
if (!write) {
  console.log('[journal-toc] dry-run: would update TOC (%d anchors)', recent.length)
  process.exit(0)
}
writeFileSync(journalPath, next)
console.log('[journal-toc] wrote %d anchors', recent.length)
