import { useEffect, useState, type JSX } from 'react'

import type { FfmpegExportBatchSnapshot } from '../../../../shared/ffmpeg-export-batch-contract'
import type { FfmpegExportProgressPayload } from '../../../../shared/ffmpeg-export-contract'
import type { ProcessingHistoryEntry } from '../../../../shared/processing-history-contract'

import {
  batchExportCanCancel,
  batchExportCanRetryFailed,
  batchExportCanStart,
  batchExportHasCompleted,
  formatBatchExportSummary
} from '../../lib/format-batch-export-summary'
import {
  isDownloadsRowComplete,
  parseDownloadsProgressPercent
} from '../../lib/parse-downloads-queue-row'
import { useAppShellStore } from '../../stores/app-shell-store'
import { useDownloadsQueue } from '../downloads/use-downloads-queue'

export function ProcessingDownloadsPeek(props: { onOpenFull: () => void }): JSX.Element {
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const rows = useDownloadsQueue().slice(0, 5)
  return (
    <section className="processing-screen__peek vn-surface-glass">
      <h2 className="processing-screen__peek-title">Очередь загрузок</h2>
      <ul className="processing-screen__peek-list">
        {rows.length === 0 ? (
          <li>Очередь пуста</li>
        ) : (
          rows.map((row) => {
            const pct = parseDownloadsProgressPercent(row.progress)
            const suffix = pct > 0 ? ` · ${String(pct)}%` : ''
            const rowComplete = isDownloadsRowComplete(row.status)
            return (
              <li key={row.id} className="processing-screen__peek-history-row">
                <span>
                  {row.shortLabel}
                  {suffix} · {row.status}
                </span>
                {rowComplete ? (
                  <>
                    <button
                      type="button"
                      className="app-btn app-btn-secondary"
                      onClick={() => {
                        void window.velorix?.downloads?.openQueueOutput(row.id, 'file')
                      }}
                    >
                      Открыть
                    </button>
                    <button
                      type="button"
                      className="app-btn"
                      onClick={() => {
                        void window.velorix?.downloads?.openQueueOutput(row.id, 'folder')
                      }}
                    >
                      Папка
                    </button>
                  </>
                ) : null}
              </li>
            )
          })
        )}
      </ul>
      <div className="processing-screen__peek-actions">
        <button type="button" className="app-btn app-btn-secondary" onClick={props.onOpenFull}>
          Открыть загрузки
        </button>
        <button
          type="button"
          className="app-btn"
          onClick={() => {
            void window.velorix?.batchExport?.addFromDownloadsDone().then((result) => {
              if (result.ok) {
                setWorkspaceTab('processing')
              }
            })
          }}
        >
          Готовые → пакет
        </button>
      </div>
    </section>
  )
}

export function ProcessingBatchPeek(): JSX.Element {
  const [summary, setSummary] = useState('Пакетная очередь…')
  const [snapshot, setSnapshot] = useState<FfmpegExportBatchSnapshot | null>(null)
  const [startBusy, setStartBusy] = useState(false)

  function applySnapshot(snap: FfmpegExportBatchSnapshot): void {
    setSnapshot(snap)
    setSummary(formatBatchExportSummary(snap))
  }

  useEffect(() => {
    let cancelled = false
    async function load(): Promise<void> {
      const get = window.velorix?.batchExport?.getSnapshot
      if (get == null) {
        if (!cancelled) {
          setSummary('batchExport.getSnapshot недоступен')
        }
        return
      }
      const snap = await get()
      if (!cancelled) {
        applySnapshot(snap)
      }
    }
    void load()
    const onSnapshot = window.velorix?.batchExport?.onSnapshot
    const unsub = onSnapshot?.((snap: FfmpegExportBatchSnapshot) => {
      applySnapshot(snap)
    })
    return () => {
      cancelled = true
      unsub?.()
    }
  }, [])

  const canStart = snapshot != null && batchExportCanStart(snapshot)
  const canCancel = snapshot != null && batchExportCanCancel(snapshot)
  const canClearDone = snapshot != null && batchExportHasCompleted(snapshot)
  const canRetryFailed = snapshot != null && batchExportCanRetryFailed(snapshot)

  return (
    <section className="processing-screen__peek vn-surface-glass">
      <h2 className="processing-screen__peek-title">Пакетный экспорт</h2>
      <p className="processing-screen__peek-summary">{summary}</p>
      <div className="processing-screen__peek-actions">
        <button
          type="button"
          className="app-btn app-btn-primary"
          disabled={!canStart || startBusy}
          onClick={() => {
            const start = window.velorix?.batchExport?.start
            if (start == null) {
              return
            }
            setStartBusy(true)
            void start().finally(() => {
              setStartBusy(false)
            })
          }}
        >
          {startBusy ? 'Запуск…' : 'Запустить пакет'}
        </button>
        <button
          type="button"
          className="app-btn app-btn-secondary"
          disabled={!canCancel}
          onClick={() => void window.velorix?.batchExport?.cancel?.()}
        >
          Отменить
        </button>
        <button
          type="button"
          className="app-btn"
          disabled={!canClearDone}
          onClick={() => void window.velorix?.batchExport?.clearCompleted?.()}
        >
          Очистить готовые
        </button>
        <button
          type="button"
          className="app-btn app-btn-secondary"
          disabled={!canRetryFailed || startBusy}
          onClick={() => {
            const retry = window.velorix?.batchExport?.retryFailed
            if (retry == null) {
              return
            }
            setStartBusy(true)
            void retry().finally(() => {
              setStartBusy(false)
            })
          }}
        >
          Повтор ошибок
        </button>
      </div>
    </section>
  )
}

