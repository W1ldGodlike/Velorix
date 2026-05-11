import type { JSX } from 'react'

import type { YtdlpDownloadHistoryEntry } from '../../../../shared/ytdlp-history-contract'

export function DownloadsHistoryPanel({
  open,
  busy,
  entries,
  onToggle,
  onRefresh,
  onClear,
  formatTimeLabel,
  outcomeLabel,
  onOpenFile,
  onOpenFolder,
  onOpenInHandler
}: {
  open: boolean
  busy: boolean
  entries: YtdlpDownloadHistoryEntry[]
  onToggle: (nextOpen: boolean) => void
  onRefresh: () => void
  onClear: () => void
  formatTimeLabel: (ms: number) => string
  outcomeLabel: (outcome: YtdlpDownloadHistoryEntry['outcome']) => string
  onOpenFile: (id: string) => void
  onOpenFolder: (id: string) => void
  onOpenInHandler: (id: string) => void
}): JSX.Element {
  return (
    <details
      className="app-downloads-history-panel"
      open={open}
      onToggle={(event) => {
        onToggle(event.currentTarget.open)
      }}
    >
      <summary>
        История
        <span>{entries.length}</span>
      </summary>
      <div className="app-downloads-history-actions">
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-icon-leading"
          disabled={busy}
          onClick={onRefresh}
        >
          Обновить
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-warn app-btn-icon-leading"
          disabled={busy || entries.length === 0}
          onClick={onClear}
        >
          Очистить
        </button>
      </div>
      <div className="app-downloads-history-list">
        {entries.length === 0 ? (
          <p className="app-downloads-history-empty">
            История пока пуста. После завершения строк здесь появятся последние результаты.
          </p>
        ) : (
          entries.slice(0, 8).map((entry) => (
            <article key={entry.id} className="app-downloads-history-card">
              <div className="app-downloads-history-head">
                <strong>{entry.shortLabel}</strong>
                <span
                  className={`app-downloads-history-outcome app-downloads-history-${entry.outcome}`}
                >
                  {outcomeLabel(entry.outcome)}
                </span>
              </div>
              <p title={entry.url}>{entry.url}</p>
              <div className="app-downloads-history-meta">
                <span>{formatTimeLabel(entry.finishedAt)}</span>
                <span>{entry.status}</span>
              </div>
              {entry.errorHint ? <p className="app-downloads-warning">{entry.errorHint}</p> : null}
              {entry.outputPath ? (
                <div className="app-downloads-history-actions">
                  <button
                    type="button"
                    className="app-btn app-btn-compact app-btn-icon-leading"
                    onClick={() => onOpenFile(entry.id)}
                  >
                    Файл
                  </button>
                  <button
                    type="button"
                    className="app-btn app-btn-compact app-btn-icon-leading"
                    onClick={() => onOpenFolder(entry.id)}
                  >
                    Папка
                  </button>
                  <button
                    type="button"
                    className="app-btn app-btn-compact app-btn-icon-leading"
                    onClick={() => onOpenInHandler(entry.id)}
                  >
                    В редактор
                  </button>
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </details>
  )
}

