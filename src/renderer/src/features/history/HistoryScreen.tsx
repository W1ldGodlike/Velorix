import { useEffect, useState, type JSX } from 'react'

import type {
  YtdlpDownloadHistoryEntry,
  YtdlpDownloadHistoryWeeklySummary
} from '../../../../shared/ytdlp-history-contract'
import { VELORIX_NEON_REFERENCE_HISTORY_REL } from '../../../../shared/velorix-neon-theme-tokens'

function formatWhen(ts: number): string {
  return new Date(ts).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

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
        {entries.length === 0 ? (
          <p className="history-screen__empty vn-surface-glass">Записей загрузок пока нет.</p>
        ) : (
          entries.map((event) => (
            <article key={event.id} className="history-event vn-surface-glass">
              <span
                className={`app-ui-showcase-status-pill app-ui-showcase-status-pill--${outcomeTone(event.outcome)}`}
              >
                {event.status}
              </span>
              <strong>{event.shortLabel}</strong>
              <span className="history-event__when">{formatWhen(event.finishedAt)}</span>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

export function HistoryRail(): JSX.Element {
  const [summary, setSummary] = useState<YtdlpDownloadHistoryWeeklySummary | null>(null)

  useEffect(() => {
    void (async () => {
      const getSummary = window.velorix?.downloads?.getHistoryWeeklySummary
      if (getSummary == null) {
        return
      }
      const data = await getSummary()
      setSummary(data)
    })()
  }, [])

  return (
    <aside className="history-rail vn-surface-glass">
      <h2 className="history-rail__title">Аналитика</h2>
      <ul className="history-rail__stats">
        <li>
          <span>Всего за неделю</span>
          <strong>{summary?.total ?? '—'}</strong>
        </li>
        <li>
          <span>Успешно</span>
          <strong>{summary?.success ?? '—'}</strong>
        </li>
        <li>
          <span>Ошибок</span>
          <strong>{summary?.error ?? '—'}</strong>
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
