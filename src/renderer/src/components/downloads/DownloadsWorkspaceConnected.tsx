import type { JSX } from 'react'

import {
  downloadsRowMatchesStatus,
  summarizeDownloadsRows,
  type DownloadsStatusFilter
} from '../../downloads-queue-view'
import { uiText } from '../../locales/ui-text'
import { useDownloadsUrlActions } from '../../use-downloads-url-actions'
import { useDownloadsWorkspace } from '../../use-downloads-workspace'
import { useAppRefsStore } from '../../stores/app-refs-store'
import { useAppShellStore } from '../../stores/app-shell-store'
import { DownloadsSettingsRail } from './DownloadsSettingsRail'
import { DownloadsWorkspaceMain } from './DownloadsWorkspaceMain'
import { formatBatchAddStatusHint } from '../../use-ffmpeg-export-batch-deps'
import { useCallback, useMemo, type SyntheticEvent } from 'react'
import {
  type DownloadsRailPanelKey,
  useDownloadsWindowUiPanels
} from '../../use-downloads-window-ui-panels'

/** Вкладка «Загрузки»: shell + downloads + panels stores. */
export function DownloadsWorkspaceConnected(): JSX.Element {
  const downloadsSettingsRailRef = useAppRefsStore((s) => s.downloadsSettingsRailRef)
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const setStatusHint = useAppShellStore((s) => s.setStatusHint)
  const setKnowledgeInitialSlug = useAppShellStore((s) => s.setKnowledgeInitialSlug)
  const setKnowledgeOpen = useAppShellStore((s) => s.setKnowledgeOpen)
  const downloadsUrl = useAppShellStore((s) => s.downloadsUrl)
  const setDownloadsUrl = useAppShellStore((s) => s.setDownloadsUrl)
  const downloadsRows = useAppShellStore((s) => s.downloadsRows)
  const downloadsStatusFilter = useAppShellStore((s) => s.downloadsStatusFilter)
  const setDownloadsStatusFilter = useAppShellStore((s) => s.setDownloadsStatusFilter)
  const downloadsNarrowLayout = useAppShellStore((s) => s.downloadsNarrowLayout)
  const downloadsMainUrlFieldId = useAppShellStore((s) => s.downloadsMainUrlFieldId)
  useAppShellStore((s) => s.uiLocaleRenderTick)

  const downloadsWorkspace = useDownloadsWorkspace({ setStatusHint })
  const downloadsWindowUiPanels = useDownloadsWindowUiPanels()

  const { handleAddDownloadsFromMain } = useDownloadsUrlActions({
    downloadsUrl,
    setDownloadsUrl,
    setWorkspaceTab,
    setStatusHint
  })

  const handleBatchAddDownloadsDone = useCallback(
    async (rowIds: number[]): Promise<void> => {
      const res = await window.velorix.batchExport.addFromDownloadsDone(rowIds)
      if (!res.ok) {
        setStatusHint(res.error)
        return
      }
      formatBatchAddStatusHint(setStatusHint, res)
    },
    [setStatusHint]
  )

  const handleBatchAddOutputPath = useCallback(
    async (outputPath: string): Promise<void> => {
      const res = await window.velorix.batchExport.addPaths([outputPath])
      if (!res.ok) {
        setStatusHint(res.error)
        return
      }
      formatBatchAddStatusHint(setStatusHint, res)
    },
    [setStatusHint]
  )

  const handleDownloadsRailSectionToggle = useCallback(
    (key: DownloadsRailPanelKey) => {
      return (e: SyntheticEvent<HTMLDetailsElement>): void => {
        downloadsWindowUiPanels.persistDownloadsRailPanelToggle(key, e.currentTarget.open)
      }
    },
    [downloadsWindowUiPanels]
  )

  const downloadsStats = useMemo(() => summarizeDownloadsRows(downloadsRows), [downloadsRows])
  const visibleDownloadsRows = useMemo(
    () => downloadsRows.filter((row) => downloadsRowMatchesStatus(row, downloadsStatusFilter)),
    [downloadsRows, downloadsStatusFilter]
  )

  const downloadsStatusFilterChips = useMemo(
    () =>
      (
        [
          'all',
          'running',
          'done',
          'error',
          'cancelled'
        ] as const satisfies readonly DownloadsStatusFilter[]
      ).map((id) => ({
        id,
        label: uiText(
          id === 'all'
            ? 'downloadsQueueFilterAll'
            : id === 'running'
              ? 'downloadsQueueFilterRunning'
              : id === 'done'
                ? 'downloadsQueueFilterDone'
                : id === 'error'
                  ? 'downloadsQueueFilterError'
                  : 'downloadsQueueFilterCancelled'
        )
      })),
    []
  )

  const onOpenKnowledgeArticle = useCallback(
    (slug: string): void => {
      setKnowledgeInitialSlug(slug)
      setKnowledgeOpen(true)
    },
    [setKnowledgeInitialSlug, setKnowledgeOpen]
  )

  const downloadsWorkspaceAriaBusy =
    downloadsWorkspace.downloadsOptionsBusy || downloadsWorkspace.downloadsHistoryBusy

  return (
    <main
      id="workspace-panel-downloads"
      role="tabpanel"
      aria-labelledby="workspace-tab-downloads"
      aria-describedby="downloads-page-hint"
      aria-busy={downloadsWorkspaceAriaBusy}
      className="app-main app-downloads-workspace"
    >
      <DownloadsWorkspaceMain
        downloadsOptionsBusy={downloadsWorkspace.downloadsOptionsBusy}
        downloadsHistoryBusy={downloadsWorkspace.downloadsHistoryBusy}
        downloadsUrl={downloadsUrl}
        setDownloadsUrl={setDownloadsUrl}
        downloadsMainUrlFieldId={downloadsMainUrlFieldId}
        onAddToQueue={() => {
          void handleAddDownloadsFromMain()
        }}
        downloadsStats={downloadsStats}
        downloadsStatusFilter={downloadsStatusFilter}
        setDownloadsStatusFilter={setDownloadsStatusFilter}
        downloadsStatusFilterChips={downloadsStatusFilterChips}
        downloadsRows={downloadsRows}
        visibleDownloadsRows={visibleDownloadsRows}
        setStatusHint={setStatusHint}
        onBatchAddDownloadsDone={(rowIds) => {
          void handleBatchAddDownloadsDone(rowIds)
        }}
        onBatchAddOutputPath={(outputPath) => {
          void handleBatchAddOutputPath(outputPath)
        }}
        onSelectDownloadsTab={() => {
          setWorkspaceTab('downloads')
        }}
        downloadsEmbeddedHistoryOpen={downloadsWindowUiPanels.downloadsEmbeddedHistoryOpen}
        persistDownloadsEmbeddedHistoryOpen={
          downloadsWindowUiPanels.persistDownloadsEmbeddedHistoryOpen
        }
        downloadsHistoryListMode={downloadsWindowUiPanels.downloadsHistoryListMode}
        persistDownloadsHistoryListMode={downloadsWindowUiPanels.persistDownloadsHistoryListMode}
        visibleDownloadsHistory={downloadsWorkspace.visibleDownloadsHistory}
        downloadsHistoryCount={downloadsWorkspace.downloadsHistory.length}
        downloadsHistoryOutcomeFilter={downloadsWorkspace.downloadsHistoryOutcomeFilter}
        setDownloadsHistoryOutcomeFilter={downloadsWorkspace.setDownloadsHistoryOutcomeFilter}
        downloadsHistoryWeeklySummary={
          downloadsWorkspace.downloadsHistoryWeeklySummary ?? {
            since: 0,
            until: 0,
            total: 0,
            success: 0,
            error: 0,
            cancelled: 0
          }
        }
        refreshDownloadsHistory={downloadsWorkspace.refreshDownloadsHistory}
        setDownloadsHistory={downloadsWorkspace.setDownloadsHistory}
        exportVisibleDownloadsHistory={downloadsWorkspace.exportVisibleDownloadsHistory}
        onOpenKnowledgeArticle={onOpenKnowledgeArticle}
        downloadsEmbeddedLogOpen={downloadsWindowUiPanels.downloadsEmbeddedLogOpen}
        persistDownloadsEmbeddedLogOpen={downloadsWindowUiPanels.persistDownloadsEmbeddedLogOpen}
        downloadsLogTargetRowId={downloadsWorkspace.downloadsLogTargetRowId}
        downloadsLogLines={downloadsWorkspace.downloadsLogLines}
        setDownloadsLogLines={downloadsWorkspace.setDownloadsLogLines}
        setDownloadsLogTargetRowId={downloadsWorkspace.setDownloadsLogTargetRowId}
      />
      <DownloadsSettingsRail
        ref={downloadsSettingsRailRef}
        stackedLayout={downloadsNarrowLayout}
        embeddedOpen={downloadsWindowUiPanels.downloadsEmbeddedSettingsOpen}
        onEmbeddedToggle={downloadsWindowUiPanels.persistDownloadsEmbeddedSettingsOpen}
        downloadsOptionsBusy={downloadsWorkspace.downloadsOptionsBusy}
        downloadsHistoryBusy={downloadsWorkspace.downloadsHistoryBusy}
        downloadsOptions={downloadsWorkspace.downloadsOptions}
        setDownloadsOptions={downloadsWorkspace.setDownloadsOptions}
        downloadsRailPanels={downloadsWindowUiPanels.downloadsRailPanels}
        onRailSectionToggle={handleDownloadsRailSectionToggle}
        applyDownloadsOptionsPatch={downloadsWorkspace.applyDownloadsOptionsPatch}
        downloadsOutputDirectory={downloadsWorkspace.downloadsOutputDirectory}
        setDownloadsOutputDirectory={downloadsWorkspace.setDownloadsOutputDirectory}
        refreshDownloadsOutputDirectory={downloadsWorkspace.refreshDownloadsOutputDirectory}
        setStatusHint={setStatusHint}
        downloadsExpertHintFilter={downloadsWorkspace.downloadsExpertHintFilter}
        setDownloadsExpertHintFilter={downloadsWorkspace.setDownloadsExpertHintFilter}
        ytdlpCommandHintsFilteredByCategory={downloadsWorkspace.ytdlpCommandHintsFilteredByCategory}
        appendDownloadsExtraArgsToken={downloadsWorkspace.appendDownloadsExtraArgsToken}
        refreshDownloadsOptions={downloadsWorkspace.refreshDownloadsOptions}
        onOpenKnowledgeArticle={onOpenKnowledgeArticle}
      />
    </main>
  )
}
