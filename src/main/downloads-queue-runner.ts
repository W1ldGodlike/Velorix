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
import { extractDownloadPercent, runYtdlpOnce } from './ytdlp-download-service'
import { resolveYtdlpOutputDirectory } from './ytdlp-download-output'

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

  activeAbort = new AbortController()
  const signal = activeAbort.signal

  updateDownloadsRow(rowId, { status: 'Загрузка…', progress: '…' })
  notifySnapshot()

  emitDownloadsLog({ kind: 'reset', rowId })

  let lastPct: string | null = null

  try {
    const result = await runYtdlpOnce(
      paths,
      rowUrl,
      outputDir,
      signal,
      {
        onStdoutLine: (line) => {
          emitDownloadsLog({ kind: 'line', rowId, stream: 'stdout', text: line })
        },
        onStderrLine: (line) => {
          emitDownloadsLog({ kind: 'line', rowId, stream: 'stderr', text: line })
          const pct = extractDownloadPercent(line)
          if (pct) {
            lastPct = pct
            updateDownloadsRow(rowId, { progress: pct })
            notifySnapshot()
          }
        }
      },
      getEnginePathOverridesSnapshot()
    )

    if (result.exitCode !== 0) {
      updateDownloadsRow(rowId, {
        status: `Ошибка (код ${result.exitCode ?? '?'})`,
        progress: lastPct ?? '—'
      })
    } else {
      updateDownloadsRow(rowId, { status: 'Готово', progress: lastPct ?? '100%' })
    }
  } catch (e) {
    const aborted = isAbort(e)
    const msg = e instanceof Error ? e.message : String(e)
    updateDownloadsRow(rowId, {
      status: aborted ? 'Отменено' : `Ошибка: ${msg.slice(0, 140)}`,
      progress: lastPct ?? '—'
    })
  } finally {
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
