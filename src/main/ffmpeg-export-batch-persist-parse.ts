/**
 * §7.3 — разбор JSON `app-data/ffmpeg-export-batch/queue.json` (Vitest-безопасно).
 */

import type { FfmpegExportBatchRow } from '../shared/ffmpeg-export-batch-contract'
import {
  FFMPEG_EXPORT_BATCH_STATUS_CANCELLED,
  FFMPEG_EXPORT_BATCH_STATUS_DONE,
  FFMPEG_EXPORT_BATCH_STATUS_ERROR,
  FFMPEG_EXPORT_BATCH_STATUS_RUNNING,
  FFMPEG_EXPORT_BATCH_STATUS_WAITING,
  parseFfmpegExportBatchConcurrency,
  type FfmpegExportBatchConcurrency
} from '../shared/ffmpeg-export-batch-contract'
import { isFfmpegExportBatchVideoPath } from '../shared/ffmpeg-export-batch-video-ext'

export const FFMPEG_EXPORT_BATCH_QUEUE_PERSIST_SCHEMA = 1
const FFMPEG_EXPORT_BATCH_QUEUE_MAX_ROWS = 500

function clampStr(raw: unknown, max: number): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim().slice(0, max)
  return t.length > 0 ? t : undefined
}

function sanitizeBatchStatusForRestore(raw: unknown): FfmpegExportBatchRow['status'] {
  const t = typeof raw === 'string' ? raw.trim() : ''
  if (t === FFMPEG_EXPORT_BATCH_STATUS_RUNNING) {
    return FFMPEG_EXPORT_BATCH_STATUS_WAITING
  }
  if (
    t === FFMPEG_EXPORT_BATCH_STATUS_WAITING ||
    t === FFMPEG_EXPORT_BATCH_STATUS_DONE ||
    t === FFMPEG_EXPORT_BATCH_STATUS_ERROR ||
    t === FFMPEG_EXPORT_BATCH_STATUS_CANCELLED
  ) {
    return t
  }
  return FFMPEG_EXPORT_BATCH_STATUS_WAITING
}

export function parsePersistedFfmpegExportBatchRow(raw: unknown): FfmpegExportBatchRow | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const o = raw as Record<string, unknown>
  if (typeof o['id'] !== 'number' || !Number.isFinite(o['id']) || o['id'] < 1 || o['id'] > 1e9) {
    return null
  }
  const inputPath = clampStr(o['inputPath'], 4000)
  if (!inputPath || !isFfmpegExportBatchVideoPath(inputPath)) {
    return null
  }
  const shortLabel = clampStr(o['shortLabel'], 400) ?? inputPath.split(/[\\/]/).pop() ?? inputPath
  const progress = clampStr(o['progress'], 400) ?? '—'
  const status = sanitizeBatchStatusForRestore(o['status'])
  const row: FfmpegExportBatchRow = {
    id: Math.trunc(o['id']),
    inputPath,
    shortLabel,
    status,
    progress
  }
  const outputPath = clampStr(o['outputPath'], 4000)
  if (outputPath) {
    row.outputPath = outputPath
  }
  const error = clampStr(o['error'], 2000)
  if (error) {
    row.error = error
  }
  return row
}

export interface PersistedFfmpegExportBatchQueuePayload {
  schema: number
  concurrency: FfmpegExportBatchConcurrency
  nextId: number
  rows: FfmpegExportBatchRow[]
}

export function sanitizePersistedFfmpegExportBatchPayload(
  raw: unknown
): PersistedFfmpegExportBatchQueuePayload | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const o = raw as Record<string, unknown>
  if (o['schema'] !== FFMPEG_EXPORT_BATCH_QUEUE_PERSIST_SCHEMA) {
    return null
  }
  const rowsRaw = o['rows']
  if (!Array.isArray(rowsRaw)) {
    return null
  }
  const rows: FfmpegExportBatchRow[] = []
  for (const item of rowsRaw) {
    if (rows.length >= FFMPEG_EXPORT_BATCH_QUEUE_MAX_ROWS) {
      break
    }
    const row = parsePersistedFfmpegExportBatchRow(item)
    if (row) {
      rows.push(row)
    }
  }
  let nextId =
    typeof o['nextId'] === 'number' && Number.isFinite(o['nextId']) ? Math.trunc(o['nextId']) : 1
  for (const r of rows) {
    if (r.id >= nextId) {
      nextId = r.id + 1
    }
  }
  return {
    schema: FFMPEG_EXPORT_BATCH_QUEUE_PERSIST_SCHEMA,
    concurrency: parseFfmpegExportBatchConcurrency(o['concurrency']),
    nextId: Math.max(1, nextId),
    rows
  }
}
