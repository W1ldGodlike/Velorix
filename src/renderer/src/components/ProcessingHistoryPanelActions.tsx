import type { JSX } from 'react'

import { uiText } from '../locales/ui-text'

export function ProcessingHistoryPanelActions({
  busy,
  entriesCount,
  onRefresh,
  onClear,
  onExportVisible
}: {
  busy: boolean
  entriesCount: number
  onRefresh: () => void
  onClear: () => void
  onExportVisible: () => void
}): JSX.Element {
  return (
    <div
      className="app-processing-history-actions"
      role="toolbar"
      aria-orientation="horizontal"
      aria-label={uiText('processingHistoryActionsToolbarAria')}
      aria-describedby="processingHistorySectionHint"
      aria-busy={busy}
    >
      <button
        type="button"
        className="app-btn app-btn-compact"
        aria-describedby="processingHistorySectionHint"
        title={uiText('processingHistoryRefresh')}
        disabled={busy}
        onClick={onRefresh}
      >
        {uiText('processingHistoryRefresh')}
      </button>
      <button
        type="button"
        className="app-btn app-btn-compact app-btn-warn"
        aria-describedby="processingHistorySectionHint"
        title={uiText('processingHistoryClear')}
        disabled={busy || entriesCount === 0}
        onClick={onClear}
      >
        {uiText('processingHistoryClear')}
      </button>
      <button
        type="button"
        className="app-btn app-btn-compact"
        aria-describedby="processingHistorySectionHint"
        title={uiText('processingHistoryExportJson')}
        disabled={busy || entriesCount === 0}
        onClick={onExportVisible}
      >
        {uiText('processingHistoryExportJson')}
      </button>
    </div>
  )
}
