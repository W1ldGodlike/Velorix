import { resolveAppPaths } from './app-paths'
import {
  findFirstWaitingRow,
  getDownloadsQueueRowById,
  type DownloadsQueueRow
} from './downloads-queue'
import { runYtdlpForWaitingRow } from './downloads-queue-runner-ytdlp-row'
import {
  downloadsQueueRunnerState,
  type AfterDownloadEnqueueBatchFn,
  type AfterDownloadOpenedInMainHandlerFn,
  type OpenDownloadedInMainHandlerFn
} from './downloads-queue-runner-state'
import { resolveYtdlpOutputDirectory } from './ytdlp-download-output'
import { getDownloadsWindowIpcStrings } from '../shared/downloads-window-ipc-locale'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { isYtdlpQueueStatusWaiting } from '../shared/ytdlp-queue-status'

export {
  type AfterDownloadEnqueueBatchFn,
  type AfterDownloadOpenedInMainHandlerFn,
  type OpenDownloadedInMainHandlerFn
} from './downloads-queue-runner-state'

/**
 * Регистрируется при старте приложения: без hook авто-открытие §6.4 после успеха yt-dlp отключено.
 */
export function configureDownloadsQueueRunnerHooks(hooks: {
  openDownloadedFileInHandler?: OpenDownloadedInMainHandlerFn
  afterDownloadOpenedInMainHandler?: AfterDownloadOpenedInMainHandlerFn | null
  afterDownloadEnqueueBatch?: AfterDownloadEnqueueBatchFn | null
}): void {
  downloadsQueueRunnerState.openDownloadedFileInMainHandlerHook =
    hooks.openDownloadedFileInHandler ?? null
  downloadsQueueRunnerState.afterDownloadOpenedInMainHandlerHook =
    hooks.afterDownloadOpenedInMainHandler ?? null
  downloadsQueueRunnerState.afterDownloadEnqueueBatchHook = hooks.afterDownloadEnqueueBatch ?? null
}

/** Вызывается из downloads-window: обновить UI после изменений очереди/прогресса. */
export function setDownloadsRunnerNotifier(fn: () => void): void {
  downloadsQueueRunnerState.notifySnapshot = fn
}

export function cancelDownloadsRunner(): void {
  downloadsQueueRunnerState.activeAbort?.abort()
}

/** Ждёт, пока `rowId` перестанет быть активной строкой runner (после abort и закрытия процесса). */
export async function waitUntilRowNotActiveRunner(rowId: number, maxMs = 12_000): Promise<void> {
  const t0 = Date.now()
  while (Date.now() - t0 < maxMs) {
    if (getActiveDownloadsRunnerRowId() !== rowId) {
      return
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 40)
    })
  }
}

export function getActiveDownloadsRunnerRowId(): number | null {
  return downloadsQueueRunnerState.activeRunnerRowId
}

export function isDownloadsRunnerBusy(): boolean {
  return downloadsQueueRunnerState.sequentialBusy
}

/**
 * Последовательно обрабатывает строки со статусом «Ожидание». Отмена — через cancelDownloadsRunner().
 */
export function startDownloadsSequential(
  locale: DownloadsWindowUiLocale = 'ru'
): { ok: true } | { ok: false; error: string } {
  const P = getDownloadsWindowIpcStrings(locale)
  if (downloadsQueueRunnerState.sequentialBusy) {
    return {
      ok: false,
      error: P.downloadAlreadyRunning
    }
  }
  if (!findFirstWaitingRow()) {
    return { ok: false, error: P.noWaitingRowsInQueue }
  }
  downloadsQueueRunnerState.sequentialBusy = true

  const paths = resolveAppPaths()
  const outputDir = resolveYtdlpOutputDirectory(paths.userData)

  void (async (): Promise<void> => {
    let row: DownloadsQueueRow | undefined
    try {
      while ((row = findFirstWaitingRow())) {
        await runYtdlpForWaitingRow(paths, outputDir, row.id, locale)
      }
    } finally {
      downloadsQueueRunnerState.sequentialBusy = false
      downloadsQueueRunnerState.notifySnapshot()
    }
  })()

  return { ok: true }
}

/**
 * Одна строка «Ожидание» без продолжения остальной очереди §6.1.
 * Пока yt-dlp последовательный, занятость runner общая с «Старт очереди».
 */
export async function startDownloadSingleRow(
  rowId: number,
  locale: DownloadsWindowUiLocale = 'ru'
): Promise<{ ok: true } | { ok: false; error: string }> {
  const P = getDownloadsWindowIpcStrings(locale)
  if (downloadsQueueRunnerState.sequentialBusy) {
    return {
      ok: false,
      error: P.downloadAlreadyRunning
    }
  }
  const snap = getDownloadsQueueRowById(rowId)
  if (!snap) {
    return { ok: false, error: P.rowNotFound }
  }
  if (!isYtdlpQueueStatusWaiting(snap.status)) {
    return { ok: false, error: P.startRowOnlyWaiting }
  }

  downloadsQueueRunnerState.sequentialBusy = true
  const paths = resolveAppPaths()
  const outputDir = resolveYtdlpOutputDirectory(paths.userData)

  try {
    await runYtdlpForWaitingRow(paths, outputDir, rowId, locale)
  } finally {
    downloadsQueueRunnerState.sequentialBusy = false
    downloadsQueueRunnerState.notifySnapshot()
  }

  return { ok: true }
}
