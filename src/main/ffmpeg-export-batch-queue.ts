/**
 * §7.3 — in-memory очередь пакетного ffmpeg-экспорта (main).
 */

import { basename, normalize } from 'node:path'

import type {
  FfmpegExportBatchConcurrency,
  FfmpegExportBatchRow,
  FfmpegExportBatchSnapshot,
  FfmpegExportBatchStatus
} from '../shared/ffmpeg-export-batch-contract'
import {
  FFMPEG_EXPORT_BATCH_STATUS_CANCELLED,
  FFMPEG_EXPORT_BATCH_STATUS_DONE,
  FFMPEG_EXPORT_BATCH_STATUS_ERROR,
  FFMPEG_EXPORT_BATCH_STATUS_RUNNING,
  FFMPEG_EXPORT_BATCH_STATUS_WAITING,
  parseFfmpegExportBatchConcurrency
} from '../shared/ffmpeg-export-batch-contract'
import type { PersistedFfmpegExportBatchQueuePayload } from './ffmpeg-export-batch-persist-parse'

let rows: FfmpegExportBatchRow[] = []
let nextId = 1
let concurrency: FfmpegExportBatchConcurrency = 'auto'
let runnerBusy = false
let queueChangeHook: (() => void) | null = null

function notifyQueueChanged(): void {
  queueChangeHook?.()
}

export function setFfmpegExportBatchQueueChangeHook(fn: (() => void) | null): void {
  queueChangeHook = fn
}

export function shortFfmpegExportBatchLabel(inputPath: string): string {
  const base = basename(inputPath)
  return base.length > 52 ? `${base.slice(0, 50)}…` : base
}

function pathKey(inputPath: string): string {
  return normalize(inputPath).toLowerCase()
}

function rowIndexByPath(inputPath: string): number {
  const key = pathKey(inputPath)
  return rows.findIndex((r) => pathKey(r.inputPath) === key)
}

export function getFfmpegExportBatchConcurrency(): FfmpegExportBatchConcurrency {
  return concurrency
}

export function setFfmpegExportBatchConcurrency(raw: unknown): void {
  concurrency = parseFfmpegExportBatchConcurrency(raw)
  notifyQueueChanged()
}

export function isFfmpegExportBatchRunnerBusy(): boolean {
  return runnerBusy
}

export function setFfmpegExportBatchRunnerBusy(value: boolean): void {
  runnerBusy = value
}

export function hydrateFfmpegExportBatchQueueFromPersisted(
  payload: PersistedFfmpegExportBatchQueuePayload
): void {
  rows = payload.rows.map((r) => ({ ...r }))
  nextId = payload.nextId > 0 ? payload.nextId : 1
  concurrency = payload.concurrency
}

export function getFfmpegExportBatchSnapshot(): FfmpegExportBatchSnapshot {
  let completedOk = 0
  let completedError = 0
  let completedCancelled = 0
  for (const row of rows) {
    if (row.status === FFMPEG_EXPORT_BATCH_STATUS_DONE) {
      completedOk += 1
    } else if (row.status === FFMPEG_EXPORT_BATCH_STATUS_ERROR) {
      completedError += 1
    } else if (row.status === FFMPEG_EXPORT_BATCH_STATUS_CANCELLED) {
      completedCancelled += 1
    }
  }
  return {
    rows: rows.map((r) => ({ ...r })),
    running: runnerBusy,
    concurrency,
    completedOk,
    completedError,
    completedCancelled
  }
}

export function clearFfmpegExportBatchQueue(): void {
  const before = rows.length
  rows = rows.filter((r) => r.status === FFMPEG_EXPORT_BATCH_STATUS_RUNNING)
  if (rows.length !== before) {
    notifyQueueChanged()
  }
}

