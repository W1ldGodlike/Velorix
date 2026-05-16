import type { DownloadsLogLineView } from './components/downloads/DownloadsLogPanel'
import { uiText } from './locales/ui-text'
import {
  isYtdlpQueueStatusCancelled,
  isYtdlpQueueStatusDone,
  isYtdlpQueueStatusErrorLike,
  isYtdlpQueueStatusRunningLike
} from '../../shared/ytdlp-queue-status'

export type DownloadsQueueRowView = {
  id: number
  url: string
  shortLabel: string
  progress: string
  status: string
  outputPath?: string
  queueFmt?: string
  queueSize?: string
  queueSpeed?: string
  queueEta?: string
  isActiveRunner?: boolean
  ytdlpPauseSupported?: boolean
  ytdlpPauseChildActive?: boolean
  ytdlpPaused?: boolean
}

export type DownloadsStatusFilter = 'all' | 'running' | 'done' | 'error' | 'cancelled'

export type DownloadsQueueStats = {
  total: number
  running: number
  done: number
  error: number
  cancelled: number
  pending: number
}

/** §6 — id заголовков таблицы очереди yt-dlp (`headers` на `<td>`). */
export const DOWNLOADS_QUEUE_TABLE_HEADER_IDS = {
  num: 'flux-dlq-col-num',
  titleUrl: 'flux-dlq-col-title-url',
  format: 'flux-dlq-col-format',
  size: 'flux-dlq-col-size',
  progress: 'flux-dlq-col-progress',
  speed: 'flux-dlq-col-speed',
  eta: 'flux-dlq-col-eta',
  status: 'flux-dlq-col-status',
  actions: 'flux-dlq-col-actions'
} as const

export function sanitizeDownloadsRows(raw: unknown[]): DownloadsQueueRowView[] {
  return raw.flatMap((item): DownloadsQueueRowView[] => {
    if (!item || typeof item !== 'object') {
      return []
    }
    const o = item as Record<string, unknown>
    if (typeof o['id'] !== 'number' || typeof o['url'] !== 'string') {
      return []
    }
    return [
      {
        id: o['id'],
        url: o['url'],
        shortLabel: typeof o['shortLabel'] === 'string' ? o['shortLabel'] : o['url'],
        progress: typeof o['progress'] === 'string' ? o['progress'] : uiText('uiPlaceholderDash'),
        status: typeof o['status'] === 'string' ? o['status'] : uiText('uiPlaceholderDash'),
        ...(typeof o['outputPath'] === 'string' ? { outputPath: o['outputPath'] } : {}),
        ...(typeof o['queueFmt'] === 'string' ? { queueFmt: o['queueFmt'] } : {}),
        ...(typeof o['queueSize'] === 'string' ? { queueSize: o['queueSize'] } : {}),
        ...(typeof o['queueSpeed'] === 'string' ? { queueSpeed: o['queueSpeed'] } : {}),
        ...(typeof o['queueEta'] === 'string' ? { queueEta: o['queueEta'] } : {}),
        ...(typeof o['isActiveRunner'] === 'boolean'
          ? { isActiveRunner: o['isActiveRunner'] }
          : {}),
        ...(typeof o['ytdlpPauseSupported'] === 'boolean'
          ? { ytdlpPauseSupported: o['ytdlpPauseSupported'] }
          : {}),
        ...(typeof o['ytdlpPauseChildActive'] === 'boolean'
          ? { ytdlpPauseChildActive: o['ytdlpPauseChildActive'] }
          : {}),
        ...(typeof o['ytdlpPaused'] === 'boolean' ? { ytdlpPaused: o['ytdlpPaused'] } : {})
      }
    ]
  })
}

export function downloadsRowMatchesStatus(
  row: DownloadsQueueRowView,
  filter: DownloadsStatusFilter
): boolean {
  if (filter === 'all') {
    return true
  }
  if (filter === 'running') {
    return isYtdlpQueueStatusRunningLike(row.status)
  }
  if (filter === 'done') {
    return isYtdlpQueueStatusDone(row.status)
  }
  if (filter === 'error') {
    return isYtdlpQueueStatusErrorLike(row.status)
  }
  return isYtdlpQueueStatusCancelled(row.status)
}

export function summarizeDownloadsRows(rows: DownloadsQueueRowView[]): DownloadsQueueStats {
  return rows.reduce<DownloadsQueueStats>(
    (acc, row) => {
      acc.total += 1
      if (downloadsRowMatchesStatus(row, 'running')) {
        acc.running += 1
      } else if (downloadsRowMatchesStatus(row, 'done')) {
        acc.done += 1
      } else if (downloadsRowMatchesStatus(row, 'error')) {
        acc.error += 1
      } else if (downloadsRowMatchesStatus(row, 'cancelled')) {
        acc.cancelled += 1
      } else {
        acc.pending += 1
      }
      return acc
    },
    { total: 0, running: 0, done: 0, error: 0, cancelled: 0, pending: 0 }
  )
}

export function parseDownloadsProgressPercent(raw: string): number | null {
  const match = raw.match(/(\d+(?:[.,]\d+)?)\s*%/)
  if (!match?.[1]) {
    return null
  }
  const n = Number(match[1].replace(',', '.'))
  if (!Number.isFinite(n)) {
    return null
  }
  return Math.max(0, Math.min(100, n))
}

export function downloadsStatusTone(row: DownloadsQueueRowView): string {
  if (downloadsRowMatchesStatus(row, 'running')) {
    return 'running'
  }
  if (downloadsRowMatchesStatus(row, 'done')) {
    return 'done'
  }
  if (downloadsRowMatchesStatus(row, 'error')) {
    return 'error'
  }
  if (downloadsRowMatchesStatus(row, 'cancelled')) {
    return 'cancelled'
  }
  return 'pending'
}

export function formatDownloadsLogText(lines: DownloadsLogLineView[]): string {
  return lines.map((line) => `[${line.rowId}] ${line.stream}: ${line.text}`).join('\n')
}
