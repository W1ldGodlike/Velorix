/**
 * §7.3 — producer–consumer пакетного ffmpeg-экспорта с ограничением параллелизма.
 */

import { cpus } from 'node:os'

import type { FfmpegExportProgressPayload } from '../shared/ffmpeg-export-contract'
import { FFMPEG_EXPORT_CANCELLED_ERROR } from '../shared/ffmpeg-export-contract'
import {
  FFMPEG_EXPORT_BATCH_STATUS_CANCELLED,
  FFMPEG_EXPORT_BATCH_STATUS_DONE,
  FFMPEG_EXPORT_BATCH_STATUS_ERROR,
  FFMPEG_EXPORT_BATCH_STATUS_RUNNING,
  resolveFfmpegExportBatchConcurrencyLimit
} from '../shared/ffmpeg-export-batch-contract'
import type { AppUiLocale } from '../shared/app-ui-locale'
import {
  processingHistoryFfmpegBatchExportCancelled,
  processingHistoryFfmpegBatchExportFailed,
  processingHistoryFfmpegBatchExportSuccess
} from '../shared/processing-history-status-locale'
import type { AppSettings } from '../shared/settings-contract'
import { appendProcessingHistoryEntry } from './processing-history'
import { runFfmpegExportJob } from './ffmpeg-export-service'
import {
  pickUniqueAutoExportOutputPath,
  resolveFfmpegExportBatchOutputDirectoryFromSettings,
  resolveFfmpegExportBatchOutputSuffixFromSettings,
  resolveFfmpegExportJobOptionsFromAppSettings
} from './ffmpeg-export-resolve-from-settings'
import {
  getFfmpegExportBatchConcurrency,
  isFfmpegExportBatchRunnerBusy,
  setFfmpegExportBatchRunnerBusy,
  takeNextFfmpegExportBatchWaitingRow,
  updateFfmpegExportBatchRow
} from './ffmpeg-export-batch-queue'

let batchAbort: AbortController | null = null
let notifySnapshot = (): void => {}

export function setFfmpegExportBatchRunnerNotifier(fn: () => void): void {
  notifySnapshot = fn
}

export function cancelFfmpegExportBatchRunner(): void {
  batchAbort?.abort()
}

export function isFfmpegExportBatchActive(): boolean {
  return batchAbort !== null || isFfmpegExportBatchRunnerBusy()
}

export async function runFfmpegExportBatchQueue(deps: {
  ffmpegPath: string
  settings: AppSettings
  lutResourcesRoot: string
  rawExportOverrides?: unknown
  userDataRoot: string
  rememberExportOutputPath: (filePath: string) => void
  rememberFfmpegExportDirectory: (filePath: string) => void
  pushRowProgress: (rowId: number, payload: FfmpegExportProgressPayload) => void
  uiLocale: AppUiLocale
}): Promise<void> {
  if (isFfmpegExportBatchRunnerBusy()) {
    return
  }
  setFfmpegExportBatchRunnerBusy(true)
  batchAbort = new AbortController()
  const signal = batchAbort.signal
  const exportOpts = resolveFfmpegExportJobOptionsFromAppSettings(
    deps.settings,
    deps.rawExportOverrides
  )
  const batchOutputSuffix = resolveFfmpegExportBatchOutputSuffixFromSettings(deps.settings)
  const batchOutDir = resolveFfmpegExportBatchOutputDirectoryFromSettings(deps.settings)
  const limit = resolveFfmpegExportBatchConcurrencyLimit(
    getFfmpegExportBatchConcurrency(),
    cpus().length
  )
  const active = new Set<Promise<void>>()

  const processOne = async (rowId: number, inputPath: string): Promise<void> => {
    if (signal.aborted) {
      updateFfmpegExportBatchRow(rowId, {
        status: FFMPEG_EXPORT_BATCH_STATUS_CANCELLED,
        progress: '—'
      })
      notifySnapshot()
      return
    }
    const startedAt = Date.now()
    const outPath = pickUniqueAutoExportOutputPath(
      inputPath,
      exportOpts.container,
      batchOutputSuffix,
      batchOutDir
    )
    updateFfmpegExportBatchRow(rowId, {
      status: FFMPEG_EXPORT_BATCH_STATUS_RUNNING,
      progress: '0%'
    })
    notifySnapshot()
    const result = await runFfmpegExportJob({
      ffmpegPath: deps.ffmpegPath,
      inputPath,
      outputPath: outPath,
      probeDurationSec: null,
      ...exportOpts,
      lutResourcesRoot: deps.lutResourcesRoot,
      signal,
      uiLocale: deps.uiLocale,
      onProgress: (p: FfmpegExportProgressPayload) => {
        const label =
          p.percent >= 0
            ? `${Math.round(p.percent)}%`
            : p.message.trim().length > 0
              ? p.message
              : '…'
        updateFfmpegExportBatchRow(rowId, { progress: label })
        deps.pushRowProgress(rowId, p)
        notifySnapshot()
      }
    })
    const finishedAt = Date.now()
    if (result.ok) {
      deps.rememberExportOutputPath(outPath)
      deps.rememberFfmpegExportDirectory(outPath)
      updateFfmpegExportBatchRow(rowId, {
        status: FFMPEG_EXPORT_BATCH_STATUS_DONE,
        progress: '100%',
        outputPath: outPath
      })
      appendProcessingHistoryEntry(deps.userDataRoot, {
        kind: 'ffmpegBatchExport',
        startedAt,
        finishedAt,
        inputPath,
        outputPath: outPath,
        outcome: 'success',
        status: processingHistoryFfmpegBatchExportSuccess(deps.uiLocale),
        errorHint: null,
        exportVideoCodecUsed: result.videoCodecUsed
      })
    } else if (result.error === FFMPEG_EXPORT_CANCELLED_ERROR || signal.aborted) {
      updateFfmpegExportBatchRow(rowId, {
        status: FFMPEG_EXPORT_BATCH_STATUS_CANCELLED,
        progress: '—'
      })
      appendProcessingHistoryEntry(deps.userDataRoot, {
        kind: 'ffmpegBatchExport',
        startedAt,
        finishedAt,
        inputPath,
        outputPath: outPath,
        outcome: 'cancelled',
        status: processingHistoryFfmpegBatchExportCancelled(deps.uiLocale),
        errorHint: null,
        exportVideoCodecUsed: result.videoCodecUsed
      })
    } else {
      updateFfmpegExportBatchRow(rowId, {
        status: FFMPEG_EXPORT_BATCH_STATUS_ERROR,
        progress: result.error,
        error: result.error
      })
      appendProcessingHistoryEntry(deps.userDataRoot, {
        kind: 'ffmpegBatchExport',
        startedAt,
        finishedAt,
        inputPath,
        outputPath: outPath,
        outcome: 'error',
        status: processingHistoryFfmpegBatchExportFailed(deps.uiLocale),
        errorHint: result.error,
        exportVideoCodecUsed: result.videoCodecUsed
      })
    }
    notifySnapshot()
  }

  const pump = (): void => {
    while (!signal.aborted && active.size < limit) {
      const next = takeNextFfmpegExportBatchWaitingRow()
      if (!next) {
        break
      }
      const p = processOne(next.id, next.inputPath).finally(() => {
        active.delete(p)
        pump()
      })
      active.add(p)
    }
  }

  try {
    pump()
    while (active.size > 0) {
      await Promise.race(active)
    }
  } finally {
    setFfmpegExportBatchRunnerBusy(false)
    batchAbort = null
    notifySnapshot()
  }
}
