/**
 * §7.3 — текстовый отчёт пакетной очереди (shared, без Node).
 */

import type { FfmpegExportBatchSnapshot, FfmpegExportBatchStatus } from './ffmpeg-export-batch-contract'
import type { DownloadsWindowUiLocale } from './downloads-window-ui-locale'

function batchStatusLabel(status: FfmpegExportBatchStatus, locale: DownloadsWindowUiLocale): string {
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

/** TSV-подобный отчёт для буфера обмена / сохранения в файл. */
export function formatFfmpegExportBatchReportText(
  snap: FfmpegExportBatchSnapshot,
  locale: DownloadsWindowUiLocale = 'ru'
): string {
  const header =
    locale === 'en'
      ? '# FluxAlloy batch export report\r\n'
      : '# Отчёт пакетного экспорта FluxAlloy\r\n'
  const summary =
    locale === 'en'
      ? `running=${snap.running} ok=${snap.completedOk} error=${snap.completedError} cancelled=${snap.completedCancelled} concurrency=${snap.concurrency}\r\n`
      : `running=${snap.running} ok=${snap.completedOk} error=${snap.completedError} cancelled=${snap.completedCancelled} concurrency=${snap.concurrency}\r\n`
  const colHeader =
    locale === 'en'
      ? 'status\tinput\toutput\tprogress\r\n'
      : 'статус\tвход\tвыход\tпрогресс\r\n'
  const lines = snap.rows.map((row) => {
    const status = batchStatusLabel(row.status, locale)
    const out = row.outputPath ?? ''
    const prog = row.progress.replace(/\t/g, ' ')
    return `${status}\t${row.inputPath}\t${out}\t${prog}`
  })
  return header + summary + colHeader + lines.join('\r\n') + '\r\n'
}
