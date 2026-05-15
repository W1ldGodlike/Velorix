import type { JSX } from 'react'

import type {
  ProcessingHistoryEntry,
  ProcessingHistoryFilter,
  ProcessingHistoryKind,
  ProcessingHistoryOutcome,
  ProcessingHistoryWeeklySummary
} from '../../../shared/processing-history-contract'
import {
  formatProcessingDurationLabel,
  formatProcessingHistoryKindLabel,
  formatProcessingHistoryOutcomeLabel,
  formatDownloadsHistoryTime,
  uiText
} from '../locales/ui-text'

function mergeFilter(
  current: ProcessingHistoryFilter,
  patch: {
    kind?: ProcessingHistoryKind | ''
    outcome?: ProcessingHistoryOutcome | ''
    query?: string
  }
): ProcessingHistoryFilter {
  return {
    ...(patch.kind !== undefined
      ? patch.kind
        ? { kind: patch.kind }
        : {}
      : current.kind
        ? { kind: current.kind }
        : {}),
    ...(patch.outcome !== undefined
      ? patch.outcome
        ? { outcome: patch.outcome }
        : {}
      : current.outcome
        ? { outcome: current.outcome }
        : {}),
    ...(patch.query !== undefined
      ? patch.query.trim()
        ? { query: patch.query.trim() }
        : {}
      : current.query
        ? { query: current.query }
        : {})
  }
}

