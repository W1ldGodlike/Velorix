import { useEffect, useState, type JSX } from 'react'

import type {
  ProcessingHistoryEntry,
  ProcessingHistoryOutcome
} from '../../../../shared/processing-history-contract'

import { formatHistoryTimestamp } from '../../lib/format-history-timestamp'
import { useAppShellStore } from '../../stores/app-shell-store'

function outcomeTone(outcome: ProcessingHistoryOutcome): 'ready' | 'info' | 'error' {
  if (outcome === 'success') {
    return 'ready'
  }
  if (outcome === 'error') {
    return 'error'
  }
  return 'info'
}

/** ref.3 — лента журнала FFmpeg/экспорта (`processingHistory`). */
export function ProcessingHistoryFeed(): JSX.Element {
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const [entries, setEntries] = useState<ProcessingHistoryEntry[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load(): Promise<void> {
      const get = window.velorix?.processingHistory?.get
      if (get == null) {
        if (!cancelled) {
          setLoadError('processingHistory.get недоступен')
        }
        return
      }
      try {
        const rows = await get({ limit: 40 })
        if (!cancelled) {
          setEntries(rows)
          setLoadError(null)
        }
      } catch {
        if (!cancelled) {
          setLoadError('Не удалось загрузить журнал обработки')
        }
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

  if (loadError != null) {
    return <p className="history-screen__error">{loadError}</p>
  }

  if (entries.length === 0) {
    return <p className="history-screen__empty vn-surface-glass">Записей экспорта пока нет.</p>
  }

  return (
    <>
      {entries.map((event) => (
        <article key={event.id} className="history-event vn-surface-glass">
          <span
            className={`app-ui-showcase-status-pill app-ui-showcase-status-pill--${outcomeTone(event.outcome)}`}
          >
            {event.status}
          </span>
          <strong>{event.inputPath.split(/[/\\]/).pop() ?? event.inputPath}</strong>
          <span className="history-event__when">{formatHistoryTimestamp(event.finishedAt)}</span>
          <div className="history-event__actions">
            <button
              type="button"
              className="app-btn app-btn-secondary"
              onClick={() => {
                void window.velorix?.processingHistory
                  ?.openInputInHandler(event.id)
                  .then((result) => {
                    if (result?.ok) {
                      setWorkspaceTab('processing')
                    }
                  })
              }}
            >
              Исходник
            </button>
            {event.outcome === 'success' ? (
              <>
                <button
                  type="button"
                  className="app-btn app-btn-secondary"
                  onClick={() => {
                    void window.velorix?.processingHistory?.openOutput(event.id, 'file')
                  }}
                >
                  Открыть
                </button>
                <button
                  type="button"
                  className="app-btn"
                  onClick={() => {
                    void window.velorix?.processingHistory?.openOutput(event.id, 'folder')
                  }}
                >
                  Папка
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-secondary"
                  onClick={() => {
                    void window.velorix?.batchExport
                      ?.addFromHistoryInputs([event.id])
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
            {event.kind === 'workflowScenario' && event.workflowScenarioId != null ? (
              <button
                type="button"
                className="app-btn app-btn-secondary"
                onClick={() => {
                  void window.velorix?.processingHistory?.repeatWorkflowScenario(event.id)
                }}
              >
                Повторить сценарий
              </button>
            ) : null}
          </div>
        </article>
      ))}
    </>
  )
}
