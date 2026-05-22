import type { AppUiLocale } from './app-ui-locale'

const BR = '[Velorix]'

export function downloadsRunnerAbortMessage(locale: AppUiLocale): string {
  return locale === 'en' ? 'Cancelled' : 'Отменено'
}

export function formatVelorixLogQueueRetryDelay(
  locale: AppUiLocale,
  runIndex: number,
  extraAttempts: number,
  sec: number
): string {
  if (locale === 'en') {
    return `${BR} Retry ${runIndex}/${extraAttempts} in ${sec} s…`
  }
  return `${BR} Повтор ${runIndex}/${extraAttempts} через ${sec} с…`
}

export function velorixLogAutoOpenSkippedNoHandler(locale: AppUiLocale): string {
  return locale === 'en'
    ? `${BR} Auto-open in handler skipped: handler not connected.`
    : `${BR} Авто-открытие в обработчике пропущено: обработчик не подключён.`
}

export function velorixLogAutoOpenSkippedBadPath(locale: AppUiLocale): string {
  return locale === 'en'
    ? `${BR} Auto-open in handler skipped: result path unknown or outside the downloads directory.`
    : `${BR} Авто-открытие в обработчике пропущено: путь результата неизвестен или вне каталога загрузок.`
}

export function formatVelorixLogAutoOpenFailed(locale: AppUiLocale, error: string): string {
  return locale === 'en'
    ? `${BR} Auto-open in handler failed: ${error}`
    : `${BR} Авто-открытие в обработчике не удалось: ${error}`
}

export function formatVelorixLogAttemptExitCode(
  locale: AppUiLocale,
  attempt: number,
  maxRuns: number,
  code: number | null
): string {
  const c = code === null ? '?' : String(code)
  return locale === 'en'
    ? `${BR} Attempt ${attempt}/${maxRuns} finished with exit code ${c}.`
    : `${BR} Попытка ${attempt}/${maxRuns} завершилась с кодом ${c}.`
}

export function velorixLogQueueRetriesCancelled(locale: AppUiLocale): string {
  return locale === 'en'
    ? `${BR} Further queue retries cancelled: the error or exit code does not warrant repeating the same command.`
    : `${BR} Дальнейшие повторы очереди отменены: ошибка или код выхода не подразумевают повтор той же команды.`
}

export function velorixLogAutoExportSkippedBusy(locale: AppUiLocale): string {
  return locale === 'en'
    ? `${BR} Auto-export skipped: another export is already running.`
    : `${BR} Авто-экспорт пропущен: уже выполняется другой экспорт.`
}

export function velorixLogAutoExportFfmpegMissing(locale: AppUiLocale): string {
  return locale === 'en'
    ? `${BR} Auto-export not started: ffmpeg not found.`
    : `${BR} Авто-экспорт не запущен: ffmpeg не найден.`
}

export function velorixLogAutoExportSkippedMainWindow(locale: AppUiLocale): string {
  return locale === 'en'
    ? `${BR} Auto-export skipped: main window unavailable.`
    : `${BR} Авто-экспорт пропущен: главное окно недоступно.`
}

export function formatVelorixLogAutoExportDone(locale: AppUiLocale, outPath: string): string {
  return locale === 'en'
    ? `${BR} Auto-export finished: ${outPath}`
    : `${BR} Авто-экспорт завершён: ${outPath}`
}

export function velorixLogAutoExportCancelled(locale: AppUiLocale): string {
  return locale === 'en' ? `${BR} Auto-export cancelled.` : `${BR} Авто-экспорт отменён.`
}

export function formatVelorixLogAutoExportFailed(locale: AppUiLocale, error: string): string {
  return locale === 'en'
    ? `${BR} Auto-export failed: ${error}`
    : `${BR} Авто-экспорт не удался: ${error}`
}

export function formatVelorixLogBatchEnqueueAdded(locale: AppUiLocale, path: string): string {
  return locale === 'en'
    ? `${BR} Added to batch export queue: ${path}`
    : `${BR} Добавлено в пакетный экспорт: ${path}`
}

export function velorixLogBatchEnqueueSkippedNotVideo(locale: AppUiLocale): string {
  return locale === 'en'
    ? `${BR} Batch enqueue skipped: not a supported video file.`
    : `${BR} Пакетный экспорт: файл не подходит (не видео).`
}

export function velorixLogBatchEnqueueSkippedBadPath(locale: AppUiLocale): string {
  return locale === 'en'
    ? `${BR} Batch enqueue skipped: output path not allowed.`
    : `${BR} Пакетный экспорт: путь к файлу не разрешён.`
}

export function velorixLogBatchAutoStartSkippedBusy(locale: AppUiLocale): string {
  return locale === 'en'
    ? `${BR} Batch auto-start skipped: export already running.`
    : `${BR} Авто-запуск пакета пропущен: уже идёт экспорт.`
}

export function velorixLogBatchAutoStartFfmpegMissing(locale: AppUiLocale): string {
  return locale === 'en'
    ? `${BR} Batch auto-start skipped: ffmpeg not found.`
    : `${BR} Авто-запуск пакета пропущен: ffmpeg не найден.`
}

export function velorixLogBatchAutoStartLaunched(locale: AppUiLocale): string {
  return locale === 'en'
    ? `${BR} Batch export started automatically.`
    : `${BR} Пакетный экспорт запущен автоматически.`
}

export function autoExportProgressMessage(locale: AppUiLocale): string {
  return locale === 'en' ? 'Auto-export after download…' : 'Авто-экспорт после загрузки…'
}
