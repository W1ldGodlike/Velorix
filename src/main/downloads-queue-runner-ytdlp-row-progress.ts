import { getDownloadsQueueRowById, shortUrlLabel, updateDownloadsRow } from './downloads-queue'
import { emitDownloadsLog } from './downloads-log-ipc'
import {
  displayLabelFromYtdlpOutputPath,
  extractYtdlpErrorSummary,
  extractYtdlpOutputPath,
  formatTorrentStyleSpeedFromBps,
  formatYtdlpProgressCell,
  parseYtdlpDownloadProgressLine,
  parseYtdlpInfoDownloadingTitlePrefix,
  parseYtdlpInfoQueueSizeHint,
  parseYtdlpQueueFormatHint,
  parseYtdlpProgressPercentNumber,
  parseYtdlpSpeedToBytesPerSec,
  type YtdlpDownloadProgressParts
} from './ytdlp-download-service'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { downloadsQueueRunnerState } from './downloads-queue-runner-state'
import {
  DOWNLOADS_PROGRESS_LOG_MAX_SILENCE_MS,
  DOWNLOADS_PROGRESS_LOG_MIN_PERCENT_STEP,
  DOWNLOADS_PROGRESS_UI_MIN_INTERVAL_MS
} from './downloads-queue-runner-ytdlp-row-helpers'

export type YtdlpRowProgressBridge = {
  lastProgressCell: string | null
  lastErrorSummary: string | null
  lastOutputPath: string | null
  lastStderrLine: string | null
  clearProgressFlushTimer: () => void
  flushPendingProgressUI: () => void
  resetSamplingAfterRetry: () => void
  resetErrorStateForRetry: () => void
  applyProgressLine: (line: string) => void
  emitStreamLineForDownloadsLog: (stream: 'stdout' | 'stderr', line: string) => void
  applyQueueTitleHint: (line: string) => void
  applyYtDlpQueueCellHints: (line: string) => void
  noteErrorLine: (line: string) => void
  noteOutputPathLine: (line: string) => void
  onYtDlpStreamLine: (stream: 'stdout' | 'stderr', line: string) => void
}

