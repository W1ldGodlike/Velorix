import { readFileSync } from 'node:fs'
import { ENTRY_RE, entryStampToMs, parseJournalEntries } from './journal-lib.mjs'

const path = 'IMPLEMENTATION_JOURNAL.md'
const text = readFileSync(path, 'utf8')
const lines = text.split(/\r?\n/)

let expected = 1
let failed = false
/** @type {Map<number, number>} */
const seenIds = new Map()

const nowMs = Date.now()
const futureSlackMs = 120_000

/** @type {Array<{ id: number; line: number; ms: number; stamp: string }>} */
const stamps = []

for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  if (!line.startsWith('- ')) continue

  const m = ENTRY_RE.exec(line)
  if (!m) {
    const legacy = /^- \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \[(Assistant|SDK)\]: /
    if (legacy.test(line)) {
      console.error(`[journal] line ${i + 1}: missing [J-NNN] prefix`)
      failed = true
    }
    continue
  }

  const n = Number.parseInt(m[1], 10)
  const stamp = `${m[2]} ${m[3]}:${m[4]}:${m[5]}`
  const ms = entryStampToMs(m)

  if (!Number.isFinite(ms)) {
    console.error(`[journal] line ${i + 1}: [J-${m[1]}] invalid timestamp ${stamp}`)
    failed = true
  }

  if (seenIds.has(n)) {
    console.error(
      `[journal] line ${i + 1}: duplicate [J-${m[1]}] (first at line ${seenIds.get(n)})`
    )
    failed = true
  }
  seenIds.set(n, i + 1)

  if (n !== expected) {
    console.error(
      `[journal] line ${i + 1}: expected J-${String(expected).padStart(3, '0')}, got J-${m[1]}`
    )
    failed = true
  }
  expected++

  if (Number.isFinite(ms) && ms > nowMs + futureSlackMs) {
    console.error(`[journal] line ${i + 1}: [J-${m[1]}] timestamp ${stamp} is in the future`)
    failed = true
  }

  stamps.push({ id: n, line: i + 1, ms, stamp })
}

for (let i = 1; i < stamps.length; i++) {
  const prev = stamps[i - 1]
  const cur = stamps[i]
  if (!Number.isFinite(cur.ms) || !Number.isFinite(prev.ms)) {
    continue
  }
  if (cur.ms < prev.ms) {
    console.error(
      `[journal] line ${cur.line}: [J-${String(cur.id).padStart(3, '0')}] ${cur.stamp} is before [J-${String(prev.id).padStart(3, '0')}] ${prev.stamp}`
    )
    failed = true
  }
}

/** Однотипные микро-шаги в хвосте журнала (любой §). */
const MICRO_JOURNAL_PATTERNS = [
  {
    id: 'ffprobe-field',
    re: /§9\s*—\s*ffprobe\s+`format\.(tags\.\w+|\w+)`|format\.tags\.\w+\s*→\s*`container\w+`/i,
    hint: 'ffprobe format/tags — пакетом через ffprobe-format-tag-registry.ts'
  },
  {
    id: 'resolve-field',
    re: /§7\.3\s*—\s*регрессия\s+resolve:/i,
    hint: 'resolve export — пакетом через ffmpeg-export-resolve-field-registry.ts'
  },
  {
    id: 'broadcast-ipc',
    re: /§6\.?\d*\s*—\s*broadcast\s+`[^`]+`/i,
    hint: 'IPC broadcast — один срез: канал + preload + окна'
  },
  {
    id: 'smoke-packaged',
    re: /§(9|19|7)\/?\s*§?\d*\s*—\s*`smoke:packaged-/i,
    hint: 'packaged smoke — пакетом в check:release, не по одному бинарнику на J'
  },
  {
    id: 'aria-busy',
    re: /aria-busy|busy-флаг/i,
    hint: 'busy-флаги — пакетом по workspace, не по одному компоненту'
  },
  {
    id: 'settings-ipc',
    re: /IPC\s+`settingsSet\w+`|preload.*settings/i,
    hint: 'settings IPC — пакет полей или реестр, не одно поле на итерацию'
  }
]

/** @type {typeof lines} */
const entryLines = []
for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  if (!line.startsWith('- ')) continue
  const m = ENTRY_RE.exec(line)
  if (!m) continue
  entryLines.push({ line: i + 1, body: line.slice(m[0].length) })
}

const scanTail = entryLines.slice(-14)
for (const pattern of MICRO_JOURNAL_PATTERNS) {
  let count = 0
  for (const e of scanTail) {
    if (pattern.re.test(e.body)) count += 1
  }
  if (count >= 4) {
    console.error(
      `[journal] last ${count} entries look like micro "${pattern.id}" steps — one iteration = one J; ${pattern.hint}; see fluxalloy-iteration-batch.mdc`
    )
    failed = true
  }
}

const tail = stamps.slice(-10).filter((s) => Number.isFinite(s.ms))
if (tail.length >= 5) {
  const deltas = []
  for (let i = 1; i < tail.length; i++) {
    deltas.push(tail[i].ms - tail[i - 1].ms)
  }
  const first = deltas[0]
  const grid =
    first > 0 &&
    deltas.every((d) => d === first) &&
    (first % 60_000 === 0 || first % 120_000 === 0)
  if (grid) {
    console.error(
      `[journal] last ${tail.length} entries have identical ${first / 1000}s step — invented timestamps; one summary line per iteration via \`npm run journal:stamp\``
    )
    failed = true
  }
}

if (expected === 1) {
  console.error('[journal] no numbered entries found')
  failed = true
}

if (failed) {
  console.error(
    '[journal] hint: одна сводная запись за итерацию; время только `npm run journal:stamp` / Get-Date; без git и без «сетки».'
  )
  process.exitCode = 2
} else {
  console.log(`[journal] OK (${expected - 1} entries; monotonic time)`)
}
