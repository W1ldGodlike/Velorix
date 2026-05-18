import { useMemo } from 'react'

import {
  useEditorExportSettings,
  type UseEditorExportSettingsResult
} from './use-editor-export-settings'
import { getUiLocale } from './locales/ui-text'
import { useWorkflowWatchFolderStatus } from './use-workflow-watch-folder-status'
import { useAppRefsStore, type AppRefsStore } from './stores/app-refs-store'
import { useAppShellStore, type AppShellStore } from './stores/app-shell-store'
import { useBatchExportStore, selectBatchExportBusy } from './stores/batch-export-store'
import {
  useDownloadsStore,
  selectVisibleDownloadsHistory,
  selectYtdlpCommandHintsFilteredByCategory,
  type DownloadsStoreSlice,
  type DownloadsStoreState
} from './stores/downloads-store'
import { usePanelsStore } from './stores/panels-store'
import { useProcessingHistoryStore } from './stores/processing-history-store'

type BatchExportStoreSlice = ReturnType<typeof useBatchExportStore.getState>

/** Flat renderer state for shell prop builders and orchestration (Zustand-backed). */
export type RendererAppState = AppShellStore &
  AppRefsStore &
  DownloadsStoreSlice &
  ReturnType<typeof usePanelsStore.getState> &
  ReturnType<typeof useProcessingHistoryStore.getState> &
  UseEditorExportSettingsResult & {
    batchSnapshot: BatchExportStoreSlice['batchSnapshot']
    batchDragRowId: BatchExportStoreSlice['batchDragRowId']
    setBatchDragRowId: BatchExportStoreSlice['setBatchDragRowId']
    batchExportBusy: boolean
    visibleDownloadsHistory: ReturnType<typeof selectVisibleDownloadsHistory>
    ytdlpCommandHintsFilteredByCategory: ReturnType<
      typeof selectYtdlpCommandHintsFilteredByCategory
    >
  }

export function useRendererAppState(): RendererAppState {
  const shell = useAppShellStore()
  const refs = useAppRefsStore()
  const downloads = useDownloadsStore()
  const {
    downloadsHistory,
    downloadsHistoryOutcomeFilter,
    downloadsOptions,
    downloadsExpertHintFilter
  } = downloads
  const panels = usePanelsStore()
  const processingHistory = useProcessingHistoryStore()
  const batch = useBatchExportStore()

  useWorkflowWatchFolderStatus(shell.setStatusHint)
  useAppShellStore((s) => s.uiLocaleRenderTick)
  const uiLocale = getUiLocale()
  const editorExportSettings = useEditorExportSettings({ setStatusHint: shell.setStatusHint })

  const visibleDownloadsHistory = useMemo(
    () =>
      selectVisibleDownloadsHistory({
        downloadsHistory,
        downloadsHistoryOutcomeFilter
      } as DownloadsStoreState),
    [downloadsHistory, downloadsHistoryOutcomeFilter]
  )
  const ytdlpCommandHintsFilteredByCategory = useMemo(
    () =>
      selectYtdlpCommandHintsFilteredByCategory(
        { downloadsOptions, downloadsExpertHintFilter },
        uiLocale
      ),
    [downloadsOptions, downloadsExpertHintFilter, uiLocale]
  )
  const batchExportBusy = selectBatchExportBusy(batch)

  return {
    ...shell,
    ...refs,
    ...downloads,
    ...panels,
    ...processingHistory,
    ...editorExportSettings,
    batchSnapshot: batch.batchSnapshot,
    batchDragRowId: batch.batchDragRowId,
    setBatchDragRowId: batch.setBatchDragRowId,
    batchExportBusy,
    visibleDownloadsHistory,
    ytdlpCommandHintsFilteredByCategory
  }
}
