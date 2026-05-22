import type { AppPaths } from '../../core/app-paths'
import { getEnginePathOverridesSnapshot } from '../engines/engine-path-sync'
import { getDownloadsQueueRowById, updateDownloadsRow } from './downloads-queue'
import { emitDownloadsLog } from '../../ipc/downloads/downloads-log-ipc'
import { runYtdlpOnce } from '../ytdlp/ytdlp-download-service'
import {
  classifyYtdlpQueueFailureKind,
  formatYtdlpQueueFailureStatus,
  shouldSkipQueueRetriesForFailureKind
} from '../ytdlp/ytdlp-progress-parser'
import {
  appendYtdlpDownloadHistoryEntry,
  outcomeFromQueueStatus
} from '../ytdlp/ytdlp-download-history'
import { resolveYtdlpQueueRetryPlan } from '../ytdlp/ytdlp-queue-retry'
import { getYtdlpRunOptionsSnapshot } from '../ytdlp/ytdlp-run-options-sync'
import {
  velorixLogQueueRetriesCancelled,
  formatVelorixLogAttemptExitCode,
  formatVelorixLogQueueRetryDelay
} from '../../../shared/downloads-velorix-log-locale'
import type { AppUiLocale } from '../../../shared/app-ui-locale'
import {
  isYtdlpQueueStatusWaiting,
  YTDLP_QUEUE_STATUS_CANCELLED,
  YTDLP_QUEUE_STATUS_RUNNING,
  YTDLP_QUEUE_STATUS_ERROR_PREFIX,
  YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX
} from '../../../shared/ytdlp-queue-status'
import { downloadsQueueRunnerState } from './downloads-queue-runner-state'
import { applyYtdlpRowDownloadSuccessActions } from './downloads-queue-runner-ytdlp-row-completion'
import { delayWithAbort, isAbort } from './downloads-queue-runner-ytdlp-row-helpers'
import { createYtdlpRowProgressBridge } from './downloads-queue-runner-ytdlp-row-progress'

