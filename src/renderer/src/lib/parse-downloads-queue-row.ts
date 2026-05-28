/** Снимок строки очереди yt-dlp (main `DownloadsQueueRow` → renderer). */

export type DownloadsQueueRowView = {
  id: number
  url: string
  shortLabel: string
  progress: string
  status: string
  queueFmt?: string
  queueSize?: string
  queueSpeed?: string
  queueEta?: string
}

export function parseDownloadsQueueRow(raw: unknown): DownloadsQueueRowView | null {
  if (typeof raw !== 'object' || raw == null) {
    return null
  }
  const row = raw as Record<string, unknown>
  if (typeof row['id'] !== 'number' || typeof row['url'] !== 'string') {
    return null
  }
  const view: DownloadsQueueRowView = {
    id: row['id'],
    url: row['url'],
    shortLabel: typeof row['shortLabel'] === 'string' ? row['shortLabel'] : row['url'],
    progress: typeof row['progress'] === 'string' ? row['progress'] : '—',
    status: typeof row['status'] === 'string' ? row['status'] : ''
  }
  if (typeof row['queueFmt'] === 'string') {
    view.queueFmt = row['queueFmt']
  }
  if (typeof row['queueSize'] === 'string') {
    view.queueSize = row['queueSize']
  }
  if (typeof row['queueSpeed'] === 'string') {
    view.queueSpeed = row['queueSpeed']
  }
  if (typeof row['queueEta'] === 'string') {
    view.queueEta = row['queueEta']
  }
  return view
}

export function parseDownloadsQueueSnapshot(raw: unknown): DownloadsQueueRowView[] {
  if (!Array.isArray(raw)) {
    return []
  }
  const rows: DownloadsQueueRowView[] = []
  for (const item of raw) {
    const parsed = parseDownloadsQueueRow(item)
    if (parsed != null) {
      rows.push(parsed)
    }
  }
  return rows
}

export function isDownloadsRowComplete(status: string): boolean {
  const lower = status.toLowerCase()
  return (
    lower.includes('готов') ||
    lower.includes('done') ||
    lower.includes('complete') ||
    lower.includes('finished')
  )
}

export function isDownloadsRowError(status: string): boolean {
  const lower = status.toLowerCase()
  return lower.includes('ошиб') || lower.includes('error') || lower.includes('fail')
}

export function parseDownloadsProgressPercent(progress: string): number {
  const match = /(\d+)\s*%/.exec(progress)
  if (match == null) {
    return 0
  }
  const value = Number(match[1])
  if (!Number.isFinite(value)) {
    return 0
  }
  return Math.min(100, Math.max(0, value))
}
