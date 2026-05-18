import type { AppPaths } from './app-paths'
import { resolveAllowedYtdlpDownloadOutputFile } from './ytdlp-download-output'
import { getDownloadsQueueRowById, updateDownloadsRow } from './downloads-queue'
import { emitDownloadsLog } from './downloads-log-ipc'
import { getYtdlpRunOptionsSnapshot } from './ytdlp-run-options-sync'
import {
  fluxLogAutoOpenSkippedBadPath,
  fluxLogAutoOpenSkippedNoHandler,
  fluxLogBatchEnqueueSkippedBadPath,
  formatFluxLogAutoOpenFailed
} from '../shared/downloads-flux-log-locale'
import type { AppUiLocale } from '../shared/app-ui-locale'
import { YTDLP_QUEUE_STATUS_DONE } from '../shared/ytdlp-queue-status'
import { downloadsQueueRunnerState } from './downloads-queue-runner-state'
import type { YtdlpRowProgressBridge } from './downloads-queue-runner-ytdlp-row-progress'

export async function applyYtdlpRowDownloadSuccessActions(
  paths: AppPaths,
  rowId: number,
  locale: AppUiLocale,
  progress: YtdlpRowProgressBridge
): Promise<void> {
  progress.flushPendingProgressUI()
  updateDownloadsRow(rowId, {
    status: YTDLP_QUEUE_STATUS_DONE,
    progress: progress.lastProgressCell ?? '100%'
  })

  const cliOpen = getYtdlpRunOptionsSnapshot()
  if (cliOpen.enqueueBatchOnDownloadComplete) {
    const batchCand = progress.lastOutputPath ?? getDownloadsQueueRowById(rowId)?.outputPath ?? null
    const batchSafe =
      batchCand !== null && batchCand.length > 0
        ? resolveAllowedYtdlpDownloadOutputFile(batchCand, paths.userData)
        : null
    if (!batchSafe) {
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: fluxLogBatchEnqueueSkippedBadPath(locale)
      })
    } else {
      downloadsQueueRunnerState.afterDownloadEnqueueBatchHook?.(batchSafe, rowId)
    }
  }

  if (!cliOpen.openInHandlerOnComplete) {
    return
  }

  const cand = progress.lastOutputPath ?? getDownloadsQueueRowById(rowId)?.outputPath ?? null
  const safe =
    cand !== null && cand.length > 0
      ? resolveAllowedYtdlpDownloadOutputFile(cand, paths.userData)
      : null
  if (!downloadsQueueRunnerState.openDownloadedFileInMainHandlerHook) {
    emitDownloadsLog({
      kind: 'line',
      rowId,
      stream: 'stderr',
      text: fluxLogAutoOpenSkippedNoHandler(locale)
    })
    return
  }
  if (!safe) {
    emitDownloadsLog({
      kind: 'line',
      rowId,
      stream: 'stderr',
      text: fluxLogAutoOpenSkippedBadPath(locale)
    })
    return
  }

  const openResult = await downloadsQueueRunnerState.openDownloadedFileInMainHandlerHook(safe)
  if (!openResult.ok) {
    emitDownloadsLog({
      kind: 'line',
      rowId,
      stream: 'stderr',
      text: formatFluxLogAutoOpenFailed(locale, openResult.error)
    })
    return
  }

  if (
    cliOpen.autoExportAfterOpenInHandler &&
    downloadsQueueRunnerState.afterDownloadOpenedInMainHandlerHook
  ) {
    downloadsQueueRunnerState.afterDownloadOpenedInMainHandlerHook(safe, rowId)
  }
}