export async function runYtdlpForWaitingRow(
  paths: AppPaths,
  outputDir: string,
  rowId: number,
  locale: AppUiLocale
): Promise<void> {
  const snap = getDownloadsQueueRowById(rowId)
  if (!snap || !isYtdlpQueueStatusWaiting(snap.status)) {
    return
  }

  const rowUrl = snap.url
  const startedAtMs = Date.now()
  /** Запись в history.json только после реального запуска yt-dlp (не только смена статуса в UI). */
  let shouldRecordHistory = false
  let finalExitCode: number | null = null

  downloadsQueueRunnerState.activeAbort = new AbortController()
  const signal = downloadsQueueRunnerState.activeAbort.signal
  downloadsQueueRunnerState.activeRunnerRowId = rowId

  updateDownloadsRow(rowId, {
    status: YTDLP_QUEUE_STATUS_RUNNING,
    progress: '…',
    queueFmt: null,
    queueSize: null,
    queueSpeed: null,
    queueEta: null
  })
  downloadsQueueRunnerState.notifySnapshot()

  emitDownloadsLog({ kind: 'reset', rowId })

  const progress = createYtdlpRowProgressBridge(rowId, locale, snap.outputPath ?? null)

  const cli = getYtdlpRunOptionsSnapshot()
  const retryPlan = resolveYtdlpQueueRetryPlan(cli.queueRetryProfile)
  const maxRuns = 1 + retryPlan.extraAttempts

  try {
    for (let runIndex = 0; runIndex < maxRuns; runIndex++) {
      progress.resetErrorStateForRetry()
      if (runIndex > 0) {
        progress.flushPendingProgressUI()
        const delayMs = retryPlan.delaysMs[runIndex - 1] ?? 2000
        const sec = Math.round(delayMs / 100) / 10
        emitDownloadsLog({
          kind: 'line',
          rowId,
          stream: 'stderr',
          text: formatVelorixLogQueueRetryDelay(locale, runIndex, retryPlan.extraAttempts, sec)
        })
        updateDownloadsRow(rowId, {
          status: `${YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX} (${runIndex}/${retryPlan.extraAttempts})…`,
          progress: progress.lastProgressCell ?? '—'
        })
        downloadsQueueRunnerState.notifySnapshot()
        try {
          await delayWithAbort(delayMs, signal, locale)
        } catch {
          progress.flushPendingProgressUI()
          updateDownloadsRow(rowId, {
            status: YTDLP_QUEUE_STATUS_CANCELLED,
            progress: progress.lastProgressCell ?? '—'
          })
          break
        }
        progress.resetSamplingAfterRetry()
        updateDownloadsRow(rowId, {
          status: YTDLP_QUEUE_STATUS_RUNNING,
          progress: '…',
          queueFmt: null,
          queueSize: null,
          queueSpeed: null,
          queueEta: null
        })
        downloadsQueueRunnerState.notifySnapshot()
      }

      let result: { exitCode: number | null; signal: NodeJS.Signals | null }
      try {
        result = await runYtdlpOnce(
          paths,
          rowUrl,
          outputDir,
          signal,
          {
            onStarted: () => {
              shouldRecordHistory = true
            },
            onStdoutLine: (line) => {
              progress.onYtDlpStreamLine('stdout', line)
            },
            onStderrLine: (line) => {
              progress.onYtDlpStreamLine('stderr', line)
            }
          },
          getEnginePathOverridesSnapshot(),
          {
            filenameTemplate: cli.filenameTemplate,
            formatExtraArgs: cli.formatExtraArgs,
            downloadPlaylist: cli.downloadPlaylist,
            audioOnly: cli.audioOnly,
            subtitlePreset: cli.subtitlePreset,
            subLangs: cli.subLangs,
            cookiesArgvFile: cli.cookiesArgvFile,
            cookiesArgvBrowser: cli.cookiesArgvBrowser,
            cookiesArgvBrowserProfile: cli.cookiesArgvBrowserProfile,
            impersonateTarget: cli.impersonateTarget,
            rateLimit: cli.rateLimit,
            retries: cli.retries,
            fragmentRetries: cli.fragmentRetries,
            extraArgs: cli.extraArgs
          },
          locale
        )
      } catch (e) {
        const aborted = isAbort(e)
        const msg = e instanceof Error ? e.message : String(e)
        progress.flushPendingProgressUI()
        updateDownloadsRow(rowId, {
          status: aborted
            ? YTDLP_QUEUE_STATUS_CANCELLED
            : `${YTDLP_QUEUE_STATUS_ERROR_PREFIX}: ${msg.slice(0, 140)}`,
          progress: progress.lastProgressCell ?? '—'
        })
        finalExitCode = null
        break
      }

      finalExitCode = result.exitCode

      if (result.exitCode === 0) {
        await applyYtdlpRowDownloadSuccessActions(paths, rowId, locale, progress)
        break
      }

      const code = result.exitCode
      const failureKind = classifyYtdlpQueueFailureKind(
        progress.lastErrorSummary,
        progress.lastStderrLine,
        code
      )
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: formatVelorixLogAttemptExitCode(locale, runIndex + 1, maxRuns, code)
      })

      if (runIndex < maxRuns - 1 && shouldSkipQueueRetriesForFailureKind(failureKind)) {
        emitDownloadsLog({
          kind: 'line',
          rowId,
          stream: 'stderr',
          text: velorixLogQueueRetriesCancelled(locale)
        })
        progress.flushPendingProgressUI()
        updateDownloadsRow(rowId, {
          status: formatYtdlpQueueFailureStatus(
            code,
            result.signal,
            progress.lastErrorSummary,
            progress.lastStderrLine,
            failureKind,
            locale
          ),
          progress: progress.lastProgressCell ?? '—'
        })
        break
      }

      if (runIndex >= maxRuns - 1) {
        progress.flushPendingProgressUI()
        updateDownloadsRow(rowId, {
          status: formatYtdlpQueueFailureStatus(
            code,
            result.signal,
            progress.lastErrorSummary,
            progress.lastStderrLine,
            failureKind,
            locale
          ),
          progress: progress.lastProgressCell ?? '—'
        })
        break
      }
    }
  } finally {
    progress.clearProgressFlushTimer()
    if (shouldRecordHistory) {
      const finalRow = getDownloadsQueueRowById(rowId)
      if (finalRow) {
        appendYtdlpDownloadHistoryEntry(paths.userData, {
          startedAt: startedAtMs,
          finishedAt: Date.now(),
          url: rowUrl,
          shortLabel: finalRow.shortLabel,
          outcome: outcomeFromQueueStatus(finalRow.status),
          status: finalRow.status,
          exitCode: finalExitCode,
          errorHint: progress.lastErrorSummary,
          outputPath: finalRow.outputPath ?? progress.lastOutputPath
        })
      }
    }
    downloadsQueueRunnerState.activeAbort = null
    downloadsQueueRunnerState.activeRunnerRowId = null
    downloadsQueueRunnerState.notifySnapshot()
  }
}
