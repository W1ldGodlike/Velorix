import type { JSX } from 'react'

import { uiText } from '../../locales/ui-text'
import type { DownloadsWorkspaceMainProps } from './downloads-workspace-main-props'

export function DownloadsWorkspaceMainOverview(props: DownloadsWorkspaceMainProps): JSX.Element {
  const {
    downloadsOptionsBusy,
    downloadsHistoryBusy,
    downloadsStats,
    downloadsStatusFilter,
    setDownloadsStatusFilter,
    downloadsStatusFilterChips
  } = props

  return (
    <>
      <div
        className="app-downloads-overview"
        role="region"
        aria-label={uiText('downloadsOverviewAria')}
        aria-describedby="downloads-page-hint"
        aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
      >
        <div
          className="app-downloads-overview-stats"
          role="list"
          aria-label={uiText('downloadsOverviewStatsGroupAria')}
          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
        >
          <div className="app-downloads-stat" role="listitem">
            <span className="app-downloads-stat-label">{uiText('downloadsStatTotal')}</span>
            <strong>{downloadsStats.total}</strong>
          </div>
          <div className="app-downloads-stat" role="listitem">
            <span className="app-downloads-stat-label">
              {uiText('downloadsQueueFilterRunning')}
            </span>
            <strong>{downloadsStats.running}</strong>
          </div>
          <div className="app-downloads-stat" role="listitem">
            <span className="app-downloads-stat-label">{uiText('downloadsQueueFilterDone')}</span>
            <strong>{downloadsStats.done}</strong>
          </div>
          <div className="app-downloads-stat" role="listitem">
            <span className="app-downloads-stat-label">{uiText('downloadsQueueFilterError')}</span>
            <strong>{downloadsStats.error}</strong>
          </div>
          <div className="app-downloads-stat" role="listitem">
            <span className="app-downloads-stat-label">{uiText('downloadsStatPending')}</span>
            <strong>{downloadsStats.pending}</strong>
          </div>
        </div>
      </div>
      <div
        className="app-downloads-filterbar"
        role="toolbar"
        aria-orientation="horizontal"
        aria-label={uiText('downloadsFilterBarAria')}
        aria-describedby="downloads-page-hint"
        aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
      >
        {downloadsStatusFilterChips.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`app-filter-chip${downloadsStatusFilter === filter.id ? ' app-filter-chip-active' : ''}`}
            aria-pressed={downloadsStatusFilter === filter.id}
            onClick={() => {
              setDownloadsStatusFilter(filter.id)
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </>
  )
}
