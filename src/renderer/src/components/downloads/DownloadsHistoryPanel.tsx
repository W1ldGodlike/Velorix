import { useEffect, useId, useRef, type JSX } from 'react'

import { isFfmpegExportBatchVideoPath } from '../../../../shared/ffmpeg-export-batch-video-ext'
import { KNOWLEDGE_SLUG_DOWNLOADS_WORKFLOW } from '../../../../shared/knowledge-contract'
import type { DownloadsHistoryListMode } from '../../../../shared/settings-contract'
import { KnowledgeDeepLinkButton } from '../KnowledgeDeepLinkButton'
import type { YtdlpDownloadHistoryEntry } from '../../../../shared/ytdlp-history-contract'
import { resolveDownloadsHistoryVisibleEntries } from './downloads-history-display'
import {
  formatDownloadsHistoryOutcomeLabel,
  formatDownloadsHistoryTime,
  uiText,
  uiTextVars
} from '../../locales/ui-text'

export function DownloadsHistoryPanel({
  open,
  busy,
  listMode,
  entries,
  totalEntries,
  outcomeFilter,
  weeklySummary,
  onToggle,
  onListModeChange,
  onOutcomeFilterChange,
  onRefresh,
  onClear,
  onExportVisible,
  onRepeat,
  onOpenOutput,
  onOpenInEditor,
  onBatchAddOutputPath,
  onOpenKnowledgeArticle
}: {
  open: boolean
  busy: boolean
  listMode: DownloadsHistoryListMode
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
  onListModeChange: (nextMode: DownloadsHistoryListMode) => void
  onOutcomeFilterChange: (next: 'all' | YtdlpDownloadHistoryEntry['outcome']) => void
  onRefresh: () => void
  onClear: () => void
  onExportVisible: () => void
  onRepeat: (url: string) => void
  onOpenOutput: (id: string, mode: 'file' | 'folder') => void
  onOpenInEditor: (id: string) => void
  onBatchAddOutputPath: (outputPath: string) => void
  onOpenKnowledgeArticle?: (slug: string) => void
}): JSX.Element {
  const downloadsHistoryOutcomeFilterId = useId()
  const listRef = useRef<HTMLDivElement | null>(null)
  const topEntryIdRef = useRef<string | null>(null)
  const visibleEntries = resolveDownloadsHistoryVisibleEntries(entries, listMode)

  useEffect(() => {
    const topId = visibleEntries[0]?.id ?? null
    if (!open || topId === null || topId === topEntryIdRef.current) {
      topEntryIdRef.current = topId
      return
    }
    topEntryIdRef.current = topId
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [open, visibleEntries])
  const showListModeToggle = entries.length > visibleEntries.length || listMode === 'full'
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
      <summary
        className="app-downloads-history-summary-head"
        aria-describedby="downloads-page-hint"
      >
        <span>
          {uiText('downloadsHistoryTitle')}
          <span>
            {visibleEntries.length}/{totalEntries}
          </span>
        </span>
        {onOpenKnowledgeArticle ? (
          <KnowledgeDeepLinkButton
            label={uiText('knowledgeDeepLinkDownloadsHistoryLabel')}
            tooltip={uiText('knowledgeDeepLinkDownloadsHistoryTooltip')}
            ariaDescribedBy="downloads-page-hint"
            disabled={busy}
            onOpen={() => {
              onOpenKnowledgeArticle(KNOWLEDGE_SLUG_DOWNLOADS_WORKFLOW)
            }}
          />
        ) : null}
      </summary>
      <div
        className="app-processing-history-summary"
        role="region"
        aria-label={uiText('downloadsHistoryWeeklyAria')}
        aria-describedby="downloads-page-hint"
        aria-busy={busy}
      >
        <button
          type="button"
          className={`app-processing-history-summary-chip${outcomeFilter === 'all' ? ' app-processing-history-summary-chip-active' : ''}`}
          disabled={busy || weeklySummary.total === 0}
          title={uiTextVars('downloadsHistoryWeeklyChipFilterTitle', {
            label: uiText('downloadsHistoryFilterAll')
          })}
          aria-pressed={outcomeFilter === 'all'}
          onClick={() => {
            onOutcomeFilterChange('all')
          }}
        >
          {uiText('downloadsHistory7dPrefix')} {weeklySummary.total}
        </button>
        <button
          type="button"
          className={`app-processing-history-summary-chip${outcomeFilter === 'success' ? ' app-processing-history-summary-chip-active' : ''}`}
          disabled={busy || weeklySummary.success === 0}
          title={uiTextVars('downloadsHistoryWeeklyChipFilterTitle', {
            label: uiText('downloadsHistoryFilterSuccess')
          })}
          aria-pressed={outcomeFilter === 'success'}
          onClick={() => {
            onOutcomeFilterChange('success')
          }}
        >
          {uiText('downloadsHistoryChipOk')} {weeklySummary.success}
        </button>
        <button
          type="button"
          className={`app-processing-history-summary-chip${outcomeFilter === 'error' ? ' app-processing-history-summary-chip-active' : ''}`}
          disabled={busy || weeklySummary.error === 0}
          title={uiTextVars('downloadsHistoryWeeklyChipFilterTitle', {
            label: uiText('downloadsHistoryFilterError')
          })}
          aria-pressed={outcomeFilter === 'error'}
          onClick={() => {
            onOutcomeFilterChange('error')
          }}
        >
          {uiText('downloadsHistoryChipErrors')} {weeklySummary.error}
        </button>
        <button
          type="button"
          className={`app-processing-history-summary-chip${outcomeFilter === 'cancelled' ? ' app-processing-history-summary-chip-active' : ''}`}
          disabled={busy || weeklySummary.cancelled === 0}
          title={uiTextVars('downloadsHistoryWeeklyChipFilterTitle', {
            label: uiText('downloadsHistoryFilterCancelled')
          })}
          aria-pressed={outcomeFilter === 'cancelled'}
          onClick={() => {
            onOutcomeFilterChange('cancelled')
          }}
        >
          {uiText('downloadsHistoryChipCancelled')} {weeklySummary.cancelled}
        </button>
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
        {showListModeToggle ? (
          <button
            type="button"
            className="app-btn app-btn-compact app-btn-icon-leading"
            aria-pressed={listMode === 'full'}
            aria-describedby="downloads-page-hint"
            title={
              listMode === 'full'
                ? uiText('downloadsHistoryShowCompactList')
                : uiText('downloadsHistoryShowFullList')
            }
            disabled={busy}
            onClick={() => {
              onListModeChange(listMode === 'full' ? 'compact' : 'full')
            }}
          >
            {listMode === 'full'
              ? uiText('downloadsHistoryShowCompactList')
              : uiText('downloadsHistoryShowFullList')}
          </button>
        ) : null}
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-icon-leading"
          aria-describedby="downloads-page-hint"
          title={uiText('downloadsHistoryRefresh')}
          disabled={busy}
          onClick={onRefresh}
        >
          {uiText('downloadsHistoryRefresh')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-warn app-btn-icon-leading"
          aria-describedby="downloads-page-hint"
          title={uiText('downloadsHistoryClear')}
          disabled={busy || entries.length === 0}
          onClick={onClear}
        >
          {uiText('downloadsHistoryClear')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-icon-leading"
          aria-describedby="downloads-page-hint"
          title={uiText('downloadsHistoryExportJson')}
          disabled={busy || entries.length === 0}
          onClick={onExportVisible}
        >
          {uiText('downloadsHistoryExportJson')}
        </button>
      </div>
      <div
        ref={listRef}
        className="app-downloads-history-list"
        role="region"
        aria-label={uiText('downloadsHistoryListRegionAria')}
        aria-describedby="downloads-page-hint"
        aria-busy={busy}
      >
        {visibleEntries.length === 0 ? (
          <p
            className="app-downloads-history-empty"
            role="status"
            aria-describedby="downloads-page-hint"
          >
            {uiText('downloadsHistoryEmpty')}
          </p>
        ) : (
          visibleEntries.map((entry, idx) => (
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
                    title={uiText('downloadsHistoryRepeat')}
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
              {entry.outputPath && entry.outcome === 'success' ? (
                <div
                  className="app-downloads-history-actions"
                  role="toolbar"
                  aria-orientation="horizontal"
                  aria-label={uiText('downloadsHistoryActionsToolbarAria')}
                  aria-describedby="downloads-page-hint"
                  aria-busy={busy}
                >
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    aria-describedby="downloads-page-hint"
                    title={uiText('downloadsHistoryOpenFile')}
                    disabled={busy}
                    onClick={() => onOpenOutput(entry.id, 'file')}
                  >
                    {uiText('downloadsHistoryOpenFile')}
                  </button>
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    aria-describedby="downloads-page-hint"
                    title={uiText('downloadsHistoryOpenFolder')}
                    disabled={busy}
                    onClick={() => onOpenOutput(entry.id, 'folder')}
                  >
                    {uiText('downloadsHistoryOpenFolder')}
                  </button>
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    aria-describedby="downloads-page-hint"
                    title={uiText('downloadsHistoryOpenInEditor')}
                    disabled={busy}
                    onClick={() => onOpenInEditor(entry.id)}
                  >
                    {uiText('downloadsHistoryOpenInEditor')}
                  </button>
                  {entry.outputPath && isFfmpegExportBatchVideoPath(entry.outputPath) ? (
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      aria-describedby="downloads-page-hint"
                      title={uiText('batchExportAddToBatch')}
                      disabled={busy}
                      onClick={() => onBatchAddOutputPath(entry.outputPath!)}
                    >
                      {uiText('batchExportAddToBatch')}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </details>
  )
}
