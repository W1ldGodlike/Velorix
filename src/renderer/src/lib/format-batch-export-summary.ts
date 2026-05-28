import {
  FFMPEG_EXPORT_BATCH_STATUS_WAITING,
  type FfmpegExportBatchSnapshot
} from '../../../shared/ffmpeg-export-batch-contract'

/** Одна строка статуса пакетной очереди для peek/ref.1. */
export function formatBatchExportSummary(snapshot: FfmpegExportBatchSnapshot): string {
  const total = snapshot.rows.length
  if (total === 0) {
    return 'Пакетная очередь пуста'
  }
  const done = snapshot.completedOk + snapshot.completedError + snapshot.completedCancelled
  if (snapshot.running) {
    return `Пакетный экспорт: ${String(done)}/${String(total)} · выполняется`
  }
  const waiting = total - done
  return `Пакет: ${String(total)} · готово ${String(snapshot.completedOk)} · ошибки ${String(snapshot.completedError)} · ждут ${String(waiting)}`
}

/** Можно вызвать `batchExport.start` (есть waiting и нет running). */
export function batchExportCanStart(snapshot: FfmpegExportBatchSnapshot): boolean {
  if (snapshot.running || snapshot.rows.length === 0) {
    return false
  }
  return snapshot.rows.some((row) => row.status === FFMPEG_EXPORT_BATCH_STATUS_WAITING)
}

export function batchExportCanCancel(snapshot: FfmpegExportBatchSnapshot): boolean {
  return snapshot.running
}

export function batchExportHasCompleted(snapshot: FfmpegExportBatchSnapshot): boolean {
  return snapshot.completedOk + snapshot.completedError + snapshot.completedCancelled > 0
}

export function batchExportCanRetryFailed(snapshot: FfmpegExportBatchSnapshot): boolean {
  return !snapshot.running && snapshot.completedError > 0
}
