import type { FfmpegExportBatchRow } from './ffmpeg-export-batch-contract'

/** Стабильный id для `aria-describedby` между колонками статуса и прогресса. */
export function ffmpegExportBatchRowErrorDescribedById(rowId: number): string {
  return `batch-export-row-${rowId}-error`
}

/** Полный текст ошибки строки для title, aria и колонки «ошибка» в отчёте. */
export function resolveFfmpegExportBatchRowErrorDetail(row: FfmpegExportBatchRow): string | null {
  if (row.status !== 'error' && row.status !== 'cancelled') {
    return null
  }
  const err = typeof row.error === 'string' ? row.error.trim() : ''
  if (err.length > 0) {
    return err
  }
  if (row.status === 'error') {
    const prog = row.progress.trim()
    if (prog.length > 0 && prog !== '—') {
      return prog
    }
  }
  return null
}

/** Подпись колонки «Прогресс» в UI и отчёте (для error — текст ошибки, не «—» без причины). */
export function resolveFfmpegExportBatchRowProgressDisplay(row: FfmpegExportBatchRow): string {
  if (row.status === 'error') {
    return resolveFfmpegExportBatchRowErrorDetail(row) ?? '—'
  }
  return row.progress
}
