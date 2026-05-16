/**
 * §7.3/§7.4 — отбор путей для пакетного ffmpeg-экспорта из очереди загрузок и истории.
 */

import { isFfmpegExportBatchVideoPath } from './ffmpeg-export-batch-video-ext'
import { isYtdlpQueueStatusDone } from './ytdlp-queue-status'

export interface DownloadsQueueRowForBatchCollect {
  id: number
  status: string
  outputPath?: string
}

export function collectDownloadsQueueVideoPaths(
  rows: DownloadsQueueRowForBatchCollect[],
  options?: { ids?: number[]; doneOnly?: boolean }
): string[] {
  const idSet = options?.ids !== undefined && options.ids.length > 0 ? new Set(options.ids) : null
  const doneOnly = options?.doneOnly !== false
  const out: string[] = []
  const seen = new Set<string>()
  for (const row of rows) {
    if (idSet !== null && !idSet.has(row.id)) {
      continue
    }
    if (doneOnly && !isYtdlpQueueStatusDone(row.status)) {
      continue
    }
    const raw = row.outputPath
    if (typeof raw !== 'string' || raw.trim().length === 0) {
      continue
    }
    const p = raw.trim()
    if (!isFfmpegExportBatchVideoPath(p)) {
      continue
    }
    const key = p.toLowerCase()
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    out.push(p)
  }
  return out
}

export function collectUniqueVideoPaths(paths: string[]): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const raw of paths) {
    if (typeof raw !== 'string' || raw.trim().length === 0) {
      continue
    }
    const p = raw.trim()
    if (!isFfmpegExportBatchVideoPath(p)) {
      continue
    }
    const key = p.toLowerCase()
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    out.push(p)
  }
  return out
}