export function removeFfmpegExportBatchRows(ids: number[]): number {
  const drop = new Set(ids)
  const before = rows.length
  rows = rows.filter((r) => !drop.has(r.id) || r.status === FFMPEG_EXPORT_BATCH_STATUS_RUNNING)
  const removed = before - rows.length
  if (removed > 0) {
    notifyQueueChanged()
  }
  return removed
}

export function moveFfmpegExportBatchRow(id: number, direction: 'up' | 'down'): boolean {
  const i = rows.findIndex((r) => r.id === id)
  if (i < 0) {
    return false
  }
  const j = direction === 'up' ? i - 1 : i + 1
  return reorderFfmpegExportBatchRowAt(id, j)
}

/** Переставить строку на индекс `toIndex` (0..length-1); running не двигаем. */
export function reorderFfmpegExportBatchRowAt(id: number, toIndex: number): boolean {
  const i = rows.findIndex((r) => r.id === id)
  if (i < 0) {
    return false
  }
  const j = Math.max(0, Math.min(rows.length - 1, Math.trunc(toIndex)))
  if (i === j) {
    return false
  }
  if (rows[i]?.status === FFMPEG_EXPORT_BATCH_STATUS_RUNNING) {
    return false
  }
  if (rows[j]?.status === FFMPEG_EXPORT_BATCH_STATUS_RUNNING) {
    return false
  }
  const [row] = rows.splice(i, 1)
  if (!row) {
    return false
  }
  rows.splice(j, 0, row)
  notifyQueueChanged()
  return true
}

export function addFfmpegExportBatchPaths(paths: string[]): number {
  let added = 0
  for (const p of paths) {
    const t = p.trim()
    if (t.length === 0) {
      continue
    }
    const abs = normalize(t)
    if (rowIndexByPath(abs) >= 0) {
      continue
    }
    rows.push({
      id: nextId++,
      inputPath: abs,
      shortLabel: shortFfmpegExportBatchLabel(abs),
      status: FFMPEG_EXPORT_BATCH_STATUS_WAITING,
      progress: '—'
    })
    added += 1
  }
  if (added > 0) {
    notifyQueueChanged()
  }
  return added
}

export function takeNextFfmpegExportBatchWaitingRow(): FfmpegExportBatchRow | undefined {
  const row = rows.find((r) => r.status === FFMPEG_EXPORT_BATCH_STATUS_WAITING)
  return row ? { ...row } : undefined
}

export function updateFfmpegExportBatchRow(
  id: number,
  patch: Partial<Pick<FfmpegExportBatchRow, 'status' | 'progress' | 'outputPath' | 'error' | 'shortLabel'>>
): void {
  const row = rows.find((r) => r.id === id)
  if (!row) {
    return
  }
  const prevStatus = row.status
  if (patch.status !== undefined) {
    row.status = patch.status
  }
  if (patch.progress !== undefined) {
    row.progress = patch.progress
  }
  if (patch.outputPath !== undefined) {
    row.outputPath = patch.outputPath
  }
  if (patch.error !== undefined) {
    row.error = patch.error
  }
  if (patch.shortLabel !== undefined) {
    row.shortLabel = patch.shortLabel
  }
  if (patch.status !== undefined && patch.status !== prevStatus) {
    notifyQueueChanged()
  }
}

export function markWaitingFfmpegExportBatchRowsCancelled(): void {
  let changed = false
  for (const row of rows) {
    if (row.status === FFMPEG_EXPORT_BATCH_STATUS_WAITING) {
      row.status = FFMPEG_EXPORT_BATCH_STATUS_CANCELLED
      row.progress = '—'
      changed = true
    }
  }
  if (changed) {
    notifyQueueChanged()
  }
}

export function isFfmpegExportBatchTerminalStatus(status: FfmpegExportBatchStatus): boolean {
  return (
    status === FFMPEG_EXPORT_BATCH_STATUS_DONE ||
    status === FFMPEG_EXPORT_BATCH_STATUS_ERROR ||
    status === FFMPEG_EXPORT_BATCH_STATUS_CANCELLED
  )
}
