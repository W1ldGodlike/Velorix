import { useCallback, useMemo } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import type { AppWorkspaceEditorProps } from './app-workspace-editor-props-types'
import type { EditorBatchExportBarProps } from './components/editor/EditorBatchExportBar'
import type { EditorFfmpegSettingsRailProps } from './components/editor/EditorFfmpegSettingsRail'
import type { EditorPreviewSectionProps } from './components/editor/EditorPreviewSection'
import type { EditorQuickYtdlpBarProps } from './components/editor/EditorQuickYtdlpBar'

export type UseAppWorkspaceEditorPropsInput = {
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
}

export function useAppWorkspaceEditorProps(
  input: UseAppWorkspaceEditorPropsInput
): AppWorkspaceEditorProps {
  const { knowledge, busy, editorQuick, editorBatch, editorPreview, editorFfmpeg } = input
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

  const onOpenKnowledgeArticle = useCallback(
    (slug: string): void => {
      setKnowledgeInitialSlug(slug)
      setKnowledgeOpen(true)
    },
    [setKnowledgeInitialSlug, setKnowledgeOpen]
  )

  const editorQuickProps = useMemo(
    (): AppWorkspaceEditorProps['editorQuick'] => ({
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

  const editorBatchProps = useMemo(
    (): AppWorkspaceEditorProps['editorBatch'] => ({
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
    (): AppWorkspaceEditorProps['editorPreview'] => ({
      ...editorPreview,
      editorPreviewRegionBusy:
        exportBusy || snapshotBusy || probePending || exportCancelBusy || batchExportBusy
    }),
    [batchExportBusy, editorPreview, exportBusy, exportCancelBusy, probePending, snapshotBusy]
  )

  const editorFfmpegProps = useMemo(
    (): AppWorkspaceEditorProps['editorFfmpeg'] => ({
      ...editorFfmpeg,
      editorFfmpegDetailBusy: exportBusy || snapshotBusy || exportCancelBusy || probePending,
      onOpenKnowledgeArticle
    }),
    [editorFfmpeg, exportBusy, exportCancelBusy, onOpenKnowledgeArticle, probePending, snapshotBusy]
  )

  return {
    editorMainAriaBusy,
    editorQuick: editorQuickProps,
    editorBatch: editorBatchProps,
    editorPreview: editorPreviewProps,
    editorFfmpeg: editorFfmpegProps
  }
}
