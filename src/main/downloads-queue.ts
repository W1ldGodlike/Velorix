/**
 * Простое состояние очереди URL для окна менеджера загрузок §6 — пока только UI,
 * без запуска yt-dlp и без сохранения в session.json (добавим поверх этого же API).
 */

export interface DownloadsQueueRow {
  id: number
  url: string
  /** Краткая метка статуса; позже синхронизируем с реальным прогрессом yt-dlp. */
  status: string
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

export function clearDownloadsQueue(): void {
  rows = []
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
  ;[rows[ix], rows[j]] = [rows[j], rows[ix]]
  return true
}

/**
 * Из многострочного текста (поле или буфер) добавляет каждую похожую на URL строку в очередь.
 * Дубликаты URL не фильтруем — пользователь может чистить вручную.
 */
export function appendUrlsFromMultilineBlock(raw: string): number {
  const lines = raw.split(/\r?\n/)
  let n = 0
  for (const line of lines) {
    const url = normalizeUrlLine(line)
    if (url) {
      rows.push({ id: nextId++, url, status: 'Ожидание' })
      n += 1
    }
  }
  return n
}
