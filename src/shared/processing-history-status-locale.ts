import type { AppUiLocale } from './app-ui-locale'

export type ProcessingHistoryStatusStrings = {
  exportProgressLaunchingFfmpeg: string
  processingHistoryAutoExportSuccess: string
  processingHistoryAutoExportCancelled: string
  processingHistoryAutoExportFailed: string
  processingHistoryFfmpegExportSuccess: string
  processingHistoryFfmpegExportCancelled: string
  processingHistoryFfmpegExportFailed: string
  processingHistoryFfmpegBatchExportSuccess: string
  processingHistoryFfmpegBatchExportCancelled: string
  processingHistoryFfmpegBatchExportFailed: string
  processingHistorySnapshotSuccess: string
  processingHistorySnapshotFailed: string
}

export const PROCESSING_HISTORY_STATUS_STRINGS_RU: ProcessingHistoryStatusStrings = {
  exportProgressLaunchingFfmpeg: 'Запуск ffmpeg…',
  processingHistoryAutoExportSuccess: 'Авто-экспорт завершён',
  processingHistoryAutoExportCancelled: 'Авто-экспорт отменён',
  processingHistoryAutoExportFailed: 'Авто-экспорт не удался',
  processingHistoryFfmpegExportSuccess: 'Экспорт завершён',
  processingHistoryFfmpegExportCancelled: 'Экспорт отменён',
  processingHistoryFfmpegExportFailed: 'Экспорт не удался',
  processingHistoryFfmpegBatchExportSuccess: 'Пакетный экспорт завершён',
  processingHistoryFfmpegBatchExportCancelled: 'Пакетный экспорт отменён',
  processingHistoryFfmpegBatchExportFailed: 'Пакетный экспорт не удался',
  processingHistorySnapshotSuccess: 'Кадр сохранён',
  processingHistorySnapshotFailed: 'Сохранение кадра не удалось'
}

export const PROCESSING_HISTORY_STATUS_STRINGS_EN: ProcessingHistoryStatusStrings = {
  exportProgressLaunchingFfmpeg: 'Starting ffmpeg…',
  processingHistoryAutoExportSuccess: 'Auto-export finished',
  processingHistoryAutoExportCancelled: 'Auto-export cancelled',
  processingHistoryAutoExportFailed: 'Auto-export failed',
  processingHistoryFfmpegExportSuccess: 'Export finished',
  processingHistoryFfmpegExportCancelled: 'Export cancelled',
  processingHistoryFfmpegExportFailed: 'Export failed',
  processingHistoryFfmpegBatchExportSuccess: 'Batch export finished',
  processingHistoryFfmpegBatchExportCancelled: 'Batch export cancelled',
  processingHistoryFfmpegBatchExportFailed: 'Batch export failed',
  processingHistorySnapshotSuccess: 'Frame saved',
  processingHistorySnapshotFailed: 'Frame save failed'
}

function pickProcessingHistoryStrings(locale: AppUiLocale): ProcessingHistoryStatusStrings {
  return locale === 'en'
    ? PROCESSING_HISTORY_STATUS_STRINGS_EN
    : PROCESSING_HISTORY_STATUS_STRINGS_RU
}

export function exportProgressLaunchingFfmpeg(locale: AppUiLocale): string {
  return pickProcessingHistoryStrings(locale).exportProgressLaunchingFfmpeg
}

export function processingHistoryAutoExportSuccess(locale: AppUiLocale): string {
  return pickProcessingHistoryStrings(locale).processingHistoryAutoExportSuccess
}

export function processingHistoryAutoExportCancelled(locale: AppUiLocale): string {
  return pickProcessingHistoryStrings(locale).processingHistoryAutoExportCancelled
}

export function processingHistoryAutoExportFailed(locale: AppUiLocale): string {
  return pickProcessingHistoryStrings(locale).processingHistoryAutoExportFailed
}

export function processingHistoryFfmpegExportSuccess(locale: AppUiLocale): string {
  return pickProcessingHistoryStrings(locale).processingHistoryFfmpegExportSuccess
}

export function processingHistoryFfmpegExportCancelled(locale: AppUiLocale): string {
  return pickProcessingHistoryStrings(locale).processingHistoryFfmpegExportCancelled
}

export function processingHistoryFfmpegExportFailed(locale: AppUiLocale): string {
  return pickProcessingHistoryStrings(locale).processingHistoryFfmpegExportFailed
}

export function processingHistoryFfmpegBatchExportSuccess(locale: AppUiLocale): string {
  return pickProcessingHistoryStrings(locale).processingHistoryFfmpegBatchExportSuccess
}

export function processingHistoryFfmpegBatchExportCancelled(
  locale: AppUiLocale
): string {
  return pickProcessingHistoryStrings(locale).processingHistoryFfmpegBatchExportCancelled
}

export function processingHistoryFfmpegBatchExportFailed(locale: AppUiLocale): string {
  return pickProcessingHistoryStrings(locale).processingHistoryFfmpegBatchExportFailed
}

export function processingHistorySnapshotSuccess(locale: AppUiLocale): string {
  return pickProcessingHistoryStrings(locale).processingHistorySnapshotSuccess
}

export function processingHistorySnapshotFailed(locale: AppUiLocale): string {
  return pickProcessingHistoryStrings(locale).processingHistorySnapshotFailed
}
