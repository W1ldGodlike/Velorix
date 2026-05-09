import type { AppPaths } from './app-paths'
import { resolveAppPaths } from './app-paths'
import { getEnginePathOverridesSnapshot } from './engine-path-sync'
import {
  findFirstWaitingRow,
  getDownloadsQueueRowById,
  updateDownloadsRow,
  type DownloadsQueueRow
} from './downloads-queue'
import { emitDownloadsLog } from './downloads-log-ipc'
import {
  extractYtdlpErrorSummary,
  extractYtdlpOutputPath,
  formatYtdlpProgressCell,
  formatYtdlpQueueFailureStatus,
  parseYtdlpDownloadProgressLine,
  runYtdlpOnce
} from './ytdlp-download-service'
import { resolveYtdlpOutputDirectory } from './ytdlp-download-output'
import { appendYtdlpDownloadHistoryEntry, outcomeFromQueueStatus } from './ytdlp-download-history'
import { resolveYtdlpQueueRetryPlan } from './ytdlp-queue-retry'
import { getYtdlpRunOptionsSnapshot } from './ytdlp-run-options-sync'

let activeAbort: AbortController | null = null
let sequentialBusy = false

let notifySnapshot = (): void => {}

/** Вызывается из downloads-window: обновить UI после изменений очереди/прогресса. */
export function setDownloadsRunnerNotifier(fn: () => void): void {
  notifySnapshot = fn
}

export function cancelDownloadsRunner(): void {
  activeAbort?.abort()
}

export function isDownloadsRunnerBusy(): boolean {
  return sequentialBusy
}

function isAbort(e: unknown): boolean {
  return e instanceof Error && e.name === 'AbortError'
}

function abortErr(): Error {
  const e = new Error('Отменено')
  e.name = 'AbortError'
  return e
}

/** Пауза между повторами §6.4; отмена — тем же `AbortSignal`, что и у текущей загрузки. */
function delayWithAbort(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(abortErr())
      return
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    const onAbort = (): void => {
      clearTimeout(timer)
      signal.removeEventListener('abort', onAbort)
      reject(abortErr())
    }
    signal.addEventListener('abort', onAbort, { once: true })
  })
}

