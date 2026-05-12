import type { DownloadsWindowUiLocale } from './downloads-window-ui-locale'

export function exportProgressLaunchingFfmpeg(locale: DownloadsWindowUiLocale): string {
  return locale === 'en' ? 'Starting ffmpeg…' : 'Запуск ffmpeg…'
}

export function processingHistoryAutoExportSuccess(locale: DownloadsWindowUiLocale): string {
  return locale === 'en' ? 'Auto-export finished' : 'Авто-экспорт завершён'
}

export function processingHistoryAutoExportCancelled(locale: DownloadsWindowUiLocale): string {
  return locale === 'en' ? 'Auto-export cancelled' : 'Авто-экспорт отменён'
}

export function processingHistoryAutoExportFailed(locale: DownloadsWindowUiLocale): string {
  return locale === 'en' ? 'Auto-export failed' : 'Авто-экспорт не удался'
}

export function processingHistoryFfmpegExportSuccess(locale: DownloadsWindowUiLocale): string {
  return locale === 'en' ? 'Export finished' : 'Экспорт завершён'
}

export function processingHistoryFfmpegExportCancelled(locale: DownloadsWindowUiLocale): string {
  return locale === 'en' ? 'Export cancelled' : 'Экспорт отменён'
}

export function processingHistoryFfmpegExportFailed(locale: DownloadsWindowUiLocale): string {
  return locale === 'en' ? 'Export failed' : 'Экспорт не удался'
}

export function processingHistorySnapshotSuccess(locale: DownloadsWindowUiLocale): string {
  return locale === 'en' ? 'Frame saved' : 'Кадр сохранён'
}

export function processingHistorySnapshotFailed(locale: DownloadsWindowUiLocale): string {
  return locale === 'en' ? 'Frame save failed' : 'Сохранение кадра не удалось'
}
