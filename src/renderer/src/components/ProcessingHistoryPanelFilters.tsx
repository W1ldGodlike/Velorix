import { useId, type JSX } from 'react'

import type {
  ProcessingHistoryFilter,
  ProcessingHistoryKind,
  ProcessingHistoryOutcome
} from '../../../shared/processing-history-contract'
import { uiText } from '../locales/ui-text'
import { mergeProcessingHistoryFilter } from './processing-history-merge-filter'

export function ProcessingHistoryPanelFilters({
  busy,
  filter,
  onFilterChange
}: {
  busy: boolean
  filter: ProcessingHistoryFilter
  onFilterChange: (next: ProcessingHistoryFilter) => void
}): JSX.Element {
  const kindOptions: Array<{ value: '' | ProcessingHistoryKind; label: string }> = [
    { value: '', label: uiText('processingHistoryKindAll') },
    { value: 'ffmpegExport', label: uiText('processingHistoryKindExport') },
    { value: 'ffmpegSnapshot', label: uiText('processingHistoryKindSnapshot') },
    { value: 'autoExport', label: uiText('processingHistoryKindAutoExport') },
    { value: 'ffmpegBatchExport', label: uiText('processingHistoryKindBatchExport') },
    { value: 'workflowScenario', label: uiText('processingHistoryKindWorkflowScenario') }
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
            onFilterChange(mergeProcessingHistoryFilter(filter, { kind: value }))
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
            onFilterChange(mergeProcessingHistoryFilter(filter, { outcome: value }))
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
            onFilterChange(
              mergeProcessingHistoryFilter(filter, { query: event.currentTarget.value })
            )
          }}
        />
      </div>
    </div>
  )
}