export function ProcessingHistoryPeek(): JSX.Element {
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const [entries, setEntries] = useState<ProcessingHistoryEntry[]>([])

  useEffect(() => {
    let cancelled = false
    async function load(): Promise<void> {
      const get = window.velorix?.processingHistory?.get
      if (get == null) {
        return
      }
      const rows = await get({ limit: 6 })
      if (!cancelled) {
        setEntries(rows)
      }
    }
    void load()
    const onChanged = window.velorix?.onProcessingHistoryChanged
    const unsub = onChanged?.(() => {
      void load()
    })
    return () => {
      cancelled = true
      unsub?.()
    }
  }, [])

  return (
    <section className="processing-screen__peek vn-surface-glass">
      <h2 className="processing-screen__peek-title">Журнал обработки</h2>
      <ul className="processing-screen__peek-list">
        {entries.length === 0 ? (
          <li>Записей экспорта пока нет</li>
        ) : (
          entries.map((entry) => (
            <li key={entry.id} className="processing-screen__peek-history-row">
              <span>
                {entry.status}
                {entry.outcome === 'error' && entry.errorHint != null
                  ? ` · ${entry.errorHint}`
                  : ''}
              </span>
              {entry.outcome === 'success' && entry.outputPath != null ? (
                <>
                  <button
                    type="button"
                    className="app-btn app-btn-secondary"
                    onClick={() => {
                      void window.velorix?.processingHistory?.openOutput(entry.id, 'file')
                    }}
                  >
                    Открыть
                  </button>
                  <button
                    type="button"
                    className="app-btn app-btn-secondary"
                    onClick={() => {
                      void window.velorix?.processingHistory?.openOutput(entry.id, 'folder')
                    }}
                  >
                    Папка
                  </button>
                  <button
                    type="button"
                    className="app-btn"
                    onClick={() => {
                      void window.velorix?.batchExport
                        ?.addFromHistoryInputs([entry.id])
                        .then((result) => {
                          if (result.ok) {
                            setWorkspaceTab('processing')
                          }
                        })
                    }}
                  >
                    В пакет
                  </button>
                </>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </section>
  )
}

export function ProcessingTerminalPeek(props: { onOpenFull: () => void }): JSX.Element {
  const [lines, setLines] = useState<string[]>(['Ожидание FFmpeg…'])

  useEffect(() => {
    const subscribe = window.velorix?.export?.onProgress
    if (subscribe == null) {
      return
    }
    return subscribe((payload: FfmpegExportProgressPayload) => {
      const line =
        payload.percent >= 0 ? `${String(payload.percent)}% · ${payload.message}` : payload.message
      setLines((prev) => [...prev, line].slice(-6))
    })
  }, [])

  return (
    <section className="processing-screen__peek vn-surface-glass processing-screen__peek--terminal">
      <h2 className="processing-screen__peek-title">FFmpeg log</h2>
      <pre className="processing-screen__peek-log">
        {lines.map((line, index) => (
          <code key={`${index}-${line.slice(0, 16)}`}>{line}</code>
        ))}
      </pre>
      <button type="button" className="app-btn app-btn-primary" onClick={props.onOpenFull}>
        Открыть терминал
      </button>
    </section>
  )
}
