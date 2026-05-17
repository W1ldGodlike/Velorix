/**
 * Состояние очереди URL для окна менеджера загрузок §6.
 * Живая очередь дополнительно пишется в `app-data/downloads/queue.json` (см. `ytdlp-download-queue-persist.ts`).
 */

import {
  isYtdlpQueueStatusRunningLike,
  isYtdlpQueueStatusWaiting,
  YTDLP_QUEUE_STATUS_WAITING
} from '../shared/ytdlp-queue-status'

export interface DownloadsQueueRow {
  id: number
  url: string
  /** Короткая подпись для таблицы (хост + путь). */
  shortLabel: string
  /** Прогресс yt-dlp: процент / скорость / оставшееся время из stderr §6.1 или «—». */
  progress: string
  /** Человекочитаемый статус строки очереди. */
  status: string
  /** Best-effort путь фактически созданного файла yt-dlp, если удалось распознать stdout/stderr. */
  outputPath?: string
  /** §6/v0 — строка формата из `[info] … format(s): …`; best-effort. */
  queueFmt?: string
  /** §6/v0 — размер из «% of 12.34MiB». */
  queueSize?: string
  /** §6/v0 — скорость или вспомогательная строка фрагмента/плейлиста. */
  queueSpeed?: string
  /** §6/v0 — оставшееся время из строки yt-dlp (колонка «Осталось»). */
  queueEta?: string
}

let rows: DownloadsQueueRow[] = []
let nextId = 1

/** Строка похожа на URL, допускаемые в очереди (http(s) или www…). */
export function lineLooksLikeUrl(line: string): boolean {
  const t = line.trim()
  if (t.length < 8) {
    return false
  }
  if (/^https?:\/\//i.test(t)) {
    return true
  }
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(t) && /\//.test(t)) {
    return true
  }
  return /^www\./i.test(t)
}

export function shortUrlLabel(url: string): string {
  try {
    const u = new URL(url)
    const path = u.pathname === '/' ? '' : u.pathname
    const tail = path.length > 28 ? `${path.slice(0, 26)}…` : path
    return `${u.hostname}${tail}`
  } catch {
    return url.length > 42 ? `${url.slice(0, 40)}…` : url
  }
}

function normalizeUrlLine(line: string): string | null {
  const t = line.trim()
  if (!lineLooksLikeUrl(t)) {
    return null
  }
  if (/^https?:\/\//i.test(t)) {
    return t
  }
  return `https://${t.replace(/^\/+/, '')}`
}

export function getDownloadsQueueSnapshot(): DownloadsQueueRow[] {
  return rows.map((r) => ({ ...r }))
}

/** Полная замена очереди (гидратация из `queue.json`). Пересчитывает `nextId`. */
export function replaceDownloadsQueueState(nextRows: DownloadsQueueRow[]): void {
  rows.length = 0
  let maxId = 0
  for (const e of nextRows) {
    rows.push({ ...e })
    if (e.id > maxId) {
      maxId = e.id
    }
  }
  nextId = maxId > 0 ? maxId + 1 : 1
}

export function clearDownloadsQueue(): void {
  rows = []
}

export function clearFinishedDownloadsQueueRows(): number {
  const before = rows.length
  rows = rows.filter(
    (r) => isYtdlpQueueStatusWaiting(r.status) || isYtdlpQueueStatusRunningLike(r.status)
  )
  return before - rows.length
}

export function findFirstWaitingRow(): DownloadsQueueRow | undefined {
  return rows.find((r) => isYtdlpQueueStatusWaiting(r.status))
}

/** Копия строки по id для main-сервисов (очередь мутируется только через этот модуль). */
export function getDownloadsQueueRowById(id: number): DownloadsQueueRow | undefined {
  const row = rows.find((r) => r.id === id)
  return row ? { ...row } : undefined
}

