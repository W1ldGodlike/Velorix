import { useId, type JSX } from 'react'

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
  uiText,
  uiTextVars
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
  onOpenInputInHandler,
  onAddInputToBatch
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
  onAddInputToBatch?: (id: string) => void
}): JSX.Element {
  const kindOptions: Array<{ value: '' | ProcessingHistoryKind; label: string }> = [
    { value: '', label: uiText('processingHistoryKindAll') },
    { value: 'ffmpegExport', label: uiText('processingHistoryKindExport') },
    { value: 'ffmpegSnapshot', label: uiText('processingHistoryKindSnapshot') },
    { value: 'autoExport', label: uiText('processingHistoryKindAutoExport') },
    { value: 'ffmpegBatchExport', label: uiText('processingHistoryKindBatchExport') }
  ]
  const outcomeOptions: Array<{ value: '' | ProcessingHistoryOutcome; label: string }> = [
    { value: '', label: uiText('processingHistoryOutcomeAll') },
    { value: 'success', label: uiText('processingOutcomeSuccess') },
    { value: 'error', label: uiText('processingOutcomeError') },
    { value: 'cancelled', label: uiText('processingOutcomeCancelled') }
  ]

  const processingHistoryKindFilterId = useId()
  const processingHistoryOutcomeFilterId = useId()
  const processingHistoryQueryFilterId = useId()

  return (
    <details
      className="app-settings-section app-processing-history-panel"
      aria-label={uiText('processingHistorySectionAria')}
      aria-describedby="processingHistorySectionHint"
      aria-busy={busy}
      open={open}
      onToggle={(event) => {
        onToggle(event.currentTarget.open)
      }}
    >
      <summary className="app-settings-summary" aria-describedby="processingHistorySectionHint">
        {uiText('processingHistoryTitle')}{' '}
        <span className="app-processing-history-count">{entries.length}</span>
      </summary>
      <p id="processingHistorySectionHint" className="app-settings-section-hint">
        {uiText('processingHistorySectionHint')}
      </p>
      {weeklySummary ? (
        <div
          className="app-processing-history-summary"
          role="region"
          aria-label={uiText('processingHistoryWeeklyAria')}
          aria-describedby="processingHistorySectionHint"
          aria-busy={busy}
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
        role="toolbar"
        aria-orientation="horizontal"
        aria-label={uiText('processingHistoryFiltersToolbarAria')}
        aria-describedby="processingHistorySectionHint"
        aria-busy={busy}
      >
        <div className="app-processing-history-filter-field">
          <label htmlFor={processingHistoryKindFilterId}>
            {uiText('processingHistoryKindFilterAria')}
          </label>
          <select
            id={processingHistoryKindFilterId}
            className="app-control"
            value={filter.kind ?? ''}
            aria-describedby="processingHistorySectionHint"
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
        </div>
        <div className="app-processing-history-filter-field">
          <label htmlFor={processingHistoryOutcomeFilterId}>
            {uiText('processingHistoryOutcomeFilterAria')}
          </label>
          <select
            id={processingHistoryOutcomeFilterId}
            className="app-control"
            value={filter.outcome ?? ''}
            aria-describedby="processingHistorySectionHint"
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
        </div>
        <div className="app-processing-history-filter-field">
          <label htmlFor={processingHistoryQueryFilterId}>
            {uiText('processingHistoryQueryAria')}
          </label>
          <input
            id={processingHistoryQueryFilterId}
            className="app-control"
            value={filter.query ?? ''}
            aria-describedby="processingHistorySectionHint"
            disabled={busy}
            placeholder={uiText('processingHistoryQueryPlaceholder')}
            onChange={(event) => {
              onFilterChange(mergeFilter(filter, { query: event.currentTarget.value }))
            }}
          />
        </div>
      </div>
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
      <div
        className="app-processing-history-list"
        role="region"
        aria-label={uiText('processingHistoryListRegionAria')}
        aria-describedby="processingHistorySectionHint"
        aria-busy={busy}
      >
        {entries.length === 0 ? (
          <p className="app-downloads-history-empty">{uiText('processingHistoryEmpty')}</p>
        ) : (
          entries.slice(0, 10).map((entry, idx) => {
            const primary =
              entry.outputPath ?? entry.inputPath ?? uiText('processingHistoryCardUntitledStub')
            const label = primary.length > 96 ? `${primary.slice(0, 96)}…` : primary
            return (
              <article
                key={entry.id}
                className="app-downloads-history-card"
                aria-label={uiTextVars('processingHistoryCardArticleAriaTemplate', {
                  index: idx + 1,
                  label
                })}
                aria-describedby="processingHistorySectionHint"
                aria-busy={busy}
              >
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
                  {(entry.kind === 'ffmpegExport' ||
                    entry.kind === 'ffmpegBatchExport' ||
                    entry.kind === 'autoExport') &&
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
                {entry.errorHint ? (
                  <p className="app-downloads-warning">{entry.errorHint}</p>
                ) : null}
                <div
                  className="app-downloads-history-actions"
                  role="toolbar"
                  aria-orientation="horizontal"
                  aria-label={uiTextVars('processingHistoryCardSourceToolbarAriaTemplate', {
                    id: entry.id.length > 10 ? `${entry.id.slice(0, 8)}…` : entry.id
                  })}
                  aria-describedby="processingHistorySectionHint"
                  aria-busy={busy}
                >
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    aria-describedby="processingHistorySectionHint"
                    disabled={busy}
                    onClick={() => onOpenInputInHandler(entry.id)}
                  >
                    {uiText('processingHistoryRepeat')}
                  </button>
                  {onAddInputToBatch ? (
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      aria-describedby="processingHistorySectionHint"
                      disabled={busy}
                      onClick={() => onAddInputToBatch(entry.id)}
                    >
                      {uiText('batchExportAddHistoryInput')}
                    </button>
                  ) : null}
                </div>
                {entry.outputPath ? (
                  <div
                    className="app-downloads-history-actions"
                    role="toolbar"
                    aria-orientation="horizontal"
                    aria-label={uiTextVars('processingHistoryCardOutputToolbarAriaTemplate', {
                      id: entry.id.length > 10 ? `${entry.id.slice(0, 8)}…` : entry.id
                    })}
                    aria-describedby="processingHistorySectionHint"
                    aria-busy={busy}
                  >
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      aria-describedby="processingHistorySectionHint"
                      disabled={busy}
                      onClick={() => onOpenOutput(entry.id, 'file')}
                    >
                      {uiText('processingHistoryOpenFile')}
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      aria-describedby="processingHistorySectionHint"
                      disabled={busy}
                      onClick={() => onOpenOutput(entry.id, 'folder')}
                    >
                      {uiText('processingHistoryOpenFolder')}
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      aria-describedby="processingHistorySectionHint"
                      disabled={busy}
                      onClick={() => onOpenOutput(entry.id, 'preview')}
                    >
                      {uiText('processingHistoryOpenPreview')}
                    </button>
                  </div>
                ) : null}
              </article>
            )
          })
        )}
      </div>
    </details>
  )
}
