/**
 * §7.3 — пакетный экспорт ffmpeg: типы очереди и снимка для main/renderer (без Node).
 */

export const FFMPEG_EXPORT_BATCH_STATUS_WAITING = 'waiting' as const
export const FFMPEG_EXPORT_BATCH_STATUS_RUNNING = 'running' as const
export const FFMPEG_EXPORT_BATCH_STATUS_DONE = 'done' as const
export const FFMPEG_EXPORT_BATCH_STATUS_ERROR = 'error' as const
export const FFMPEG_EXPORT_BATCH_STATUS_CANCELLED = 'cancelled' as const

export type FfmpegExportBatchStatus =
  | typeof FFMPEG_EXPORT_BATCH_STATUS_WAITING
  | typeof FFMPEG_EXPORT_BATCH_STATUS_RUNNING
  | typeof FFMPEG_EXPORT_BATCH_STATUS_DONE
  | typeof FFMPEG_EXPORT_BATCH_STATUS_ERROR
  | typeof FFMPEG_EXPORT_BATCH_STATUS_CANCELLED

export type FfmpegExportBatchConcurrency = 1 | 2 | 4 | 'auto'

export interface FfmpegExportBatchRow {
  id: number
  inputPath: string
  shortLabel: string
  status: FfmpegExportBatchStatus
  /** Подпись прогресса для таблицы (`42%`, `—`, текст ошибки). */
  progress: string
  outputPath?: string
  error?: string
}

export interface FfmpegExportBatchSnapshot {
  rows: FfmpegExportBatchRow[]
  running: boolean
  concurrency: FfmpegExportBatchConcurrency
  completedOk: number
  completedError: number
  completedCancelled: number
}

export type FfmpegExportBatchAddPathsResult =
  | { ok: true; added: number }
  | { ok: false; error: string }

export type FfmpegExportBatchPickFilesResult =
  | { ok: true; added: number }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }

export type FfmpegExportBatchStartResult =
  | { ok: true }
  | { ok: false; error: string }

export function parseFfmpegExportBatchConcurrency(raw: unknown): FfmpegExportBatchConcurrency {
  if (raw === 1 || raw === 2 || raw === 4) {
    return raw
  }
  return 'auto'
}

export function resolveFfmpegExportBatchConcurrencyLimit(
  value: FfmpegExportBatchConcurrency,
  cpuCount: number
): number {
  if (value === 'auto') {
    const n = Number.isFinite(cpuCount) && cpuCount > 0 ? cpuCount : 4
    return Math.min(4, Math.max(1, n - 1))
  }
  return value
}