export function ProcessingHistoryPanel({
  open,
  busy,
  entries,
  filter,
  weeklySummary,
  onToggle,
  onFilterChange,
  onRefresh,
  onClear,
  onExportVisible,
  onOpenOutput,
  onOpenInputInHandler
}: {
  open: boolean
  busy: boolean
  entries: ProcessingHistoryEntry[]
  filter: ProcessingHistoryFilter
  weeklySummary: ProcessingHistoryWeeklySummary | null
  onToggle: (nextOpen: boolean) => void
  onFilterChange: (next: ProcessingHistoryFilter) => void
  onRefresh: () => void
  onClear: () => void
  onExportVisible: () => void
  onOpenOutput: (id: string, mode: 'file' | 'folder' | 'preview') => void
  onOpenInputInHandler: (id: string) => void
}): JSX.Element {
  const kindOptions: Array<{ value: '' | ProcessingHistoryKind; label: string }> = [
    { value: '', label: uiText('processingHistoryKindAll') },
    { value: 'ffmpegExport', label: uiText('processingHistoryKindExport') },
    { value: 'ffmpegSnapshot', label: uiText('processingHistoryKindSnapshot') },
    { value: 'autoExport', label: uiText('processingHistoryKindAutoExport') }
  ]
  const outcomeOptions: Array<{ value: '' | ProcessingHistoryOutcome; label: string }> = [
    { value: '', label: uiText('processingHistoryOutcomeAll') },
    { value: 'success', label: uiText('processingOutcomeSuccess') },
    { value: 'error', label: uiText('processingOutcomeError') },
    { value: 'cancelled', label: uiText('processingOutcomeCancelled') }
  ]

  return (
    <details
      className="app-settings-section app-processing-history-panel"
      open={open}
      onToggle={(event) => {
        onToggle(event.currentTarget.open)
      }}
    >
      <summary className="app-settings-summary">
        {uiText('processingHistoryTitle')}{' '}
        <span className="app-processing-history-count">{entries.length}</span>
      </summary>
      <p id="processingHistorySectionHint" className="app-settings-section-hint">
        {uiText('processingHistorySectionHint')}
      </p>
      {weeklySummary ? (
        <div
          className="app-processing-history-summary"
          aria-label={uiText('processingHistoryWeeklyAria')}
        >
          <span>
            {uiText('processingHistory7dPrefix')} {weeklySummary.total}
          </span>
          <span>
            {uiText('processingHistoryChipOk')} {weeklySummary.success}
          </span>
          <span>
            {uiText('processingHistoryChipErrors')} {weeklySummary.error}
          </span>
          <span>
            {uiText('processingHistoryChipCancelled')} {weeklySummary.cancelled}
          </span>
          <span>
            {uiText('processingHistoryChipTime')}{' '}
            {formatProcessingDurationLabel(weeklySummary.totalDurationMs)}
          </span>
        </div>
      ) : null}
      <div
        className="app-processing-history-controls"
        aria-describedby="processingHistorySectionHint"
      >
        <select
          className="app-control"
          aria-label={uiText('processingHistoryKindFilterAria')}
          value={filter.kind ?? ''}
          disabled={busy}
          onChange={(event) => {
            const value = event.currentTarget.value as '' | ProcessingHistoryKind
            onFilterChange(mergeFilter(filter, { kind: value }))
          }}
        >
          {kindOptions.map((option) => (
            <option key={option.value || 'all'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          className="app-control"
          aria-label={uiText('processingHistoryOutcomeFilterAria')}
          value={filter.outcome ?? ''}
          disabled={busy}
          onChange={(event) => {
            const value = event.currentTarget.value as '' | ProcessingHistoryOutcome
            onFilterChange(mergeFilter(filter, { outcome: value }))
          }}
        >
          {outcomeOptions.map((option) => (
            <option key={option.value || 'all'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          className="app-control"
          value={filter.query ?? ''}
          disabled={busy}
          placeholder={uiText('processingHistoryQueryPlaceholder')}
          aria-label={uiText('processingHistoryQueryAria')}
          onChange={(event) => {
            onFilterChange(mergeFilter(filter, { query: event.currentTarget.value }))
          }}
        />
      </div>
      <div className="app-processing-history-actions">
        <button
          type="button"
          className="app-btn app-btn-compact"
          disabled={busy}
          onClick={onRefresh}
        >
          {uiText('processingHistoryRefresh')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-warn"
          disabled={busy || entries.length === 0}
          onClick={onClear}
        >
          {uiText('processingHistoryClear')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact"
          disabled={busy || entries.length === 0}
          onClick={onExportVisible}
        >
          {uiText('processingHistoryExportJson')}
        </button>
      </div>
      <div className="app-processing-history-list">
        {entries.length === 0 ? (
          <p className="app-downloads-history-empty">{uiText('processingHistoryEmpty')}</p>
        ) : (
          entries.slice(0, 10).map((entry) => (
            <article key={entry.id} className="app-downloads-history-card">
              <div className="app-downloads-history-head">
                <strong title={entry.outputPath ?? entry.inputPath}>
                  {entry.outputPath ?? entry.inputPath}
                </strong>
                <span
                  className={`app-downloads-history-outcome app-downloads-history-${entry.outcome}`}
                >
                  {formatProcessingHistoryOutcomeLabel(entry.outcome)}
                </span>
              </div>
              <p title={entry.inputPath}>{entry.inputPath}</p>
              <div className="app-downloads-history-meta">
                <span>{formatDownloadsHistoryTime(entry.finishedAt)}</span>
                <span>{formatProcessingHistoryKindLabel(entry.kind)}</span>
                {(entry.kind === 'ffmpegExport' || entry.kind === 'autoExport') &&
                entry.exportVideoCodecUsed ? (
                  <span
                    className="app-downloads-history-codec"
                    title={entry.exportVideoCodecUsed}
                  >
                    {entry.exportVideoCodecUsed}
                  </span>
                ) : null}
              </div>
              <div className="app-downloads-history-meta">
                <span>{entry.status}</span>
              </div>
              {entry.errorHint ? <p className="app-downloads-warning">{entry.errorHint}</p> : null}
              <div className="app-downloads-history-actions">
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  onClick={() => onOpenInputInHandler(entry.id)}
                >
                  {uiText('processingHistoryRepeat')}
                </button>
              </div>
              {entry.outputPath ? (
                <div className="app-downloads-history-actions">
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    onClick={() => onOpenOutput(entry.id, 'file')}
                  >
                    {uiText('processingHistoryOpenFile')}
                  </button>
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    onClick={() => onOpenOutput(entry.id, 'folder')}
                  >
                    {uiText('processingHistoryOpenFolder')}
                  </button>
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    onClick={() => onOpenOutput(entry.id, 'preview')}
                  >
                    {uiText('processingHistoryOpenPreview')}
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