export function updateDownloadsRow(
  id: number,
  patch: Partial<Pick<DownloadsQueueRow, 'status' | 'progress' | 'shortLabel'>> & {
    outputPath?: string | null
    queueFmt?: string | null
    queueSize?: string | null
    queueSpeed?: string | null
    queueEta?: string | null
  }
): boolean {
  const row = rows.find((r) => r.id === id)
  if (!row) {
    return false
  }
  const { outputPath, queueFmt, queueSize, queueSpeed, queueEta, ...rest } = patch
  Object.assign(row, rest)
  if (outputPath === null) {
    delete row.outputPath
  } else if (typeof outputPath === 'string' && outputPath.trim().length > 0) {
    row.outputPath = outputPath.trim()
  }
  type MetaKey = 'queueFmt' | 'queueSize' | 'queueSpeed' | 'queueEta'
  const applyMeta = (key: MetaKey, v: string | null | undefined): void => {
    if (v === undefined) {
      return
    }
    if (v === null) {
      delete row[key]
      return
    }
    const t = v.trim()
    if (t.length > 0) {
      row[key] = t
    }
  }
  applyMeta('queueFmt', queueFmt)
  applyMeta('queueSize', queueSize)
  applyMeta('queueSpeed', queueSpeed)
  applyMeta('queueEta', queueEta)
  return true
}

export function resetDownloadsQueueRowForRetry(id: number): boolean {
  const row = rows.find((r) => r.id === id)
  if (!row) {
    return false
  }
  row.shortLabel = shortUrlLabel(row.url)
  row.progress = '—'
  row.status = YTDLP_QUEUE_STATUS_WAITING
  delete row.outputPath
  delete row.queueFmt
  delete row.queueSize
  delete row.queueSpeed
  delete row.queueEta
  return true
}

export function removeDownloadsQueueRow(id: number): boolean {
  const ix = rows.findIndex((r) => r.id === id)
  if (ix < 0) {
    return false
  }
  rows.splice(ix, 1)
  return true
}

export function moveDownloadsQueueRow(id: number, delta: -1 | 1): boolean {
  const ix = rows.findIndex((r) => r.id === id)
  if (ix < 0) {
    return false
  }
  const j = ix + delta
  if (j < 0 || j >= rows.length) {
    return false
  }
  const rowA = rows[ix]
  const rowB = rows[j]
  if (!rowA || !rowB) {
    return false
  }
  rows[ix] = rowB
  rows[j] = rowA
  return true
}

/**
 * Из многострочного текста добавляет каждую похожую на URL строку в очередь.
 * Дубликаты URL не фильтруем — пользователь может чистить вручную.
 */
function enqueueOneWaitingUrl(url: string): number {
  const id = nextId++
  rows.push({
    id,
    url,
    shortLabel: shortUrlLabel(url),
    progress: '—',
    status: YTDLP_QUEUE_STATUS_WAITING
  })
  return id
}

/** Первая распознанная строка URL из многострочного текста (та же логика, что у очереди §6). */
export function extractFirstQueueUrlLine(raw: string): string | null {
  for (const line of raw.split(/\r?\n/)) {
    const url = normalizeUrlLine(line)
    if (url) {
      return url
    }
  }
  return null
}

/**
 * Добавляет в очередь одну строку «Ожидание» для первого URL из текста.
 * Возвращает `{ id, url }` или `null`, если URL не распознан.
 */
export function enqueueFirstWaitingUrlFromBlock(raw: string): { id: number; url: string } | null {
  const url = extractFirstQueueUrlLine(raw)
  if (!url) {
    return null
  }
  return { id: enqueueOneWaitingUrl(url), url }
}

export function appendUrlsFromMultilineBlock(raw: string): number {
  let n = 0
  for (const line of raw.split(/\r?\n/)) {
    const url = normalizeUrlLine(line)
    if (url) {
      enqueueOneWaitingUrl(url)
      n += 1
    }
  }
  return n
}
