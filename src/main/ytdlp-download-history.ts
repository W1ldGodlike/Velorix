import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'

import { logError } from './logger-service'

/**
 * §6.4 — персистентная история завершённых загрузок yt-dlp (отдельно от живой очереди).
 *
 * Файл лежит рядом с каталогом вывода (`userData/downloads/history.json`), чтобы пользователь
 * мог найти его через «Инструменты → Открыть папку…» / userData. Запись только из main после
 * финального статуса строки; renderer не получает произвольного FS-доступа.
 */

export const YTDLP_DOWNLOAD_HISTORY_SCHEMA = 1
export const YTDLP_DOWNLOAD_HISTORY_MAX_ENTRIES = 500

export type YtdlpDownloadHistoryOutcome = 'success' | 'error' | 'cancelled'

export interface YtdlpDownloadHistoryEntry {
  id: string
  startedAt: number
  finishedAt: number
  url: string
  shortLabel: string
  outcome: YtdlpDownloadHistoryOutcome
  /** Финальный статус строки очереди (как в таблице §6.1). */
  status: string
  /** Последний известный код выхода yt-dlp; при ошибке spawn — null. */
  exitCode: number | null
  /** Последняя распознанная строка ERROR: из stdout/stderr, если была. */
  errorHint: string | null
}

interface HistoryFileShape {
  schema: number
  entries: YtdlpDownloadHistoryEntry[]
}

function historyFilePath(userDataRoot: string): string {
  return join(userDataRoot, 'downloads', 'history.json')
}

/** Маппинг финального статуса очереди на исход для истории §6.4. */
export function outcomeFromQueueStatus(status: string): YtdlpDownloadHistoryOutcome {
  const t = status.trim()
  if (t === 'Готово') {
    return 'success'
  }
  if (t === 'Отменено') {
    return 'cancelled'
  }
  return 'error'
}

function isFiniteNumber(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n)
}

function isOutcome(x: unknown): x is YtdlpDownloadHistoryOutcome {
  return x === 'success' || x === 'error' || x === 'cancelled'
}

function parseEntry(raw: unknown): YtdlpDownloadHistoryEntry | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const o = raw as Record<string, unknown>
  if (typeof o.id !== 'string' || o.id.length === 0) {
    return null
  }
  if (!isFiniteNumber(o.startedAt) || !isFiniteNumber(o.finishedAt)) {
    return null
  }
  if (
    typeof o.url !== 'string' ||
    typeof o.shortLabel !== 'string' ||
    typeof o.status !== 'string'
  ) {
    return null
  }
  if (!isOutcome(o.outcome)) {
    return null
  }
  const exitCode = o.exitCode
  const ec =
    exitCode === null || exitCode === undefined
      ? null
      : typeof exitCode === 'number' && Number.isFinite(exitCode)
        ? exitCode
        : null
  const hint = o.errorHint
  const errorHint =
    hint === null || hint === undefined
      ? null
      : typeof hint === 'string'
        ? hint.slice(0, 500)
        : null
  return {
    id: o.id.slice(0, 64),
    startedAt: o.startedAt,
    finishedAt: o.finishedAt,
    url: o.url.slice(0, 2048),
    shortLabel: o.shortLabel.slice(0, 300),
    outcome: o.outcome,
    status: o.status.slice(0, 400),
    exitCode: ec,
    errorHint
  }
}

function loadRawEntries(userDataRoot: string): YtdlpDownloadHistoryEntry[] {
  const file = historyFilePath(userDataRoot)
  if (!existsSync(file)) {
    return []
  }
  try {
    const raw = readFileSync(file, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<HistoryFileShape>
    if (parsed.schema !== YTDLP_DOWNLOAD_HISTORY_SCHEMA || !Array.isArray(parsed.entries)) {
      return []
    }
    const out: YtdlpDownloadHistoryEntry[] = []
    for (const e of parsed.entries) {
      const p = parseEntry(e)
      if (p) {
        out.push(p)
      }
    }
    return out
  } catch (err) {
    logError('ytdlp-history', 'read history.json failed', err)
    return []
  }
}

function newEntryId(): string {
  try {
    const c = globalThis.crypto?.randomUUID
    if (typeof c === 'function') {
      return c.call(globalThis.crypto)
    }
  } catch {
    /* fallback */
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * Добавить запись в конец файла и обрезать по `YTDLP_DOWNLOAD_HISTORY_MAX_ENTRIES`
 * (старые записи удаляются с начала массива).
 */
export function appendYtdlpDownloadHistoryEntry(
  userDataRoot: string,
  partial: Omit<YtdlpDownloadHistoryEntry, 'id'> & { id?: string }
): void {
  const file = historyFilePath(userDataRoot)
  try {
    mkdirSync(dirname(file), { recursive: true })
  } catch (err) {
    logError('ytdlp-history', 'mkdir downloads failed', err)
    return
  }

  const entries = loadRawEntries(userDataRoot)
  const entry: YtdlpDownloadHistoryEntry = {
    id: partial.id && partial.id.length > 0 ? partial.id.slice(0, 64) : newEntryId(),
    startedAt: partial.startedAt,
    finishedAt: partial.finishedAt,
    url: partial.url.slice(0, 2048),
    shortLabel: partial.shortLabel.slice(0, 300),
    outcome: partial.outcome,
    status: partial.status.slice(0, 400),
    exitCode: partial.exitCode,
    errorHint: partial.errorHint ? partial.errorHint.slice(0, 500) : null
  }
  entries.push(entry)
  while (entries.length > YTDLP_DOWNLOAD_HISTORY_MAX_ENTRIES) {
    entries.shift()
  }
  const payload: HistoryFileShape = {
    schema: YTDLP_DOWNLOAD_HISTORY_SCHEMA,
    entries
  }
  try {
    writeFileSync(file, JSON.stringify(payload, null, 2), 'utf-8')
  } catch (err) {
    logError('ytdlp-history', 'write history.json failed', err)
  }
}

/** Последние `limit` записей в порядке от новых к старым. */
export function readYtdlpDownloadHistoryNewestFirst(
  userDataRoot: string,
  limit = 100
): YtdlpDownloadHistoryEntry[] {
  const n = Math.min(500, Math.max(1, Math.floor(limit)))
  const all = loadRawEntries(userDataRoot)
  const tail = all.slice(-n)
  return tail.reverse()
}

export function clearYtdlpDownloadHistory(userDataRoot: string): void {
  const file = historyFilePath(userDataRoot)
  try {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(
      file,
      JSON.stringify({ schema: YTDLP_DOWNLOAD_HISTORY_SCHEMA, entries: [] }, null, 2),
      'utf-8'
    )
  } catch (err) {
    logError('ytdlp-history', 'clear history.json failed', err)
  }
}
