/**
 * §7.3 — текстовый отчёт пакетной очереди (shared, без Node).
 */

import type {
  FfmpegExportBatchSnapshot,
  FfmpegExportBatchStatus
} from './ffmpeg-export-batch-contract'
import type { AppUiLocale } from './app-ui-locale'
import {
  resolveFfmpegExportBatchRowErrorDetail,
  resolveFfmpegExportBatchRowProgressDisplay
} from './ffmpeg-export-batch-row-display'

function batchStatusLabel(status: FfmpegExportBatchStatus, locale: AppUiLocale): string {
  if (locale === 'en') {
    switch (status) {
      case 'waiting':
        return 'Waiting'
      case 'running':
        return 'Running'
      case 'done':
        return 'Done'
      case 'error':
        return 'Error'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }
  switch (status) {
    case 'waiting':
      return 'Ожидание'
    case 'running':
      return 'В работе'
    case 'done':
      return 'Готово'
    case 'error':
      return 'Ошибка'
    case 'cancelled':
      return 'Отменено'
    default:
      return status
  }
}

export function formatFfmpegExportBatchInputPathsText(paths: string[]): string {
  return paths.join('\r\n')
}

function sanitizeReportCell(raw: string): string {
  return raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, ' ').replace(/\t/g, ' ')
}

/** TSV-подобный отчёт для буфера обмена / сохранения в файл. */
export function formatFfmpegExportBatchReportText(
  snap: FfmpegExportBatchSnapshot,
  locale: AppUiLocale = 'ru'
): string {
  const header =
    locale === 'en' ? '# Velorix batch export report\r\n' : '# Отчёт пакетного экспорта Velorix\r\n'
  const summary =
    locale === 'en'
      ? `running=${snap.running} ok=${snap.completedOk} error=${snap.completedError} cancelled=${snap.completedCancelled} concurrency=${snap.concurrency}\r\n`
      : `running=${snap.running} ok=${snap.completedOk} error=${snap.completedError} cancelled=${snap.completedCancelled} concurrency=${snap.concurrency}\r\n`
  const colHeader =
    locale === 'en'
      ? 'status\tinput\toutput\tprogress\terror_detail\r\n'
      : 'статус\tвход\tвыход\tпрогресс\tошибка\r\n'
  const lines = snap.rows.map((row) => {
    const status = batchStatusLabel(row.status, locale)
    const out = row.outputPath ?? ''
    const prog = sanitizeReportCell(resolveFfmpegExportBatchRowProgressDisplay(row))
    const err = sanitizeReportCell(resolveFfmpegExportBatchRowErrorDetail(row) ?? '')
    return `${sanitizeReportCell(status)}\t${sanitizeReportCell(row.inputPath)}\t${sanitizeReportCell(
      out
    )}\t${prog}\t${err}`
  })
  return header + summary + colHeader + lines.join('\r\n') + '\r\n'
}
