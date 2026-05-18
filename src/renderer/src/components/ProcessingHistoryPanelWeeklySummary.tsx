import type { JSX } from 'react'

import type {
  ProcessingHistoryFilter,
  ProcessingHistoryWeeklySummary
} from '../../../shared/processing-history-contract'
import { formatProcessingDurationLabel, uiText, uiTextVars } from '../locales/ui-text'
import { mergeProcessingHistoryFilter } from './processing-history-merge-filter'

export function ProcessingHistoryPanelWeeklySummary({
  busy,
  filter,
  weeklySummary,
  onFilterChange
}: {
  busy: boolean
  filter: ProcessingHistoryFilter
  weeklySummary: ProcessingHistoryWeeklySummary
  onFilterChange: (next: ProcessingHistoryFilter) => void
}): JSX.Element {
  return (
    <div
      className="app-processing-history-summary"
      role="region"
      aria-label={uiText('processingHistoryWeeklyAria')}
      aria-describedby="processingHistorySectionHint"
      aria-busy={busy}
    >
      <button
        type="button"
        className={`app-processing-history-summary-chip${filter.outcome === undefined && filter.kind === undefined ? ' app-processing-history-summary-chip-active' : ''}`}
        disabled={busy || weeklySummary.total === 0}
        title={uiTextVars('processingHistoryWeeklyChipFilterTitle', {
          label: uiText('processingHistoryKindAll')
        })}
        aria-pressed={filter.outcome === undefined && filter.kind === undefined}
        onClick={() => {
          onFilterChange(mergeProcessingHistoryFilter(filter, { kind: '', outcome: '' }))
        }}
      >
        {uiText('processingHistory7dPrefix')} {weeklySummary.total}
      </button>
      <button
        type="button"
        className={`app-processing-history-summary-chip${filter.outcome === 'success' ? ' app-processing-history-summary-chip-active' : ''}`}
        disabled={busy || weeklySummary.success === 0}
        title={uiTextVars('processingHistoryWeeklyChipFilterTitle', {
          label: uiText('processingOutcomeSuccess')
        })}
        aria-pressed={filter.outcome === 'success'}
        onClick={() => {
          onFilterChange(mergeProcessingHistoryFilter(filter, { outcome: 'success' }))
        }}
      >
        {uiText('processingHistoryChipOk')} {weeklySummary.success}
      </button>
      <button
        type="button"
        className={`app-processing-history-summary-chip${filter.outcome === 'error' ? ' app-processing-history-summary-chip-active' : ''}`}
        disabled={busy || weeklySummary.error === 0}
        title={uiTextVars('processingHistoryWeeklyChipFilterTitle', {
          label: uiText('processingOutcomeError')
        })}
        aria-pressed={filter.outcome === 'error'}
        onClick={() => {
          onFilterChange(mergeProcessingHistoryFilter(filter, { outcome: 'error' }))
        }}
      >
        {uiText('processingHistoryChipErrors')} {weeklySummary.error}
      </button>
      <button
        type="button"
        className={`app-processing-history-summary-chip${filter.outcome === 'cancelled' ? ' app-processing-history-summary-chip-active' : ''}`}
        disabled={busy || weeklySummary.cancelled === 0}
        title={uiTextVars('processingHistoryWeeklyChipFilterTitle', {
          label: uiText('processingOutcomeCancelled')
        })}
        aria-pressed={filter.outcome === 'cancelled'}
        onClick={() => {
          onFilterChange(mergeProcessingHistoryFilter(filter, { outcome: 'cancelled' }))
        }}
      >
        {uiText('processingHistoryChipCancelled')} {weeklySummary.cancelled}
      </button>
      <span>
        {uiText('processingHistoryChipTime')}{' '}
        {formatProcessingDurationLabel(weeklySummary.totalDurationMs)}
      </span>
      {weeklySummary.workflowScenario > 0 ? (
        <button
          type="button"
          className={`app-processing-history-summary-chip${filter.kind === 'workflowScenario' ? ' app-processing-history-summary-chip-active' : ''}`}
          disabled={busy}
          title={uiTextVars('processingHistoryWeeklyChipFilterTitle', {
            label: uiText('processingHistoryKindWorkflowScenario')
          })}
          aria-pressed={filter.kind === 'workflowScenario'}
          onClick={() => {
            onFilterChange(mergeProcessingHistoryFilter(filter, { kind: 'workflowScenario' }))
          }}
        >
          {uiText('processingHistoryChipWorkflow')} {weeklySummary.workflowScenario}
        </button>
      ) : null}
    </div>
  )
}
