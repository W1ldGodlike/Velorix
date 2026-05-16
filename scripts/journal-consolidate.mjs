/**
 * Сжимает диапазоны микрозаписей в сводные строки и перенумеровывает журнал J-001…
 * Время сводных строк — текущее локальное ОС (честное «когда сжали»), без git.
 *
 *   node scripts/journal-consolidate.mjs           # dry-run
 *   node scripts/journal-consolidate.mjs --write
 */
import { readFileSync, writeFileSync } from 'node:fs'
import {
  formatEntryLine,
  parseJournalEntries,
  readLocalStamp
} from './journal-lib.mjs'

const journalPath = 'IMPLEMENTATION_JOURNAL.md'
const write = process.argv.includes('--write')

/** @type {Array<{ from: number, to: number, author: string, body: string }>} */
const MERGES = [
  {
    from: 681,
    to: 728,
    author: 'Assistant',
    body:
      '§7.3 пакетный экспорт — сводка микрошагов UI: общая папка вывода, DnD папки, открытие в редакторе/проводнике, TSV-отчёт, иконки/toolbar/caption/headers таблицы, шаблон имени, параллелизм, aria-busy на панели (бывш. J-681–J-728).'
  },
  {
    from: 729,
    to: 892,
    author: 'Assistant',
    body:
      '§1.1/§4/§6–§9 — доступность (сводка): role=toolbar/region/tablist, aria-orientation, label/htmlFor, captions, списки, модалки, ffprobe-таблицы, загрузки/терминал/база знаний (бывш. J-729–J-892).'
  },
  {
    from: 893,
    to: 1007,
    author: 'Assistant',
    body:
      '§1.1 — aria-busy и связанные busy-флаги по workspace: редактор, загрузки, терминал, ffprobe, batch, about, knowledge, appChromeBusy, таймлайн/waveform (бывш. J-893–J-1007).'
  },
  {
    from: 1008,
    to: 1010,
    author: 'Assistant',
    body:
      'Сводка: docs/чеклист (~45%, 68/705); lint — queueMicrotask для probePending в useEffect (реакция на eslint, не try/catch), LF/prettier; check-journal — исправлен парсинг даты; `journal:stamp`, `journal-lib`, `journal-consolidate`; удалён `sync-journal-times-from-git`; `engines-bundled-sha256`; правило одной записи за итерацию; сжатие микрозаписей J-681–728, J-729–892, J-893–1007; `check:quiet` ок (бывш. J-1008–J-1010).'
  }
]

const headerEnd = '## Записи\n'
const raw = readFileSync(journalPath, 'utf8')
const headerIdx = raw.indexOf(headerEnd)
if (headerIdx < 0) {
  console.error('[journal-consolidate] missing ## Записи')
  process.exit(1)
}
const header = raw.slice(0, headerIdx + headerEnd.length)

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
