/**
 * Сжимает диапазоны микрозаписей в сводные строки и перенумеровывает журнал J-001…
 * Время сводных строк — текущее локальное ОС (честное «когда сжали»), без git.
 *
 *   node scripts/journal-consolidate.mjs           # dry-run
 *   node scripts/journal-consolidate.mjs --write
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { formatEntryLine, parseJournalEntries, readLocalStamp } from './journal-lib.mjs'

const journalPath = 'IMPLEMENTATION_JOURNAL.md'
const write = process.argv.includes('--write')

/**
 * Одноразовые диапазоны **исторических** id J-NNN (до сжатия). Не повторять диапазон,
 * если в журнале уже одна сводная строка с «бывш. J-…» — иначе съедут живые записи.
 */
/** @type {Array<{ from: number, to: number, author: string, body: string }>} */
const MERGES = []

const raw = readFileSync(journalPath, 'utf8')
const entriesMarker = /^## Записи\r?\n/m
const markerMatch = entriesMarker.exec(raw)
if (!markerMatch || markerMatch.index === undefined) {
  console.error('[journal-consolidate] missing ## Записи')
  process.exit(1)
}
const headerEnd = markerMatch.index + markerMatch[0].length
const header = raw.slice(0, headerEnd)

const entries = parseJournalEntries(raw)
if (entries.length === 0) {
  console.error('[journal-consolidate] no entries')
  process.exit(1)
}

const mergeByFrom = new Map(MERGES.map((m) => [m.from, m]))
/** @type {typeof entries} */
const out = []
let stampMs = Date.now()

for (const e of entries) {
  const merge = mergeByFrom.get(e.id)
  if (merge) {
    if (e.id !== merge.from) {
      continue
    }
    const d = new Date(stampMs)
    const p = (n) => String(n).padStart(2, '0')
    const stamp = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
    stampMs += 2500
    out.push({
      id: 0,
      stamp,
      author: merge.author,
      body: merge.body,
      ms: d.getTime()
    })
    console.log(
      `[journal-consolidate] merge J-${merge.from}..J-${merge.to} → 1 (${merge.to - merge.from + 1} removed)`
    )
    continue
  }
  const inRange = MERGES.some((m) => e.id >= m.from && e.id <= m.to)
  if (inRange) {
    continue
  }
  out.push(e)
}

const lines = out.map((e, i) => {
  const id = i + 1
  return formatEntryLine({ ...e, id })
})

console.log(`[journal-consolidate] ${entries.length} → ${out.length} entries`)
if (!write) {
  console.log('[journal-consolidate] dry-run; pass --write to apply')
  process.exit(0)
}

writeFileSync(journalPath, `${header}${lines.join('\n')}\n`, 'utf8')
console.log(`[journal-consolidate] wrote ${journalPath}`)
