import { useId, type JSX } from 'react'

import type { YtdlpDownloadHistoryEntry } from '../../../../shared/ytdlp-history-contract'
import {
  formatDownloadsHistoryOutcomeLabel,
  formatDownloadsHistoryTime,
  uiText,
  uiTextVars
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
  onRepeat
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
}): JSX.Element {
  const downloadsHistoryOutcomeFilterId = useId()
  return (
    <details
      className="app-downloads-history-panel"
      open={open}
      aria-busy={busy}
      aria-label={uiText('downloadsHistoryDetailsAria')}
      aria-describedby="downloads-page-hint"
      onToggle={(event) => {
        onToggle(event.currentTarget.open)
      }}
    >
      <summary aria-describedby="downloads-page-hint">
        {uiText('downloadsHistoryTitle')}
        <span>
          {entries.length}/{totalEntries}
        </span>
      </summary>
      <div
        className="app-processing-history-summary"
        role="region"
        aria-label={uiText('downloadsHistoryWeeklyAria')}
        aria-describedby="downloads-page-hint"
        aria-busy={busy}
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
      <div
        className="app-downloads-history-actions"
        role="toolbar"
        aria-orientation="horizontal"
        aria-label={uiText('downloadsHistoryActionsToolbarAria')}
        aria-describedby="downloads-page-hint"
        aria-busy={busy}
      >
        <div className="app-downloads-history-filter">
          <label htmlFor={downloadsHistoryOutcomeFilterId}>
            {uiText('downloadsHistoryOutcomeFilterLabel')}
          </label>
          <select
            id={downloadsHistoryOutcomeFilterId}
            className="app-control"
            value={outcomeFilter}
            aria-describedby="downloads-page-hint"
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
        </div>
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-icon-leading"
          aria-describedby="downloads-page-hint"
          disabled={busy}
          onClick={onRefresh}
        >
          {uiText('downloadsHistoryRefresh')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-warn app-btn-icon-leading"
          aria-describedby="downloads-page-hint"
          disabled={busy || entries.length === 0}
          onClick={onClear}
        >
          {uiText('downloadsHistoryClear')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-icon-leading"
          aria-describedby="downloads-page-hint"
          disabled={busy || entries.length === 0}
          onClick={onExportVisible}
        >
          {uiText('downloadsHistoryExportJson')}
        </button>
      </div>
      <div
        className="app-downloads-history-list"
        role="region"
        aria-label={uiText('downloadsHistoryListRegionAria')}
        aria-describedby="downloads-page-hint"
        aria-busy={busy}
      >
        {entries.length === 0 ? (
          <p
            className="app-downloads-history-empty"
            role="status"
            aria-describedby="downloads-page-hint"
          >
            {uiText('downloadsHistoryEmpty')}
          </p>
        ) : (
          entries.slice(0, 8).map((entry, idx) => (
            <article
              key={entry.id}
              className="app-downloads-history-card"
              aria-label={uiTextVars('downloadsHistoryCardArticleAriaTemplate', {
                index: idx + 1,
                title: entry.shortLabel
              })}
              aria-describedby="downloads-page-hint"
              aria-busy={busy}
            >
              <div className="app-downloads-history-head">
                <strong>{entry.shortLabel}</strong>
                <div
                  className="app-downloads-history-head-trailing"
                  role="toolbar"
                  aria-orientation="horizontal"
                  aria-label={uiTextVars('downloadsHistoryCardToolbarAriaTemplate', {
                    title: entry.shortLabel
                  })}
                  aria-describedby="downloads-page-hint"
                  aria-busy={busy}
                >
                  <span
                    className={`app-downloads-history-outcome app-downloads-history-${entry.outcome}`}
                  >
                    {formatDownloadsHistoryOutcomeLabel(entry.outcome)}
                  </span>
                  <button
                    type="button"
                    className="app-btn app-btn-compact app-btn-icon-leading"
                    aria-describedby="downloads-page-hint"
                    disabled={busy}
                    onClick={() => onRepeat(entry.url)}
                  >
                    {uiText('downloadsHistoryRepeat')}
                  </button>
                </div>
              </div>
              <p title={entry.url}>{entry.url}</p>
              <div className="app-downloads-history-meta">
                <span>{formatDownloadsHistoryTime(entry.finishedAt)}</span>
                <span>{entry.status}</span>
              </div>
              {entry.errorHint ? (
                <p
                  className="app-downloads-warning"
                  role="alert"
                  aria-describedby="downloads-page-hint"
                >
                  {entry.errorHint}
                </p>
              ) : null}
            </article>
          ))
        )}
      </div>
    </details>
  )
}