export function createYtdlpRowProgressBridge(
  rowId: number,
  locale: DownloadsWindowUiLocale,
  initialOutputPath: string | null
): YtdlpRowProgressBridge {
  let lastProgressCell: string | null = null
  let lastErrorSummary: string | null = null
  let lastOutputPath: string | null = initialOutputPath
  let lastStderrLine: string | null = null
  let lastYtDlpProgressLogPercent: number | null = null
  let lastYtDlpProgressLogEmittedAtMs = 0

  let progressFlushTimer: ReturnType<typeof setTimeout> | null = null
  let latestProgressParsed: YtdlpDownloadProgressParts | null = null
  let latestSizeFromProgress: string | undefined
  let smoothedSpeedBps: number | null = null
  let lastProgressFlushMs = 0

  const clearProgressFlushTimer = (): void => {
    if (progressFlushTimer !== null) {
      clearTimeout(progressFlushTimer)
      progressFlushTimer = null
    }
  }

  const flushProgressUiNow = (): void => {
    const parsed = latestProgressParsed
    if (!parsed) {
      return
    }
    const rawSpeed = parsed.speed?.trim() ?? ''
    const bpsSample = parseYtdlpSpeedToBytesPerSec(rawSpeed)
    let displaySpeed: string | null = null
    if (bpsSample !== null) {
      smoothedSpeedBps =
        smoothedSpeedBps === null ? bpsSample : smoothedSpeedBps * 0.78 + bpsSample * 0.22
      displaySpeed = formatTorrentStyleSpeedFromBps(smoothedSpeedBps)
    } else if (rawSpeed.length > 0 && !/^unknown(\s+speed)?$/i.test(rawSpeed)) {
      smoothedSpeedBps = null
      displaySpeed = rawSpeed
    } else {
      smoothedSpeedBps = null
    }

    const partsForCell: YtdlpDownloadProgressParts = {
      percent: parsed.percent,
      speed: displaySpeed !== null && displaySpeed.length > 0 ? displaySpeed : null,
      eta: parsed.eta
    }
    const cell = formatYtdlpProgressCell(partsForCell, locale)
    if (cell.length === 0) {
      return
    }
    lastProgressCell = cell
    const patch: {
      progress: string
      queueSize?: string
      queueSpeed?: string
      queueEta?: string
    } = { progress: cell }
    const st = (latestSizeFromProgress ?? parsed.sizeTotal)?.trim() ?? ''
    if (st.length > 0) {
      patch.queueSize = st
    }
    if (displaySpeed !== null && displaySpeed.length > 0) {
      patch.queueSpeed = displaySpeed
    }
    const et = parsed.eta?.trim() ?? ''
    if (et.length > 0 && !/^unknown$/i.test(et)) {
      patch.queueEta = et
    }
    updateDownloadsRow(rowId, patch)
    downloadsQueueRunnerState.notifySnapshot()
    lastProgressFlushMs = Date.now()
  }

  const scheduleProgressFlush = (): void => {
    const now = Date.now()
    const due = DOWNLOADS_PROGRESS_UI_MIN_INTERVAL_MS - (now - lastProgressFlushMs)
    if (due <= 0) {
      clearProgressFlushTimer()
      flushProgressUiNow()
      return
    }
    if (progressFlushTimer !== null) {
      return
    }
    progressFlushTimer = setTimeout(() => {
      progressFlushTimer = null
      flushProgressUiNow()
    }, due)
  }

  const flushPendingProgressUI = (): void => {
    clearProgressFlushTimer()
    flushProgressUiNow()
  }

  const resetSamplingAfterRetry = (): void => {
    clearProgressFlushTimer()
    latestProgressParsed = null
    latestSizeFromProgress = undefined
    smoothedSpeedBps = null
    lastYtDlpProgressLogPercent = null
    lastYtDlpProgressLogEmittedAtMs = 0
  }

  const resetErrorStateForRetry = (): void => {
    lastStderrLine = null
    lastErrorSummary = null
  }

  const rememberStderrLine = (line: string): void => {
    const t = line.trimEnd()
    if (t.length === 0) {
      return
    }
    lastStderrLine = t.length > 400 ? `${t.slice(0, 397)}…` : t
  }

  const applyProgressLine = (line: string): void => {
    const parsed = parseYtdlpDownloadProgressLine(line, locale)
    if (!parsed) {
      return
    }
    const cellProbe = formatYtdlpProgressCell(parsed, locale)
    if (cellProbe.length === 0) {
      return
    }
    latestProgressParsed = parsed
    const st0 = parsed.sizeTotal?.trim() ?? ''
    if (st0.length > 0) {
      latestSizeFromProgress = st0
    }
    scheduleProgressFlush()
  }

  const emitStreamLineForDownloadsLog = (stream: 'stdout' | 'stderr', line: string): void => {
    const parsed = parseYtdlpDownloadProgressLine(line, locale)
    if (!parsed) {
      emitDownloadsLog({ kind: 'line', rowId, stream, text: line })
      return
    }
    const p = parseYtdlpProgressPercentNumber(parsed.percent)
    if (p === null) {
      emitDownloadsLog({ kind: 'line', rowId, stream, text: line })
      return
    }
    const now = Date.now()
    const silent = now - lastYtDlpProgressLogEmittedAtMs
    const stepOk =
      lastYtDlpProgressLogPercent === null ||
      Math.abs(p - lastYtDlpProgressLogPercent) >= DOWNLOADS_PROGRESS_LOG_MIN_PERCENT_STEP ||
      silent >= DOWNLOADS_PROGRESS_LOG_MAX_SILENCE_MS
    if (!stepOk) {
      return
    }
    lastYtDlpProgressLogPercent = p
    lastYtDlpProgressLogEmittedAtMs = now
    emitDownloadsLog({ kind: 'line', rowId, stream, text: line })
  }

  const applyQueueTitleHint = (line: string): void => {
    const title = parseYtdlpInfoDownloadingTitlePrefix(line)
    if (!title) {
      return
    }
    const row = getDownloadsQueueRowById(rowId)
    if (!row) {
      return
    }
    if (row.shortLabel !== shortUrlLabel(row.url)) {
      return
    }
    updateDownloadsRow(rowId, { shortLabel: title })
    downloadsQueueRunnerState.notifySnapshot()
  }

  const applyYtDlpQueueCellHints = (line: string): void => {
    let changed = false
    const fmt = parseYtdlpQueueFormatHint(line, locale)
    if (fmt) {
      updateDownloadsRow(rowId, { queueFmt: fmt })
      changed = true
    }
    const sz = parseYtdlpInfoQueueSizeHint(line)
    if (sz) {
      const snapRow = getDownloadsQueueRowById(rowId)
      if ((snapRow?.queueSize?.trim() ?? '').length === 0) {
        updateDownloadsRow(rowId, { queueSize: sz })
        changed = true
      }
    }
    if (changed) {
      downloadsQueueRunnerState.notifySnapshot()
    }
  }

  const noteErrorLine = (line: string): void => {
    const s = extractYtdlpErrorSummary(line)
    if (s) {
      lastErrorSummary = s
    }
  }

  const noteOutputPathLine = (line: string): void => {
    const p = extractYtdlpOutputPath(line)
    if (!p) {
      return
    }
    lastOutputPath = p
    const snapRow = getDownloadsQueueRowById(rowId)
    const nice = displayLabelFromYtdlpOutputPath(p)
    const url = snapRow?.url ?? ''
    const curShort = snapRow?.shortLabel ?? ''
    const patch: Parameters<typeof updateDownloadsRow>[1] = { outputPath: p }
    if (
      nice &&
      url.length > 0 &&
      (curShort === shortUrlLabel(url) || curShort.length < Math.min(nice.length, 14))
    ) {
      patch.shortLabel = nice
    }
    updateDownloadsRow(rowId, patch)
    downloadsQueueRunnerState.notifySnapshot()
  }

  const onYtDlpStreamLine = (stream: 'stdout' | 'stderr', line: string): void => {
    if (stream === 'stderr') {
      rememberStderrLine(line)
    }
    emitStreamLineForDownloadsLog(stream, line)
    noteErrorLine(line)
    noteOutputPathLine(line)
    applyYtDlpQueueCellHints(line)
    applyQueueTitleHint(line)
    applyProgressLine(line)
  }

  return {
    get lastProgressCell() {
      return lastProgressCell
    },
    get lastErrorSummary() {
      return lastErrorSummary
    },
    get lastOutputPath() {
      return lastOutputPath
    },
    get lastStderrLine() {
      return lastStderrLine
    },
    clearProgressFlushTimer,
    flushPendingProgressUI,
    resetSamplingAfterRetry,
    resetErrorStateForRetry,
    applyProgressLine,
    emitStreamLineForDownloadsLog,
    applyQueueTitleHint,
    applyYtDlpQueueCellHints,
    noteErrorLine,
    noteOutputPathLine,
    onYtDlpStreamLine
  }
}
