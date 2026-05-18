import type { JSX } from 'react'

import { DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED } from '../../../../shared/downloads-log-contract'
import { formatDownloadsLogText } from '../../downloads-queue-view'
import { uiText } from '../../locales/ui-text'
import { DownloadsHistoryPanel } from './DownloadsHistoryPanel'
import { DownloadsLogPanel } from './DownloadsLogPanel'
import type { DownloadsWorkspaceMainProps } from './downloads-workspace-main-props'

export function DownloadsWorkspaceMainLowerStack(props: DownloadsWorkspaceMainProps): JSX.Element {
  const {
    downloadsOptionsBusy,
    downloadsHistoryBusy,
    setStatusHint,
    onSelectDownloadsTab,
    downloadsEmbeddedHistoryOpen,
    persistDownloadsEmbeddedHistoryOpen,
    downloadsHistoryListMode,
    persistDownloadsHistoryListMode,
    visibleDownloadsHistory,
    downloadsHistoryCount,
    downloadsHistoryOutcomeFilter,
    setDownloadsHistoryOutcomeFilter,
    downloadsHistoryWeeklySummary,
    refreshDownloadsHistory,
    setDownloadsHistory,
    exportVisibleDownloadsHistory,
    onOpenKnowledgeArticle,
    downloadsEmbeddedLogOpen,
    persistDownloadsEmbeddedLogOpen,
    downloadsLogTargetRowId,
    downloadsLogLines,
    setDownloadsLogLines,
    setDownloadsLogTargetRowId
  } = props

  return (
    <div
      className="app-downloads-lower-stack"
      role="region"
      aria-label={uiText('downloadsLowerStackAria')}
      aria-describedby="downloads-page-hint"
      aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
    >
      <DownloadsHistoryPanel
        open={downloadsEmbeddedHistoryOpen}
        busy={downloadsHistoryBusy}
        listMode={downloadsHistoryListMode}
        entries={visibleDownloadsHistory}
        totalEntries={downloadsHistoryCount}
        outcomeFilter={downloadsHistoryOutcomeFilter}
        weeklySummary={downloadsHistoryWeeklySummary}
        {...(onOpenKnowledgeArticle ? { onOpenKnowledgeArticle } : {})}
        onToggle={(next) => {
          persistDownloadsEmbeddedHistoryOpen(next)
        }}
        onListModeChange={persistDownloadsHistoryListMode}
        onOutcomeFilterChange={setDownloadsHistoryOutcomeFilter}
        onRefresh={() => {
          void refreshDownloadsHistory()
        }}
        onClear={() => {
          void window.fluxalloy.downloads.clearHistory().then((res) => {
            if (!res.ok) {
              setStatusHint(res.error)
              return
            }
            setDownloadsHistory([])
            void refreshDownloadsHistory()
          })
        }}
        onExportVisible={() => {
          void exportVisibleDownloadsHistory()
        }}
        onRepeat={(url) => {
          void window.fluxalloy.downloads.addLines(url).then((res) => {
            if (!res.ok) {
              setStatusHint(res.error)
              return
            }
            onSelectDownloadsTab()
            setStatusHint(
              res.added > 0
                ? uiText('downloadsHistoryRepeatQueued')
                : uiText('downloadsHistoryRepeatNotAdded')
            )
          })
        }}
        onOpenOutput={(id, mode) => {
          void window.fluxalloy.downloads.openHistoryOutput(id, mode).then((res) => {
            if (!res.ok) {
              setStatusHint(res.error)
            }
          })
        }}
        onOpenInEditor={(id) => {
          void window.fluxalloy.downloads.openHistoryOutputInHandler(id).then((res) => {
            if (!res.ok) {
              setStatusHint(res.error)
              return
            }
            setStatusHint(uiText('downloadsHistoryOpenHandlerDone'))
          })
        }}
      />
      <DownloadsLogPanel
        open={downloadsEmbeddedLogOpen}
        targetRowId={downloadsLogTargetRowId}
        lines={downloadsLogLines}
        downloadsTabBusy={downloadsOptionsBusy || downloadsHistoryBusy}
        onToggle={(next) => {
          persistDownloadsEmbeddedLogOpen(next)
        }}
        onClear={() => {
          setDownloadsLogLines([])
          setDownloadsLogTargetRowId(null)
        }}
        onSave={() => {
          const text = formatDownloadsLogText(downloadsLogLines)
          void window.fluxalloy.downloads.saveVisibleLog(text).then((res) => {
            if (!res.ok && res.error !== DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED) {
              setStatusHint(res.error)
            }
          })
        }}
      />
    </div>
  )
}
