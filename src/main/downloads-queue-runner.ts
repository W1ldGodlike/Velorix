import { join } from 'path'

import { resolveAppPaths } from './app-paths'
import { getEnginePathOverridesSnapshot } from './engine-path-sync'
import { findFirstWaitingRow, updateDownloadsRow, type DownloadsQueueRow } from './downloads-queue'
import { extractDownloadPercent, runYtdlpOnce } from './ytdlp-download-service'

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

/**
 * Последовательно обрабатывает строки со статусом «Ожидание». Отмена — через cancelDownloadsRunner().
 */
export async function startDownloadsSequential(): Promise<void> {
  if (sequentialBusy) {
    return
  }
  sequentialBusy = true

  const paths = resolveAppPaths()
  const outputDir = join(paths.userData, 'downloads', 'ytdlp')

  try {
    let row: DownloadsQueueRow | undefined
    while ((row = findFirstWaitingRow())) {
      const rowId = row.id
      const rowUrl = row.url

      activeAbort = new AbortController()
      const signal = activeAbort.signal

      updateDownloadsRow(rowId, { status: 'Загрузка…', progress: '…' })
      notifySnapshot()

      let lastPct: string | null = null

      try {
        const result = await runYtdlpOnce(
          paths,
          rowUrl,
          outputDir,
          signal,
          {
            onStderrLine: (line) => {
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
  } finally {
    sequentialBusy = false
    notifySnapshot()
  }
}
