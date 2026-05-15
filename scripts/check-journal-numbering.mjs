import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const path = 'IMPLEMENTATION_JOURNAL.md'
const text = readFileSync(path, 'utf8')
const lines = text.split(/\r?\n/)

const entryRe =
  /^- \[J-(\d{3,})\] (\d{4}-\d{2}-\d{2}) (\d{2}):(\d{2}):(\d{2}) \[(Assistant|SDK)\]: /
const legacyEntryRe = /^- \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \[(Assistant|SDK)\]: /

const gitParenRe = /\(J-(\d{3,})\)/g

let expected = 1
let failed = false
/** @type {Map<number, number>} */
const seenIds = new Map()

/** @type {Map<number, string>} */
const gitAnchors = new Map()

try {
  const log = execFileSync('git', ['log', '--format=%ci %s'], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024
  })
  for (const line of log.split(/\r?\n/)) {
    if (!line.trim()) continue
    const m = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) [+-]\d{4} (.+)$/.exec(line)
    if (!m) continue
    for (const jm of m[2].matchAll(gitParenRe)) {
      const id = Number.parseInt(jm[1], 10)
      if (!gitAnchors.has(id)) {
        gitAnchors.set(id, m[1])
      }
    }
  }
} catch {
  console.warn('[journal] git log unavailable; skipping git time cross-check')
}

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

  const gitStamp = gitAnchors.get(n)
  if (gitStamp && gitStamp !== stamp) {
    console.error(
      `[journal] line ${i + 1}: [J-${m[1]}] journal ${stamp} != git ${gitStamp} (commit has (J-${m[1]}))`
    )
    failed = true
  }
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
    '[journal] hint: new entry — local time or `git log -1 --format=%ci` after commit with (J-NNN); bulk fix: `node scripts/sync-journal-times-from-git.mjs --write`'
  )
  process.exitCode = 2
} else {
  console.log(
    `[journal] OK (${expected - 1} entries; monotonic; ${gitAnchors.size} git anchors (J-NNN))`
  )
}
