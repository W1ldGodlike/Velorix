import type { DownloadsWindowUiLocale } from './downloads-window-ui-locale'

const BR = '[FluxAlloy]'

export function downloadsRunnerAbortMessage(locale: DownloadsWindowUiLocale): string {
  return locale === 'en' ? 'Cancelled' : 'Отменено'
}

export function formatFluxLogQueueRetryDelay(
  locale: DownloadsWindowUiLocale,
  runIndex: number,
  extraAttempts: number,
  sec: number
): string {
  if (locale === 'en') {
    return `${BR} Retry ${runIndex}/${extraAttempts} in ${sec} s…`
  }
  return `${BR} Повтор ${runIndex}/${extraAttempts} через ${sec} с…`
}

export function fluxLogAutoOpenSkippedNoHandler(locale: DownloadsWindowUiLocale): string {
  return locale === 'en'
    ? `${BR} Auto-open in handler skipped: handler not connected.`
    : `${BR} Авто-открытие в обработчике пропущено: обработчик не подключён.`
}

export function fluxLogAutoOpenSkippedBadPath(locale: DownloadsWindowUiLocale): string {
  return locale === 'en'
    ? `${BR} Auto-open in handler skipped: result path unknown or outside the downloads directory.`
    : `${BR} Авто-открытие в обработчике пропущено: путь результата неизвестен или вне каталога загрузок.`
}

export function formatFluxLogAutoOpenFailed(
  locale: DownloadsWindowUiLocale,
  error: string
): string {
  return locale === 'en'
    ? `${BR} Auto-open in handler failed: ${error}`
    : `${BR} Авто-открытие в обработчике не удалось: ${error}`
}

export function formatFluxLogAttemptExitCode(
  locale: DownloadsWindowUiLocale,
  attempt: number,
  maxRuns: number,
  code: number | null
): string {
  const c = code === null ? '?' : String(code)
  return locale === 'en'
    ? `${BR} Attempt ${attempt}/${maxRuns} finished with exit code ${c}.`
    : `${BR} Попытка ${attempt}/${maxRuns} завершилась с кодом ${c}.`
}

export function fluxLogQueueRetriesCancelled(locale: DownloadsWindowUiLocale): string {
  return locale === 'en'
    ? `${BR} Further queue retries cancelled: the error or exit code does not warrant repeating the same command.`
    : `${BR} Дальнейшие повторы очереди отменены: ошибка или код выхода не подразумевают повтор той же команды.`
}

export function fluxLogAutoExportSkippedBusy(locale: DownloadsWindowUiLocale): string {
  return locale === 'en'
    ? `${BR} Auto-export skipped: another export is already running.`
    : `${BR} Авто-экспорт пропущен: уже выполняется другой экспорт.`
}

export function fluxLogAutoExportFfmpegMissing(locale: DownloadsWindowUiLocale): string {
  return locale === 'en'
    ? `${BR} Auto-export not started: ffmpeg not found.`
    : `${BR} Авто-экспорт не запущен: ffmpeg не найден.`
}

export function fluxLogAutoExportSkippedMainWindow(locale: DownloadsWindowUiLocale): string {
  return locale === 'en'
    ? `${BR} Auto-export skipped: main window unavailable.`
    : `${BR} Авто-экспорт пропущен: главное окно недоступно.`
}

export function formatFluxLogAutoExportDone(
  locale: DownloadsWindowUiLocale,
  outPath: string
): string {
  return locale === 'en'
    ? `${BR} Auto-export finished: ${outPath}`
    : `${BR} Авто-экспорт завершён: ${outPath}`
}

export function fluxLogAutoExportCancelled(locale: DownloadsWindowUiLocale): string {
  return locale === 'en'
    ? `${BR} Auto-export cancelled.`
    : `${BR} Авто-экспорт отменён.`
}

export function formatFluxLogAutoExportFailed(
  locale: DownloadsWindowUiLocale,
  error: string
): string {
  return locale === 'en'
    ? `${BR} Auto-export failed: ${error}`
    : `${BR} Авто-экспорт не удался: ${error}`
}

export function autoExportProgressMessage(locale: DownloadsWindowUiLocale): string {
  return locale === 'en' ? 'Auto-export after download…' : 'Авто-экспорт после загрузки…'
}
