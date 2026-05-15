import { readFileSync } from 'node:fs'

const path = 'IMPLEMENTATION_JOURNAL.md'
const text = readFileSync(path, 'utf8')
const lines = text.split(/\r?\n/)

const entryRe =
  /^- \[J-(\d{3,})\] (\d{4}-\d{2}-\d{2}) (\d{2}):(\d{2}):(\d{2}) \[(Assistant|SDK)\]: /
const legacyEntryRe = /^- \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \[(Assistant|SDK)\]: /

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

  const m = entryRe.exec(line)
  if (!m) {
    if (legacyEntryRe.test(line)) {
      console.error(`[journal] line ${i + 1}: missing [J-NNN] prefix`)
      failed = true
    }
    continue
  }

  const n = Number.parseInt(m[1], 10)
  const stamp = `${m[2]} ${m[3]}:${m[4]}:${m[5]}`
  const ms = new Date(
    Number(m[2]),
    Number(m[3]) - 1,
    Number(m[4]),
    Number(m[5]),
    Number(m[6])
  ).getTime()

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

  if (ms > nowMs + futureSlackMs) {
    console.error(
      `[journal] line ${i + 1}: [J-${m[1]}] timestamp ${stamp} is in the future`
    )
    failed = true
  }

  stamps.push({ id: n, line: i + 1, ms, stamp })
}

for (let i = 1; i < stamps.length; i++) {
  const prev = stamps[i - 1]
  const cur = stamps[i]
  if (cur.ms < prev.ms) {
    console.error(
      `[journal] line ${cur.line}: [J-${String(cur.id).padStart(3, '0')}] ${cur.stamp} is before [J-${String(prev.id).padStart(3, '0')}] ${prev.stamp}`
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
    '[journal] hint: новая запись — локальное время `YYYY-MM-DD HH:mm:ss`, следующий `[J-NNN]` без пропусков после последней строки раздела «Записи».'
  )
  process.exitCode = 2
} else {
  console.log(`[journal] OK (${expected - 1} entries; monotonic time)`)
}