async function runYtdlpForWaitingRow(
  paths: AppPaths,
  outputDir: string,
  rowId: number
): Promise<void> {
  const snap = getDownloadsQueueRowById(rowId)
  if (!snap || snap.status !== 'Ожидание') {
    return
  }

  const rowUrl = snap.url
  const startedAtMs = Date.now()
  /** Запись в history.json только после реального запуска yt-dlp (не только смена статуса в UI). */
  let shouldRecordHistory = false
  let finalExitCode: number | null = null

  activeAbort = new AbortController()
  const signal = activeAbort.signal

  updateDownloadsRow(rowId, { status: 'Загрузка…', progress: '…' })
  notifySnapshot()

  emitDownloadsLog({ kind: 'reset', rowId })

  let lastProgressCell: string | null = null
  let lastErrorSummary: string | null = null
  let lastOutputPath: string | null = snap.outputPath ?? null
  let lastStderrLine: string | null = null

  const rememberStderrLine = (line: string): void => {
    const t = line.trimEnd()
    if (t.length === 0) {
      return
    }
    lastStderrLine = t.length > 400 ? `${t.slice(0, 397)}…` : t
  }

  const applyProgressLine = (line: string): void => {
    const parsed = parseYtdlpDownloadProgressLine(line)
    if (!parsed) {
      return
    }
    const cell = formatYtdlpProgressCell(parsed)
    if (cell.length === 0) {
      return
    }
    lastProgressCell = cell
    updateDownloadsRow(rowId, { progress: cell })
    notifySnapshot()
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
    updateDownloadsRow(rowId, { outputPath: p })
    notifySnapshot()
  }

  const cli = getYtdlpRunOptionsSnapshot()
  const retryPlan = resolveYtdlpQueueRetryPlan(cli.queueRetryProfile)
  const maxRuns = 1 + retryPlan.extraAttempts

  try {
    for (let runIndex = 0; runIndex < maxRuns; runIndex++) {
      lastStderrLine = null
      lastErrorSummary = null
      if (runIndex > 0) {
        const delayMs = retryPlan.delaysMs[runIndex - 1] ?? 2000
        const sec = Math.round(delayMs / 100) / 10
        emitDownloadsLog({
          kind: 'line',
          rowId,
          stream: 'stderr',
          text: `[FluxAlloy] Повтор ${runIndex}/${retryPlan.extraAttempts} через ${sec} с…`
        })
        updateDownloadsRow(rowId, {
          status: `Пауза перед повтором (${runIndex}/${retryPlan.extraAttempts})…`,
          progress: lastProgressCell ?? '—'
        })
        notifySnapshot()
        try {
          await delayWithAbort(delayMs, signal)
        } catch {
          updateDownloadsRow(rowId, {
            status: 'Отменено',
            progress: lastProgressCell ?? '—'
          })
          break
        }
        updateDownloadsRow(rowId, { status: 'Загрузка…', progress: '…' })
        notifySnapshot()
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
              emitDownloadsLog({ kind: 'line', rowId, stream: 'stdout', text: line })
              noteErrorLine(line)
              noteOutputPathLine(line)
              applyProgressLine(line)
            },
            onStderrLine: (line) => {
              rememberStderrLine(line)
              emitDownloadsLog({ kind: 'line', rowId, stream: 'stderr', text: line })
              noteErrorLine(line)
              noteOutputPathLine(line)
              applyProgressLine(line)
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
            impersonateTarget: cli.impersonateTarget,
            rateLimit: cli.rateLimit,
            retries: cli.retries,
            fragmentRetries: cli.fragmentRetries,
            extraArgs: cli.extraArgs
          }
        )
      } catch (e) {
        const aborted = isAbort(e)
        const msg = e instanceof Error ? e.message : String(e)
        updateDownloadsRow(rowId, {
          status: aborted ? 'Отменено' : `Ошибка: ${msg.slice(0, 140)}`,
          progress: lastProgressCell ?? '—'
        })
        finalExitCode = null
        break
      }

      finalExitCode = result.exitCode

      if (result.exitCode === 0) {
        updateDownloadsRow(rowId, {
          status: 'Готово',
          progress: lastProgressCell ?? '100%'
        })
        break
      }

      const code = result.exitCode
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: `[FluxAlloy] Попытка ${runIndex + 1}/${maxRuns} завершилась с кодом ${code ?? '?'}.`
      })

      if (runIndex >= maxRuns - 1) {
        updateDownloadsRow(rowId, {
          status: formatYtdlpQueueFailureStatus(
            code,
            result.signal,
            lastErrorSummary,
            lastStderrLine
          ),
          progress: lastProgressCell ?? '—'
        })
        break
      }
    }
  } finally {
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
          errorHint: lastErrorSummary,
          outputPath: finalRow.outputPath ?? lastOutputPath
        })
      }
    }
    activeAbort = null
    notifySnapshot()
  }
}

/**
 * Последовательно обрабатывает строки со статусом «Ожидание». Отмена — через cancelDownloadsRunner().
 */
export async function startDownloadsSequential(): Promise<void> {
  if (sequentialBusy) {
    return
  }
  sequentialBusy = true

  const paths = resolveAppPaths()
  const outputDir = resolveYtdlpOutputDirectory(paths.userData)

  try {
    let row: DownloadsQueueRow | undefined
    while ((row = findFirstWaitingRow())) {
      await runYtdlpForWaitingRow(paths, outputDir, row.id)
    }
  } finally {
    sequentialBusy = false
    notifySnapshot()
  }
}

/**
 * Одна строка «Ожидание» без продолжения остальной очереди §6.1.
 * Пока yt-dlp последовательный, занятость runner общая с «Старт очереди».
 */
export async function startDownloadSingleRow(
  rowId: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (sequentialBusy) {
    return {
      ok: false,
      error: 'Уже выполняется загрузка. Отмените текущую или дождитесь окончания.'
    }
  }
  const snap = getDownloadsQueueRowById(rowId)
  if (!snap) {
    return { ok: false, error: 'Строка не найдена' }
  }
  if (snap.status !== 'Ожидание') {
    return { ok: false, error: 'Старт доступен только для строк со статусом «Ожидание».' }
  }

  sequentialBusy = true
  const paths = resolveAppPaths()
  const outputDir = resolveYtdlpOutputDirectory(paths.userData)

  try {
    await runYtdlpForWaitingRow(paths, outputDir, rowId)
  } finally {
    sequentialBusy = false
    notifySnapshot()
  }

  return { ok: true }
}
