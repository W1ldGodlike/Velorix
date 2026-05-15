/**
 * Опционально: выставить время строк журнала по якорям git `(J-NNN)` в сообщениях коммитов
 * и линейно интерполировать между ними. Не обязательный шаг — `check:journal` больше не требует совпадения с git.
 * Использование: node scripts/sync-journal-times-from-git.mjs [--write]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const journalPath = 'IMPLEMENTATION_JOURNAL.md'
const write = process.argv.includes('--write')

const entryRe =
  /^(- \[J-(\d+)\]) (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) (\[(?:Assistant|SDK)\]: .*)$/

const gitParenRe = /\(J-(\d{3,})\)/g

/** @type {Map<number, string>} */
const gitAnchors = new Map()

const log = execFileSync('git', ['log', '--format=%ci %s'], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
for (const line of log.split(/\r?\n/)) {
  if (!line.trim()) continue
  const m = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) [+-]\d{4} (.+)$/.exec(line)
  if (!m) continue
  const stamp = m[1]
  for (const jm of m[2].matchAll(gitParenRe)) {
    const id = Number.parseInt(jm[1], 10)
    if (!gitAnchors.has(id)) {
      gitAnchors.set(id, stamp)
    }
  }
}

function parseStamp(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(s)
  if (!m) return null
  return new Date(
    Number(m[1]),
    Number(m[2]) - 1,
    Number(m[3]),
    Number(m[4]),
    Number(m[5]),
    Number(m[6])
  ).getTime()
}

function formatStamp(ms) {
  const d = new Date(ms)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

const text = readFileSync(journalPath, 'utf8')
const lines = text.split(/\r?\n/)

/** @type {Array<{ lineIdx: number; id: number; prefix: string; suffix: string; orig: string }>} */
const entries = []

for (let i = 0; i < lines.length; i++) {
  const m = entryRe.exec(lines[i])
  if (!m) continue
  entries.push({
    lineIdx: i,
    id: Number.parseInt(m[2], 10),
    prefix: m[1],
    suffix: m[4],
    orig: m[3]
  })
}

const anchorList = [...gitAnchors.entries()]
  .map(([id, stamp]) => ({ id, ms: parseStamp(stamp) ?? 0 }))
  .filter((a) => a.ms > 0)
  .sort((a, b) => a.id - b.id)

function interpolateMs(id) {
  if (gitAnchors.has(id)) {
    return parseStamp(gitAnchors.get(id))
  }
  let prev = null
  let next = null
  for (const a of anchorList) {
    if (a.id < id) {
      prev = a
    } else if (a.id > id && !next) {
      next = a
      break
    }
  }
  if (prev && next) {
    const t = (id - prev.id) / (next.id - prev.id)
    return Math.round(prev.ms + t * (next.ms - prev.ms))
  }
  if (prev && !next) {
    return prev.ms + (id - prev.id) * 60_000
  }
  if (!prev && next) {
    return next.ms - (next.id - id) * 60_000
  }
  const e = entries.find((x) => x.id === id)
  return e ? parseStamp(e.orig) : null
}

const nowMs = Date.now()
let changed = 0
const outLines = [...lines]

for (const e of entries) {
  let ms = interpolateMs(e.id)
  if (ms === null || !Number.isFinite(ms)) {
    ms = parseStamp(e.orig) ?? nowMs
  }
  if (!gitAnchors.has(e.id) && ms > nowMs + 1000) {
    ms = nowMs
  }
  const stamp = formatStamp(ms)
  const next = `${e.prefix} ${stamp} ${e.suffix}`
  if (outLines[e.lineIdx] !== next) {
    outLines[e.lineIdx] = next
    changed++
  }
}

console.log(
  `[sync-journal] git anchors (J-NNN): ${gitAnchors.size}, entries: ${entries.length}, lines changed: ${changed}`
)

if (write) {
  writeFileSync(journalPath, outLines.join('\n') + (text.endsWith('\n') ? '\n' : ''), 'utf8')
  console.log(`[sync-journal] wrote ${journalPath}`)
} else {
  console.log('[sync-journal] dry-run; pass --write to apply')
}
