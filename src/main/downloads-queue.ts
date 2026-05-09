/**
 * Простое состояние очереди URL для окна менеджера загрузок §6 — пока только UI,
 * без запуска yt-dlp и без сохранения в session.json (добавим поверх этого же API).
 */

export interface DownloadsQueueRow {
  id: number
  url: string
  /** Короткая подпись для таблицы (хост + путь). */
  shortLabel: string
  /** Прогресс yt-dlp: процент / скорость / ETA из stderr §6.1 или «—». */
  progress: string
  /** Человекочитаемый статус строки очереди. */
  status: string
  /** Best-effort путь фактически созданного файла yt-dlp, если удалось распознать stdout/stderr. */
  outputPath?: string
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

export function clearDownloadsQueue(): void {
  rows = []
}

export function clearFinishedDownloadsQueueRows(): number {
  const before = rows.length
  rows = rows.filter(
    (r) =>
      r.status === 'Ожидание' ||
      r.status === 'Загрузка…' ||
      r.status.startsWith('Пауза перед повтором')
  )
  return before - rows.length
}

export function findFirstWaitingRow(): DownloadsQueueRow | undefined {
  return rows.find((r) => r.status === 'Ожидание')
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
  }
): boolean {
  const row = rows.find((r) => r.id === id)
  if (!row) {
    return false
  }
  const { outputPath, ...rest } = patch
  Object.assign(row, rest)
  if (outputPath === null) {
    delete row.outputPath
  } else if (typeof outputPath === 'string' && outputPath.trim().length > 0) {
    row.outputPath = outputPath.trim()
  }
  return true
}

export function resetDownloadsQueueRowForRetry(id: number): boolean {
  const row = rows.find((r) => r.id === id)
  if (!row) {
    return false
  }
  row.shortLabel = shortUrlLabel(row.url)
  row.progress = '—'
  row.status = 'Ожидание'
  delete row.outputPath
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
      rows.push({
        id: nextId++,
        url,
        shortLabel: shortUrlLabel(url),
        progress: '—',
        status: 'Ожидание'
      })
      n += 1
    }
  }
  return n
}
