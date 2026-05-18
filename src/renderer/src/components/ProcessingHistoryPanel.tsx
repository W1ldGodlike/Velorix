import { useEffect, useRef, type JSX } from 'react'

import { KNOWLEDGE_SLUG_PROCESSING_HISTORY } from '../../../shared/knowledge-contract'
import { KnowledgeDeepLinkButton } from './KnowledgeDeepLinkButton'
import { uiText } from '../locales/ui-text'
import type { ProcessingHistoryPanelProps } from './processing-history-panel-props'
import { ProcessingHistoryPanelActions } from './ProcessingHistoryPanelActions'
import { ProcessingHistoryPanelEntryCard } from './ProcessingHistoryPanelEntryCard'
import { ProcessingHistoryPanelFilters } from './ProcessingHistoryPanelFilters'
import { ProcessingHistoryPanelWeeklySummary } from './ProcessingHistoryPanelWeeklySummary'

export type { ProcessingHistoryPanelProps } from './processing-history-panel-props'

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
  onAddInputToBatch,
  onOpenKnowledgeArticle
}: ProcessingHistoryPanelProps): JSX.Element {
  const listRef = useRef<HTMLDivElement | null>(null)
  const topEntryIdRef = useRef<string | null>(null)

  useEffect(() => {
    const topId = entries[0]?.id ?? null
    if (!open || topId === null || topId === topEntryIdRef.current) {
      topEntryIdRef.current = topId
      return
    }
    topEntryIdRef.current = topId
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [entries, open])

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
        <span className="app-processing-history-summary-label">
          {uiText('processingHistoryTitle')}{' '}
          <span className="app-processing-history-count">{entries.length}</span>
        </span>
        {onOpenKnowledgeArticle ? (
          <KnowledgeDeepLinkButton
            label={uiText('knowledgeDeepLinkProcessingHistoryLabel')}
            tooltip={uiText('knowledgeDeepLinkProcessingHistoryTooltip')}
            ariaDescribedBy="processingHistorySectionHint"
            disabled={busy}
            onOpen={() => {
              onOpenKnowledgeArticle(KNOWLEDGE_SLUG_PROCESSING_HISTORY)
            }}
          />
        ) : null}
      </summary>
      <p id="processingHistorySectionHint" className="app-settings-section-hint">
        {uiText('processingHistorySectionHint')}
      </p>
      {weeklySummary ? (
        <ProcessingHistoryPanelWeeklySummary
          busy={busy}
          filter={filter}
          weeklySummary={weeklySummary}
          onFilterChange={onFilterChange}
        />
      ) : null}
      <ProcessingHistoryPanelFilters busy={busy} filter={filter} onFilterChange={onFilterChange} />
      <ProcessingHistoryPanelActions
        busy={busy}
        entriesCount={entries.length}
        onRefresh={onRefresh}
        onClear={onClear}
        onExportVisible={onExportVisible}
      />
      <div
        ref={listRef}
        className="app-processing-history-list"
        role="region"
        aria-label={uiText('processingHistoryListRegionAria')}
        aria-describedby="processingHistorySectionHint"
        aria-busy={busy}
      >
        {entries.length === 0 ? (
          <p
            className="app-downloads-history-empty"
            role="status"
            aria-describedby="processingHistorySectionHint"
          >
            {uiText('processingHistoryEmpty')}
          </p>
        ) : (
          entries
            .slice(0, 10)
            .map((entry, idx) => (
              <ProcessingHistoryPanelEntryCard
                key={entry.id}
                busy={busy}
                entry={entry}
                index={idx}
                onOpenOutput={onOpenOutput}
                onOpenInputInHandler={onOpenInputInHandler}
                {...(onAddInputToBatch ? { onAddInputToBatch } : {})}
              />
            ))
        )}
      </div>
    </details>
  )
}
