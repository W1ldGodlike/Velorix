import type { JSX } from 'react'

import type { ProcessingHistoryEntry } from '../../../shared/processing-history-contract'
import {
  formatDownloadsHistoryTime,
  formatProcessingHistoryKindLabel,
  formatProcessingHistoryOutcomeLabel,
  uiText,
  uiTextVars
} from '../locales/ui-text'

export function ProcessingHistoryPanelEntryCard({
  busy,
  entry,
  index,
  onOpenOutput,
  onOpenInputInHandler,
  onAddInputToBatch
}: {
  busy: boolean
  entry: ProcessingHistoryEntry
  index: number
  onOpenOutput: (id: string, mode: 'file' | 'folder' | 'preview') => void
  onOpenInputInHandler: (id: string) => void
  onAddInputToBatch?: (id: string) => void
}): JSX.Element {
  const primary = entry.outputPath ?? entry.inputPath ?? uiText('processingHistoryCardUntitledStub')
  const label = primary.length > 96 ? `${primary.slice(0, 96)}…` : primary

  return (
    <article
      className="app-downloads-history-card"
      aria-label={uiTextVars('processingHistoryCardArticleAriaTemplate', {
        index: index + 1,
        label
      })}
      aria-describedby="processingHistorySectionHint"
      aria-busy={busy}
    >
      <div className="app-downloads-history-head">
        <strong title={entry.outputPath ?? entry.inputPath}>
          {entry.outputPath ?? entry.inputPath}
        </strong>
        <span className={`app-downloads-history-outcome app-downloads-history-${entry.outcome}`}>
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
          <span className="app-downloads-history-codec" title={entry.exportVideoCodecUsed}>
            {entry.exportVideoCodecUsed}
          </span>
        ) : null}
        {entry.workflowScenarioId ? (
          <span className="app-processing-history-scenario-id" title={entry.workflowScenarioId}>
            {uiTextVars('processingHistoryScenarioIdChip', {
              id: entry.workflowScenarioId
            })}
          </span>
        ) : null}
      </div>
      <div className="app-downloads-history-meta">
        <span>{entry.status}</span>
      </div>
      {entry.errorHint ? (
        <p
          className="app-downloads-warning"
          role="alert"
          aria-describedby="processingHistorySectionHint"
        >
          {entry.errorHint}
        </p>
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
          title={
            entry.kind === 'workflowScenario' && entry.workflowScenarioId
              ? uiText('processingHistoryRepeatWorkflow')
              : uiText('processingHistoryRepeat')
          }
          disabled={busy}
          onClick={() => onOpenInputInHandler(entry.id)}
        >
          {entry.kind === 'workflowScenario' && entry.workflowScenarioId
            ? uiText('processingHistoryRepeatWorkflow')
            : uiText('processingHistoryRepeat')}
        </button>
        {onAddInputToBatch ? (
          <button
            type="button"
            className="app-btn app-btn-compact"
            aria-describedby="processingHistorySectionHint"
            title={uiText('batchExportAddHistoryInput')}
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
            title={uiText('processingHistoryOpenFile')}
            disabled={busy}
            onClick={() => onOpenOutput(entry.id, 'file')}
          >
            {uiText('processingHistoryOpenFile')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact"
            aria-describedby="processingHistorySectionHint"
            title={uiText('processingHistoryOpenFolder')}
            disabled={busy}
            onClick={() => onOpenOutput(entry.id, 'folder')}
          >
            {uiText('processingHistoryOpenFolder')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact"
            aria-describedby="processingHistorySectionHint"
            title={uiText('processingHistoryOpenPreview')}
            disabled={busy}
            onClick={() => onOpenOutput(entry.id, 'preview')}
          >
            {uiText('processingHistoryOpenPreview')}
          </button>
        </div>
      ) : null}
    </article>
  )
}
