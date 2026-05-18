import { useCallback, useMemo } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import type { WorkspaceTab } from './app-terminal-hint-ui'
import { KNOWLEDGE_SLUG_FFMPEG_TERMINAL_HINTS } from '../../shared/knowledge-contract'
import type { AppWorkspaceMainProps } from './components/shell/AppWorkspaceMain'
import type { DownloadsSettingsRailProps } from './components/downloads/DownloadsSettingsRail'
import type { DownloadsWorkspaceMainProps } from './components/downloads/DownloadsWorkspaceMain'
import type { EditorBatchExportBarProps } from './components/editor/EditorBatchExportBar'
import type { EditorFfmpegSettingsRailProps } from './components/editor/EditorFfmpegSettingsRail'
import type { EditorPreviewSectionProps } from './components/editor/EditorPreviewSection'
import type { EditorQuickYtdlpBarProps } from './components/editor/EditorQuickYtdlpBar'
import type { TerminalWorkspacePanelProps } from './components/TerminalWorkspacePanel'
export type UseAppWorkspaceMainPropsInput = {
  shell: Pick<
    AppWorkspaceMainProps,
    'workspaceTab' | 'panelOpen' | 'persistMainWindowUiPanelToggle' | 'downloadsSettingsRailRef'
  >
  knowledge: {
    setKnowledgeInitialSlug: Dispatch<SetStateAction<string | null>>
    setKnowledgeOpen: Dispatch<SetStateAction<boolean>>
  }
  busy: {
    engineDownloadBusy: boolean
    exportBusy: boolean
    snapshotBusy: boolean
    probePending: boolean
    exportCancelBusy: boolean
    batchExportBusy: boolean
    downloadsOptionsBusy: boolean
    downloadsHistoryBusy: boolean
  }
  editorQuick: Pick<
    EditorQuickYtdlpBarProps,
    'downloadsUrl' | 'setDownloadsUrl' | 'editorUrlPasteBehavior' | 'setEditorUrlPasteBehavior'
  > & {
    handleQuickYtdlpEnqueueLines: () => Promise<void>
    handleDownloadFirstUrlOpenInEditor: () => Promise<void>
  }
  editorBatch: Omit<
    EditorBatchExportBarProps,
    'open' | 'onOpenChange' | 'handleBatchAddDownloadsDone'
  > & {
    handleBatchAddDownloadsDone: () => Promise<void>
  }
  editorPreview: Omit<
    EditorPreviewSectionProps,
    'ffmpegSettingsRailOpen' | 'onShowFfmpegSettingsRail' | 'editorPreviewRegionBusy'
  >
  editorFfmpeg: Omit<
    EditorFfmpegSettingsRailProps,
    'panelOpen' | 'persistMainWindowUiPanelToggle' | 'onCollapseRail' | 'editorFfmpegDetailBusy'
  >
  terminal: Omit<TerminalWorkspacePanelProps, 'onOpenTerminalKnowledge'>
  downloads: {
    main: Omit<
      DownloadsWorkspaceMainProps,
      'onScrollToSettings' | 'onAddToQueue' | 'onBatchAddDownloadsDone' | 'onSelectDownloadsTab'
    >
    settings: DownloadsSettingsRailProps
    setWorkspaceTab: Dispatch<SetStateAction<WorkspaceTab>>
    handleAddDownloadsFromMain: () => Promise<void>
    handleBatchAddDownloadsDone: (rowIds: number[]) => Promise<void>
  }
}

