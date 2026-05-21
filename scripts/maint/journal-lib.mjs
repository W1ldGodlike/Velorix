/**
 * Общие утилиты журнала: парсинг, локальная метка времени, формат строки.
 */
import { execFileSync } from 'node:child_process'

export const ENTRY_RE =
  /^- \[J-(\d+)\] (\d{4}-\d{2}-\d{2}) (\d{2}):(\d{2}):(\d{2}) \[(Assistant|SDK)\]: (.*)$/

/** @param {RegExpExecArray} m */
export function entryStampToMs(m) {
  const [y, mo, d] = m[2].split('-').map((x) => Number.parseInt(x, 10))
  return new Date(
    y,
    mo - 1,
    d,
    Number.parseInt(m[3], 10),
    Number.parseInt(m[4], 10),
    Number.parseInt(m[5], 10)
  ).getTime()
}

/** @returns {string} */
export function readLocalStamp() {
  if (process.platform === 'win32') {
    return execFileSync(
      'powershell',
      ['-NoProfile', '-Command', 'Get-Date -Format "yyyy-MM-dd HH:mm:ss"'],
      { encoding: 'utf8' }
    ).trim()
  }
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

/** @param {number} id */
export function formatJournalId(id) {
  const width = id >= 1000 ? 4 : 3
  return `J-${String(id).padStart(width, '0')}`
}

/** @param {{ id: number, stamp: string, author: string, body: string }} e */
export function formatEntryLine(e) {
  return `- [${formatJournalId(e.id)}] ${e.stamp} [${e.author}]: ${e.body}`
}

/**
 * @param {string} text
 * @returns {Array<{ id: number, stamp: string, author: string, body: string, ms: number }>}
 */
export function parseJournalEntries(text) {
  const lines = text.split(/\r?\n/)
  /** @type {Array<{ id: number, stamp: string, author: string, body: string, ms: number }>} */
  const entries = []
  for (const line of lines) {
    const m = ENTRY_RE.exec(line)
    if (!m) continue
    const stamp = `${m[2]} ${m[3]}:${m[4]}:${m[5]}`
    entries.push({
      id: Number.parseInt(m[1], 10),
      stamp,
      author: m[6],
      body: m[7].trim(),
      ms: entryStampToMs(m)
    })
  }
  return entries
}
