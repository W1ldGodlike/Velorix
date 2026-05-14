import { readFileSync } from 'node:fs'

const path = 'IMPLEMENTATION_JOURNAL.md'
const text = readFileSync(path, 'utf8')
const lines = text.split(/\r?\n/)

const entryRe = /^- \[J-(\d{3,})\] \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \[(Assistant|SDK)\]: /
const legacyEntryRe = /^- \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \[(Assistant|SDK)\]: /

let expected = 1
let failed = false
/** @type {Map<number, number>} */
const seenIds = new Map()

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
}

if (expected === 1) {
  console.error('[journal] no numbered entries found')
  failed = true
}

if (failed) {
  process.exitCode = 2
} else {
  console.log(`[journal] OK (${expected - 1} entries)`)
}
