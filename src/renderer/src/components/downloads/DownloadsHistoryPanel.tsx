import type { JSX } from 'react'

import type { YtdlpDownloadHistoryEntry } from '../../../../shared/ytdlp-history-contract'
import {
  formatDownloadsHistoryOutcomeLabel,
  formatDownloadsHistoryTime,
  uiText
} from '../../locales/ui-text'

export function DownloadsHistoryPanel({
  open,
  busy,
  entries,
  totalEntries,
  outcomeFilter,
  weeklySummary,
  onToggle,
  onOutcomeFilterChange,
  onRefresh,
  onClear,
  onExportVisible,
  onRepeat,
  onOpenFile,
  onOpenFolder,
  onOpenInHandler
}: {
  open: boolean
  busy: boolean
  entries: YtdlpDownloadHistoryEntry[]
  totalEntries: number
  outcomeFilter: 'all' | YtdlpDownloadHistoryEntry['outcome']
  weeklySummary: {
    total: number
    success: number
    error: number
    cancelled: number
  }
  onToggle: (nextOpen: boolean) => void
  onOutcomeFilterChange: (next: 'all' | YtdlpDownloadHistoryEntry['outcome']) => void
  onRefresh: () => void
  onClear: () => void
  onExportVisible: () => void
  onRepeat: (url: string) => void
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
        {uiText('downloadsHistoryTitle')}
        <span>
          {entries.length}/{totalEntries}
        </span>
      </summary>
      <div
        className="app-processing-history-summary"
        aria-label={uiText('downloadsHistoryWeeklyAria')}
      >
        <span>
          {uiText('downloadsHistory7dPrefix')} {weeklySummary.total}
        </span>
        <span>
          {uiText('downloadsHistoryChipOk')} {weeklySummary.success}
        </span>
        <span>
          {uiText('downloadsHistoryChipErrors')} {weeklySummary.error}
        </span>
        <span>
          {uiText('downloadsHistoryChipCancelled')} {weeklySummary.cancelled}
        </span>
      </div>
      <div className="app-downloads-history-actions">
        <label className="app-downloads-history-filter">
          <span>{uiText('downloadsHistoryOutcomeFilterLabel')}</span>
          <select
            className="app-control"
            value={outcomeFilter}
            disabled={busy}
            onChange={(event) => {
              onOutcomeFilterChange(event.currentTarget.value as typeof outcomeFilter)
            }}
          >
            <option value="all">{uiText('downloadsHistoryFilterAll')}</option>
            <option value="success">{uiText('downloadsHistoryFilterSuccess')}</option>
            <option value="error">{uiText('downloadsHistoryFilterError')}</option>
            <option value="cancelled">{uiText('downloadsHistoryFilterCancelled')}</option>
          </select>
        </label>
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-icon-leading"
          disabled={busy}
          onClick={onRefresh}
        >
          {uiText('downloadsHistoryRefresh')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-warn app-btn-icon-leading"
          disabled={busy || entries.length === 0}
          onClick={onClear}
        >
          {uiText('downloadsHistoryClear')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-icon-leading"
          disabled={busy || entries.length === 0}
          onClick={onExportVisible}
        >
          {uiText('downloadsHistoryExportJson')}
        </button>
      </div>
      <div className="app-downloads-history-list">
        {entries.length === 0 ? (
          <p className="app-downloads-history-empty">{uiText('downloadsHistoryEmpty')}</p>
        ) : (
          entries.slice(0, 8).map((entry) => (
            <article key={entry.id} className="app-downloads-history-card">
              <div className="app-downloads-history-head">
                <strong>{entry.shortLabel}</strong>
                <span
                  className={`app-downloads-history-outcome app-downloads-history-${entry.outcome}`}
                >
                  {formatDownloadsHistoryOutcomeLabel(entry.outcome)}
                </span>
              </div>
              <p title={entry.url}>{entry.url}</p>
              <div className="app-downloads-history-meta">
                <span>{formatDownloadsHistoryTime(entry.finishedAt)}</span>
                <span>{entry.status}</span>
              </div>
              {entry.errorHint ? <p className="app-downloads-warning">{entry.errorHint}</p> : null}
              <div className="app-downloads-history-actions">
                <button
                  type="button"
                  className="app-btn app-btn-compact app-btn-icon-leading"
                  disabled={busy}
                  onClick={() => onRepeat(entry.url)}
                >
                  {uiText('downloadsHistoryRepeat')}
                </button>
              </div>
              {entry.outputPath ? (
                <div className="app-downloads-history-actions">
                  <button
                    type="button"
                    className="app-btn app-btn-compact app-btn-icon-leading"
                    onClick={() => onOpenFile(entry.id)}
                  >
                    {uiText('downloadsHistoryOpenFile')}
                  </button>
                  <button
                    type="button"
                    className="app-btn app-btn-compact app-btn-icon-leading"
                    onClick={() => onOpenFolder(entry.id)}
                  >
                    {uiText('downloadsHistoryOpenFolder')}
                  </button>
                  <button
                    type="button"
                    className="app-btn app-btn-compact app-btn-icon-leading"
                    onClick={() => onOpenInHandler(entry.id)}
                  >
                    {uiText('downloadsHistoryOpenInEditor')}
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
