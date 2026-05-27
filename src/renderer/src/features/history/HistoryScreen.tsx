import { useEffect, useState, type JSX } from 'react'

import type { ProcessingHistoryWeeklySummary } from '../../../../shared/processing-history-contract'
import type {
  YtdlpDownloadHistoryEntry,
  YtdlpDownloadHistoryWeeklySummary
} from '../../../../shared/ytdlp-history-contract'
import { VELORIX_NEON_REFERENCE_HISTORY_REL } from '../../../../shared/velorix-neon-theme-tokens'

import { formatHistoryTimestamp } from '../../lib/format-history-timestamp'
import { ProcessingHistoryFeed } from './ProcessingHistoryFeed'

function outcomeTone(outcome: YtdlpDownloadHistoryEntry['outcome']): 'ready' | 'info' | 'error' {
  if (outcome === 'success') {
    return 'ready'
  }
  if (outcome === 'error') {
    return 'error'
  }
  return 'info'
}

export function HistoryScreen(): JSX.Element {
  const [entries, setEntries] = useState<YtdlpDownloadHistoryEntry[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      const getHistory = window.velorix?.downloads?.getHistory
      if (getHistory == null) {
        setLoadError('downloads.getHistory недоступен')
        return
      }
      try {
        const rows = await getHistory()
        setEntries(rows)
      } catch {
        setLoadError('Не удалось загрузить историю')
      }
    })()
  }, [])

  return (
    <div className="history-screen">
      <header className="history-screen__head">
        <h1 className="history-screen__title">История</h1>
        <p className="history-screen__subtitle">Эталон: {VELORIX_NEON_REFERENCE_HISTORY_REL}</p>
      </header>
      {loadError != null ? <p className="history-screen__error">{loadError}</p> : null}
      <div className="history-screen__feed">
        <section className="history-screen__section">
          <h2 className="history-screen__section-title">Журнал обработки (FFmpeg)</h2>
          <ProcessingHistoryFeed />
        </section>
        <section className="history-screen__section">
          <h2 className="history-screen__section-title">История загрузок (yt-dlp)</h2>
          {entries.length === 0 ? (
            <p className="history-screen__empty vn-surface-glass">Записей загрузок пока нет.</p>
          ) : (
            <div className="history-screen__section-list">
              {entries.map((event) => (
                <article key={event.id} className="history-event vn-surface-glass">
                  <span
                    className={`app-ui-showcase-status-pill app-ui-showcase-status-pill--${outcomeTone(event.outcome)}`}
                  >
                    {event.status}
                  </span>
                  <strong>{event.shortLabel}</strong>
                  <span className="history-event__when">
                    {formatHistoryTimestamp(event.finishedAt)}
                  </span>
                  {event.outcome === 'success' ? (
                    <div className="history-event__actions">
                      <button
                        type="button"
                        className="app-btn app-btn-secondary"
                        onClick={() => {
                          void window.velorix?.downloads?.openHistoryOutput(event.id, 'file')
                        }}
                      >
                        Открыть
                      </button>
                      <button
                        type="button"
                        className="app-btn"
                        onClick={() => {
                          void window.velorix?.downloads?.openHistoryOutput(event.id, 'folder')
                        }}
                      >
                        Папка
                      </button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export function HistoryRail(): JSX.Element {
  const [downloadSummary, setDownloadSummary] = useState<YtdlpDownloadHistoryWeeklySummary | null>(
    null
  )
  const [processingSummary, setProcessingSummary] = useState<ProcessingHistoryWeeklySummary | null>(
    null
  )

  useEffect(() => {
    let cancelled = false
    async function load(): Promise<void> {
      const getDownloads = window.velorix?.downloads?.getHistoryWeeklySummary
      const getProcessing = window.velorix?.processingHistory?.weeklySummary
      if (getDownloads != null) {
        const data = await getDownloads()
        if (!cancelled) {
          setDownloadSummary(data)
        }
      }
      if (getProcessing != null) {
        const data = await getProcessing()
        if (!cancelled) {
          setProcessingSummary(data)
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

  return (
    <aside className="history-rail vn-surface-glass">
      <h2 className="history-rail__title">Аналитика</h2>
      <p className="history-rail__group-label">Обработка (неделя)</p>
      <ul className="history-rail__stats">
        <li>
          <span>Экспортов</span>
          <strong>{processingSummary?.total ?? '—'}</strong>
        </li>
        <li>
          <span>Успешно</span>
          <strong>{processingSummary?.success ?? '—'}</strong>
        </li>
        <li>
          <span>Ошибок</span>
          <strong>{processingSummary?.error ?? '—'}</strong>
        </li>
      </ul>
      <p className="history-rail__group-label">Загрузки (неделя)</p>
      <ul className="history-rail__stats">
        <li>
          <span>Всего</span>
          <strong>{downloadSummary?.total ?? '—'}</strong>
        </li>
        <li>
          <span>Успешно</span>
          <strong>{downloadSummary?.success ?? '—'}</strong>
        </li>
        <li>
          <span>Ошибок</span>
          <strong>{downloadSummary?.error ?? '—'}</strong>
        </li>
      </ul>
      <div className="app-ui-showcase-sparkline" aria-hidden>
        <span style={{ height: '30%' }} />
        <span style={{ height: '65%' }} />
        <span style={{ height: '45%' }} />
        <span style={{ height: '90%' }} />
        <span style={{ height: '50%' }} />
      </div>
    </aside>
  )
}