export function useAppWorkspaceMainProps(
  input: UseAppWorkspaceMainPropsInput
): AppWorkspaceMainProps {
  const {
    shell,
    knowledge,
    busy,
    editorQuick,
    editorBatch,
    editorPreview,
    editorFfmpeg,
    terminal,
    downloads
  } = input
  const {
    main: downloadsMainInput,
    settings: downloadsSettings,
    setWorkspaceTab,
    handleAddDownloadsFromMain,
    handleBatchAddDownloadsDone
  } = downloads
  const { setKnowledgeInitialSlug, setKnowledgeOpen } = knowledge
  const {
    engineDownloadBusy,
    exportBusy,
    snapshotBusy,
    probePending,
    exportCancelBusy,
    batchExportBusy,
    downloadsOptionsBusy,
    downloadsHistoryBusy
  } = busy

  const editorMainAriaBusy = useMemo(
    () => exportBusy || snapshotBusy || probePending || exportCancelBusy || batchExportBusy,
    [batchExportBusy, exportBusy, exportCancelBusy, probePending, snapshotBusy]
  )

  const editorQuickProps = useMemo(
    (): AppWorkspaceMainProps['editorQuick'] => ({
      chromeBusy: engineDownloadBusy || downloadsOptionsBusy || downloadsHistoryBusy,
      downloadsUrl: editorQuick.downloadsUrl,
      setDownloadsUrl: editorQuick.setDownloadsUrl,
      editorUrlPasteBehavior: editorQuick.editorUrlPasteBehavior,
      setEditorUrlPasteBehavior: editorQuick.setEditorUrlPasteBehavior,
      onEnqueueLines: () => {
        void editorQuick.handleQuickYtdlpEnqueueLines()
      },
      onDownloadFirstUrlOpenInEditor: () => {
        void editorQuick.handleDownloadFirstUrlOpenInEditor()
      }
    }),
    [downloadsHistoryBusy, downloadsOptionsBusy, editorQuick, engineDownloadBusy]
  )

  const onOpenKnowledgeArticle = useCallback(
    (slug: string): void => {
      setKnowledgeInitialSlug(slug)
      setKnowledgeOpen(true)
    },
    [setKnowledgeInitialSlug, setKnowledgeOpen]
  )

  const editorBatchProps = useMemo(
    (): AppWorkspaceMainProps['editorBatch'] => ({
      onOpenKnowledgeArticle,
      batchExportBusy: editorBatch.batchExportBusy,
      batchSnapshot: editorBatch.batchSnapshot,
      batchOutputSuffix: editorBatch.batchOutputSuffix,
      setBatchOutputSuffix: editorBatch.setBatchOutputSuffix,
      batchOutputDirectory: editorBatch.batchOutputDirectory,
      batchDragRowId: editorBatch.batchDragRowId,
      setBatchDragRowId: editorBatch.setBatchDragRowId,
      previewPath: editorBatch.previewPath,
      setStatusHint: editorBatch.setStatusHint,
      handleBatchDropFiles: editorBatch.handleBatchDropFiles,
      handleBatchPickOutputFolder: editorBatch.handleBatchPickOutputFolder,
      handleBatchRevealSharedOutputFolder: editorBatch.handleBatchRevealSharedOutputFolder,
      handleBatchClearOutputDirectory: editorBatch.handleBatchClearOutputDirectory,
      handleBatchPickFiles: editorBatch.handleBatchPickFiles,
      handleBatchPickFolder: editorBatch.handleBatchPickFolder,
      handleBatchAddCurrentPreview: editorBatch.handleBatchAddCurrentPreview,
      handleBatchAddDownloadsDone: () => {
        void editorBatch.handleBatchAddDownloadsDone()
      },
      handleBatchStart: editorBatch.handleBatchStart,
      handleBatchCancel: editorBatch.handleBatchCancel,
      handleBatchRetryFailed: editorBatch.handleBatchRetryFailed,
      handleBatchRetryFailedAndStart: editorBatch.handleBatchRetryFailedAndStart,
      handleBatchClearCompleted: editorBatch.handleBatchClearCompleted,
      handleBatchCopyInputPaths: editorBatch.handleBatchCopyInputPaths,
      handleBatchCopyOutputPaths: editorBatch.handleBatchCopyOutputPaths,
      handleBatchSaveReport: editorBatch.handleBatchSaveReport,
      handleBatchRemoveWaiting: editorBatch.handleBatchRemoveWaiting,
      handleBatchOpenOutput: editorBatch.handleBatchOpenOutput,
      handleBatchOpenInput: editorBatch.handleBatchOpenInput,
      handleBatchCopyRowPath: editorBatch.handleBatchCopyRowPath
    }),
    [editorBatch, onOpenKnowledgeArticle]
  )

  const editorPreviewProps = useMemo(
    (): AppWorkspaceMainProps['editorPreview'] => ({
      ...editorPreview,
      editorPreviewRegionBusy:
        exportBusy || snapshotBusy || probePending || exportCancelBusy || batchExportBusy
    }),
    [batchExportBusy, editorPreview, exportBusy, exportCancelBusy, probePending, snapshotBusy]
  )

  const editorFfmpegProps = useMemo(
    (): AppWorkspaceMainProps['editorFfmpeg'] => ({
      ...editorFfmpeg,
      editorFfmpegDetailBusy: exportBusy || snapshotBusy || exportCancelBusy || probePending,
      onOpenKnowledgeArticle
    }),
    [editorFfmpeg, exportBusy, exportCancelBusy, onOpenKnowledgeArticle, probePending, snapshotBusy]
  )

  const onOpenTerminalKnowledge = useCallback((): void => {
    onOpenKnowledgeArticle(KNOWLEDGE_SLUG_FFMPEG_TERMINAL_HINTS)
  }, [onOpenKnowledgeArticle])

  const terminalProps = useMemo(
    (): AppWorkspaceMainProps['terminal'] => ({
      ...terminal,
      onOpenTerminalKnowledge
    }),
    [onOpenTerminalKnowledge, terminal]
  )

  const onAddToQueue = useCallback((): void => {
    void handleAddDownloadsFromMain()
  }, [handleAddDownloadsFromMain])

  const onBatchAddDownloadsDone = useCallback(
    (rowIds: number[]): void => {
      void handleBatchAddDownloadsDone(rowIds)
    },
    [handleBatchAddDownloadsDone]
  )

  const onSelectDownloadsTab = useCallback((): void => {
    setWorkspaceTab('downloads')
  }, [setWorkspaceTab])

  const downloadsSettingsWithKnowledge = useMemo(
    (): UseAppWorkspaceMainPropsInput['downloads']['settings'] => ({
      ...downloadsSettings,
      onOpenKnowledgeArticle
    }),
    [downloadsSettings, onOpenKnowledgeArticle]
  )

  const downloadsMainProps = useMemo(
    (): AppWorkspaceMainProps['downloadsMain'] => ({
      ...downloadsMainInput,
      onAddToQueue,
      onBatchAddDownloadsDone,
      onSelectDownloadsTab
    }),
    [downloadsMainInput, onAddToQueue, onBatchAddDownloadsDone, onSelectDownloadsTab]
  )

  const downloadsWorkspaceAriaBusy = downloadsOptionsBusy || downloadsHistoryBusy

  return {
    ...shell,
    editorMainAriaBusy,
    editorQuick: editorQuickProps,
    editorBatch: editorBatchProps,
    editorPreview: editorPreviewProps,
    editorFfmpeg: editorFfmpegProps,
    terminal: terminalProps,
    downloadsMain: downloadsMainProps,
    downloadsSettings: downloadsSettingsWithKnowledge,
    downloadsWorkspaceAriaBusy
  }
}
