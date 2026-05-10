/**
 * §4.1 / §6 — разбор JSON `queue.json` без Electron/fs (Vitest-безопасно).
 */

import type { DownloadsQueueRow } from './downloads-queue'
import { lineLooksLikeUrl } from './downloads-queue'

/** Схема файла `userData/downloads/queue.json`. */
export const YTDLP_DOWNLOAD_QUEUE_PERSIST_SCHEMA = 1
const YTDLP_DOWNLOAD_QUEUE_MAX_ROWS = 300

function clampStr(raw: unknown, max: number): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim().slice(0, max)
  return t.length > 0 ? t : undefined
}

function sanitizeStatusForRestore(raw: unknown): string {
  const t = typeof raw === 'string' ? raw.trim().slice(0, 240) : ''
  if (t === 'Загрузка…' || t.startsWith('Пауза перед повтором')) {
    return 'Ожидание'
  }
  if (
    t === 'Ожидание' ||
    t === 'Готово' ||
    t === 'Отменено' ||
    (t.length > 0 && t.startsWith('Ошибка'))
  ) {
    return t
  }
  return 'Ожидание'
}

function shortUrlLabelFallback(url: string): string {
  return url.length > 80 ? `${url.slice(0, 78)}…` : url
}

/** Разбор одной строки из JSON; лишнее отбрасываем. */
export function parsePersistedDownloadsQueueRow(raw: unknown): DownloadsQueueRow | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const o = raw as Record<string, unknown>
  if (typeof o['id'] !== 'number' || !Number.isFinite(o['id']) || o['id'] < 1 || o['id'] > 1e9) {
    return null
  }
  const url = clampStr(o['url'], 4000)
  if (!url || !lineLooksLikeUrl(url)) {
    return null
  }
  const shortLabel = clampStr(o['shortLabel'], 400) ?? shortUrlLabelFallback(url)
  const progress = clampStr(o['progress'], 600) ?? '—'
  const status = sanitizeStatusForRestore(o['status'])
  const row: DownloadsQueueRow = {
    id: Math.floor(o['id']),
    url,
    shortLabel,
    progress,
    status
  }
  const op = clampStr(o['outputPath'], 4096)
  if (op) {
    row.outputPath = op
  }
  const qf = clampStr(o['queueFmt'], 120)
  if (qf) {
    row.queueFmt = qf
  }
  const qs = clampStr(o['queueSize'], 64)
  if (qs) {
    row.queueSize = qs
  }
  const qsp = clampStr(o['queueSpeed'], 200)
  if (qsp) {
    row.queueSpeed = qsp
  }
  const qe = clampStr(o['queueEta'], 64)
  if (qe) {
    row.queueEta = qe
  }
  return row
}

/** Разбор тела файла. */
export function sanitizePersistedQueuePayload(raw: unknown): DownloadsQueueRow[] {
  if (!raw || typeof raw !== 'object') {
    return []
  }
  const o = raw as Record<string, unknown>
  if (o['schema'] !== YTDLP_DOWNLOAD_QUEUE_PERSIST_SCHEMA) {
    return []
  }
  const arr = o['rows']
  if (!Array.isArray(arr)) {
    return []
  }
  const out: DownloadsQueueRow[] = []
  for (const item of arr) {
    const row = parsePersistedDownloadsQueueRow(item)
    if (row) {
      out.push(row)
    }
    if (out.length >= YTDLP_DOWNLOAD_QUEUE_MAX_ROWS) {
      break
    }
  }
  return out
}
