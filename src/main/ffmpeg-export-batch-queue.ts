/**
 * §7.3 — in-memory очередь пакетного ffmpeg-экспорта (main).
 */

import { basename } from 'node:path'

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

let rows: FfmpegExportBatchRow[] = []
let nextId = 1
let concurrency: FfmpegExportBatchConcurrency = 'auto'
let runnerBusy = false

export function shortFfmpegExportBatchLabel(inputPath: string): string {
  const base = basename(inputPath)
  return base.length > 52 ? `${base.slice(0, 50)}…` : base
}

export function getFfmpegExportBatchConcurrency(): FfmpegExportBatchConcurrency {
  return concurrency
}

export function setFfmpegExportBatchConcurrency(raw: unknown): void {
  concurrency = parseFfmpegExportBatchConcurrency(raw)
}

export function isFfmpegExportBatchRunnerBusy(): boolean {
  return runnerBusy
}

export function setFfmpegExportBatchRunnerBusy(value: boolean): void {
  runnerBusy = value
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
  rows = rows.filter((r) => r.status === FFMPEG_EXPORT_BATCH_STATUS_RUNNING)
}

export function removeFfmpegExportBatchRows(ids: number[]): number {
  const drop = new Set(ids)
  const before = rows.length
  rows = rows.filter((r) => !drop.has(r.id) || r.status === FFMPEG_EXPORT_BATCH_STATUS_RUNNING)
  return before - rows.length
}

export function moveFfmpegExportBatchRow(id: number, direction: 'up' | 'down'): boolean {
  const i = rows.findIndex((r) => r.id === id)
  if (i < 0) {
    return false
  }
  const j = direction === 'up' ? i - 1 : i + 1
  if (j < 0 || j >= rows.length) {
    return false
  }
  if (rows[i]?.status === FFMPEG_EXPORT_BATCH_STATUS_RUNNING) {
    return false
  }
  if (rows[j]?.status === FFMPEG_EXPORT_BATCH_STATUS_RUNNING) {
    return false
  }
  const tmp = rows[i]!
  rows[i] = rows[j]!
  rows[j] = tmp
  return true
}

export function addFfmpegExportBatchPaths(paths: string[]): number {
  let added = 0
  for (const p of paths) {
    const t = p.trim()
    if (t.length === 0) {
      continue
    }
    rows.push({
      id: nextId++,
      inputPath: t,
      shortLabel: shortFfmpegExportBatchLabel(t),
      status: FFMPEG_EXPORT_BATCH_STATUS_WAITING,
      progress: '—'
    })
    added += 1
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
}

export function markWaitingFfmpegExportBatchRowsCancelled(): void {
  for (const row of rows) {
    if (row.status === FFMPEG_EXPORT_BATCH_STATUS_WAITING) {
      row.status = FFMPEG_EXPORT_BATCH_STATUS_CANCELLED
      row.progress = '—'
    }
  }
}

export function isFfmpegExportBatchTerminalStatus(status: FfmpegExportBatchStatus): boolean {
  return (
    status === FFMPEG_EXPORT_BATCH_STATUS_DONE ||
    status === FFMPEG_EXPORT_BATCH_STATUS_ERROR ||
    status === FFMPEG_EXPORT_BATCH_STATUS_CANCELLED
  )
}
