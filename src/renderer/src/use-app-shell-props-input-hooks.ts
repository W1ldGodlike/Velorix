import { useCallback, useMemo } from 'react'
import type { SyntheticEvent } from 'react'
import { uiText } from './locales/ui-text'
import { type DownloadsRailPanelKey } from './use-downloads-window-ui-panels'
import { useEditorExportPipeline } from './use-editor-export-pipeline'
import { useAppMainWindowEffects } from './use-app-main-window-effects'
import { useAppPreviewWorkspace } from './use-app-preview-workspace'
import { useAppToolbarEngineActions } from './use-app-toolbar-engine-actions'
import { useFfmpegExportBatch } from './use-ffmpeg-export-batch'
import { useTerminalWorkspace } from './use-terminal-workspace'
import { useDownloadsUrlActions } from './use-downloads-url-actions'
import {
  type DownloadsStatusFilter,
  downloadsRowMatchesStatus,
  summarizeDownloadsRows,
  type DownloadsQueueRowView
} from './downloads-queue-view'
import type { RendererAppState } from './use-renderer-app-state'

export type AppShellPropsInputHookBag = ReturnType<typeof useAppPreviewWorkspace> &
  ReturnType<typeof useTerminalWorkspace> &
  ReturnType<typeof useDownloadsUrlActions> &
  ReturnType<typeof useAppMainWindowEffects> &
  ReturnType<typeof useFfmpegExportBatch> &
  ReturnType<typeof useEditorExportPipeline> &
  ReturnType<typeof useAppToolbarEngineActions> & {
    downloadsStats: ReturnType<typeof summarizeDownloadsRows>
    visibleDownloadsRows: DownloadsQueueRowView[]
    downloadsStatusFilterChips: Array<{ id: DownloadsStatusFilter; label: string }>
    handleDownloadsRailSectionToggle: (
      key: DownloadsRailPanelKey
    ) => (e: SyntheticEvent<HTMLDetailsElement>) => void
  }

export function useAppShellPropsInputHooks(state: RendererAppState): AppShellPropsInputHookBag {
  const {
    trimSnapshotRef,
    trimRange,
    currentSourcePath,
    previewPlaybackUrl,
    applyPreview,
    handlePreviewVideoError,
    handlePreviewVideoLoaded,
    onTrimRangeSnapshot,
    jumpToTrimExport,

    handlePreviewDrop
  } = useAppPreviewWorkspace({
    preview: state.preview,
    setPreview: state.setPreview,
    previewBlobUrl: state.previewBlobUrl,
    setPreviewBlobUrl: state.setPreviewBlobUrl,
    setProbeInfo: state.setProbeInfo,
    setStatusHint: state.setStatusHint,
    setWorkspaceTab: state.setWorkspaceTab,
    persistMainWindowUiPanelToggle: state.persistMainWindowUiPanelToggle,
    editorUrlPasteBehavior: state.editorUrlPasteBehavior,
    setDownloadsUrl: state.setDownloadsUrl
  })

  const {
    terminalLine,
    setTerminalLine,
    terminalBusy,
    terminalHintFilter,
    setTerminalHintFilter,
    terminalHintToolFilter,
    setTerminalHintToolFilter,
    terminalHintCatalogTotal,
    terminalHintCatalogCapped,
    terminalHistory,
    terminalSuggestFocus,
    setTerminalSuggestFocus,
    terminalSuggestBlurTimeoutRef,
    terminalHintsSearchFieldId,
    terminalCommandInputId,
    visibleTerminalHints,
    terminalInlineSuggestions,
    terminalSuggestActiveIndex,
    setTerminalSuggestIndex,
    appendTerminalToken,
    applyTerminalSuggest,
    runTerminalLine,
    recallTerminalCommand,
    copyTerminalOutputLine
  } = useTerminalWorkspace({
    workspaceTab: state.workspaceTab,
    currentSourcePath,
    setStatusHint: state.setStatusHint
  })

  const downloadsStats = useMemo(
    () => summarizeDownloadsRows(state.downloadsRows),
    [state.downloadsRows]
  )
  const visibleDownloadsRows = useMemo(
    () =>
      state.downloadsRows.filter((row) =>
        downloadsRowMatchesStatus(row, state.downloadsStatusFilter)
      ),
    [state.downloadsRows, state.downloadsStatusFilter]
  )
  const downloadsStatusFilterChips = useMemo(
    (): Array<{ id: DownloadsStatusFilter; label: string }> => [
      { id: 'all', label: uiText('downloadsQueueFilterAll') },
      { id: 'running', label: uiText('downloadsQueueFilterRunning') },
      { id: 'done', label: uiText('downloadsQueueFilterDone') },
      { id: 'error', label: uiText('downloadsQueueFilterError') },
      { id: 'cancelled', label: uiText('downloadsQueueFilterCancelled') }
    ],
    []
  )

  const handleDownloadsRailSectionToggle = useCallback(
    (key: DownloadsRailPanelKey) => {
      return (e: SyntheticEvent<HTMLDetailsElement>): void => {
        const open = e.currentTarget.open
        state.persistDownloadsRailPanelToggle(key, open)
      }
    },
    [state]
  )

  const {
    handleAddDownloadsFromMain,
    handleQuickYtdlpEnqueueLines,
    handleDownloadFirstUrlOpenInEditor
  } = useDownloadsUrlActions({
    downloadsUrl: state.downloadsUrl,
    setDownloadsUrl: state.setDownloadsUrl,
    setWorkspaceTab: state.setWorkspaceTab,
    setStatusHint: state.setStatusHint
  })

  const { refreshEngineUi } = useAppMainWindowEffects({
    trimSnapshotRef,
    currentSourcePath,
    setDownloadsRows: state.setDownloadsRows,
    setTheme: state.setTheme,
    setUiLocaleRenderTick: state.setUiLocaleRenderTick,
    hydrateExportFieldsFromSettings: state.hydrateExportFieldsFromSettings,
    hydrateMainWindowUiPanels: state.hydrateMainWindowUiPanels,
    hydrateDownloadsWindowUiPanels: state.hydrateDownloadsWindowUiPanels,
    setExportUserPresets: state.setExportUserPresets,
    setSnapshotFormat: state.setSnapshotFormat,
    refetchHwEncoders: state.refetchHwEncoders,
    applyPreview,
    previewPath: currentSourcePath,
    previewMediaUrl: state.preview?.mediaUrl,
    setPreviewBlobUrl: state.setPreviewBlobUrl,
    setProbeInfo: state.setProbeInfo,
    setProbePending: state.setProbePending,
    setStatusHint: state.setStatusHint,
    setEngineSummary: state.setEngineSummary,
    setEngineVersionsLine: state.setEngineVersionsLine,
    setEnginesOfferDownload: state.setEnginesOfferDownload,
    engineSummary: state.engineSummary,
    appSettingsOpen: state.appSettingsOpen,
    appSettingsSection: state.appSettingsSection,
    setAppSettingsOpen: state.setAppSettingsOpen,
    setAppSettingsSection: state.setAppSettingsSection,
    setEnginePathsDraft: state.setEnginePathsDraft,
    setExternalFilterScriptOpen: state.setExternalFilterScriptOpen,
    setWorkflowPlannerOpen: state.setWorkflowPlannerOpen,
    setWorkflowScenarioBuilderOpen: state.setWorkflowScenarioBuilderOpen,
    setAboutInfo: state.setAboutInfo,
    setAboutOpen: state.setAboutOpen,
    editorUrlPasteBehavior: state.editorUrlPasteBehavior,
    setWorkspaceTab: state.setWorkspaceTab,
    setDownloadsUrl: state.setDownloadsUrl,
    setDownloadsNarrowLayout: state.setDownloadsNarrowLayout
  })

  const {
    batchSnapshot,
    batchDragRowId,
    setBatchDragRowId,
    batchExportBusy,
    handleBatchOpenOutput,
    handleBatchOpenInput,
    handleBatchPickFiles,
    handleBatchPickFolder,
    handleBatchPickOutputFolder,
    handleBatchClearOutputDirectory,
    handleBatchRevealSharedOutputFolder,
    handleBatchDropFiles,
    handleBatchStart,
    handleBatchCancel,
    handleBatchRetryFailed,
    handleBatchClearCompleted,
    handleBatchAddCurrentPreview,
    handleBatchAddDownloadsDone,
    handleBatchRetryFailedAndStart,
    handleBatchCopyInputPaths,
    handleBatchCopyOutputPaths,
    handleBatchCopyRowPath,
    handleBatchSaveReport,
    handleBatchRemoveWaiting,
    reportBatchPathsAdded
  } = useFfmpegExportBatch({
    setStatusHint: state.setStatusHint,
    setWorkspaceTab: state.setWorkspaceTab,
    buildExportOverrides: state.buildCurrentFfmpegExportOverrides,
    previewPath: state.preview?.path,
    exportBusy: state.exportBusy,
    setBatchOutputDirectory: state.setBatchOutputDirectory,
    onBatchRunFinished: () => {
      void state.refreshProcessingHistory(undefined, { silent: true })
    }
  })

  const {
    handleSnapshot,
    handleExtractFrames,
    handleExport,
    handleCancelExport,
    handleOpenLastExport,
    handleCopyLastExportPath,
    handleOpenLastSnapshot,
    handleCopyLastSnapshotPath,
    exportPreview,
    exportPreviewCommand,
    exportPreviewHint,
    handleCopyExportPreview
  } = useEditorExportPipeline({
    setStatusHint: state.setStatusHint,
    preview: state.preview,
    probeInfo: state.probeInfo,
    trimRange,
    trimSnapshotRef,
    videoRef: state.videoRef,
    exportBusy: state.exportBusy,
    setExportBusy: state.setExportBusy,
    exportCancelBusy: state.exportCancelBusy,
    setExportCancelBusy: state.setExportCancelBusy,
    batchExportBusy,
    snapshotBusy: state.snapshotBusy,
    setSnapshotBusy: state.setSnapshotBusy,
    extractFramesBusy: state.extractFramesBusy,
    setExtractFramesBusy: state.setExtractFramesBusy,
    snapshotFormat: state.snapshotFormat,
    refreshProcessingHistory: state.refreshProcessingHistory,
    buildCurrentFfmpegExportOverrides: state.buildCurrentFfmpegExportOverrides,
    exportContainer: state.exportContainer,
    exportEncodePreset: state.exportEncodePreset,
    exportVideoCodecResolvedForPreview: state.exportVideoCodecResolvedForPreview,
    exportCrf: state.exportCrf,
    exportVideoBitrate: state.exportVideoBitrate,
    exportAudioMode: state.exportAudioMode,
    exportAudioBitrate: state.exportAudioBitrate,
    exportFps: state.exportFps,
    exportScalePreset: state.exportScalePreset,
    exportVideoTransform: state.exportVideoTransform,
    exportCropPreset: state.exportCropPreset,
    exportTwoPass: state.exportTwoPass,
    exportEconomyMode: state.exportEconomyMode,
    exportHwaccelDecodeForPreview: state.exportHwaccelDecodeForPreview,
    exportExtraArgsParsed: state.exportExtraArgsParsed,
    exportAudioGainDb: state.exportAudioGainDb,
    exportStripMetadata: state.exportStripMetadata,
    exportStripChapters: state.exportStripChapters,
    exportSubtitleMode: state.exportSubtitleMode,
    exportVideoDeinterlace: state.exportVideoDeinterlace,
    exportVideoDenoise: state.exportVideoDenoise,
    exportVideoDeband: state.exportVideoDeband,
    exportVideoHisteq: state.exportVideoHisteq,
    lutCubePathForPreview: state.lutCubePathForPreview,
    exportVideoSharpen: state.exportVideoSharpen,
    exportVideoEqPreset: state.exportVideoEqPreset,
    exportVideoHue: state.exportVideoHue,
    exportVideoGrain: state.exportVideoGrain,
    exportVideoVignette: state.exportVideoVignette,
    exportVideoBlur: state.exportVideoBlur,
    exportAudioNormalize: state.exportAudioNormalize,
    externalFilterForPreview: state.externalFilterForPreview,
    lastExportPath: state.lastExportPath,
    setLastExportPath: state.setLastExportPath,
    lastSnapshotPath: state.lastSnapshotPath,
    setLastSnapshotPath: state.setLastSnapshotPath
  })

  const {
    toggleTheme,
    handleUiLocaleToggle,
    handleOpenToolbar,
    handleOpenVideoFolderToolbar,
    handleEnginesDownload,
    handleEnginesCheckUpdates,
    handleClearDownloadedEngines,
    handleSaveEnginePaths,
    handlePickEngine
  } = useAppToolbarEngineActions({
    applyPreview,
    setStatusHint: state.setStatusHint,
    setUiLocaleRenderTick: state.setUiLocaleRenderTick,
    refreshEngineUi,
    setEngineDownloadBusy: state.setEngineDownloadBusy,
    enginePathsDraft: state.enginePathsDraft,
    setEnginePathsDraft: state.setEnginePathsDraft,
    setAppSettingsOpen: state.setAppSettingsOpen,
    setEnginePathsSaving: state.setEnginePathsSaving
  })

  return {
    trimSnapshotRef,
    trimRange,
    currentSourcePath,
    previewPlaybackUrl,
    applyPreview,
    handlePreviewVideoError,
    handlePreviewVideoLoaded,
    onTrimRangeSnapshot,
    jumpToTrimExport,
    handlePreviewDrop,
    terminalLine,
    setTerminalLine,
    terminalBusy,
    terminalHintFilter,
    setTerminalHintFilter,
    terminalHintToolFilter,
    setTerminalHintToolFilter,
    terminalHintCatalogTotal,
    terminalHintCatalogCapped,
    terminalHistory,
    terminalSuggestFocus,
    setTerminalSuggestFocus,
    terminalSuggestBlurTimeoutRef,
    terminalHintsSearchFieldId,
    terminalCommandInputId,
    visibleTerminalHints,
    terminalInlineSuggestions,
    terminalSuggestActiveIndex,
    setTerminalSuggestIndex,
    appendTerminalToken,
    applyTerminalSuggest,
    runTerminalLine,
    recallTerminalCommand,
    copyTerminalOutputLine,
    downloadsStats,
    visibleDownloadsRows,
    downloadsStatusFilterChips,
    handleDownloadsRailSectionToggle,
    handleAddDownloadsFromMain,
    handleQuickYtdlpEnqueueLines,
    handleDownloadFirstUrlOpenInEditor,
    refreshEngineUi,
    batchSnapshot,
    batchDragRowId,
    setBatchDragRowId,
    batchExportBusy,
    handleBatchOpenOutput,
    handleBatchOpenInput,
    handleBatchPickFiles,
    handleBatchPickFolder,
    handleBatchPickOutputFolder,
    handleBatchClearOutputDirectory,
    handleBatchRevealSharedOutputFolder,
    handleBatchDropFiles,
    handleBatchStart,
    handleBatchCancel,
    handleBatchRetryFailed,
    handleBatchClearCompleted,
    handleBatchAddCurrentPreview,
    handleBatchAddDownloadsDone,
    handleBatchRetryFailedAndStart,
    handleBatchCopyInputPaths,
    handleBatchCopyOutputPaths,
    handleBatchCopyRowPath,
    handleBatchSaveReport,
    handleBatchRemoveWaiting,
    reportBatchPathsAdded,
    handleSnapshot,
    handleExtractFrames,
    handleExport,
    handleCancelExport,
    handleOpenLastExport,
    handleCopyLastExportPath,
    handleOpenLastSnapshot,
    handleCopyLastSnapshotPath,
    exportPreview,
    exportPreviewCommand,
    exportPreviewHint,
    handleCopyExportPreview,
    toggleTheme,
    handleUiLocaleToggle,
    handleOpenToolbar,
    handleOpenVideoFolderToolbar,
    handleEnginesDownload,
    handleEnginesCheckUpdates,
    handleClearDownloadedEngines,
    handleSaveEnginePaths,
    handlePickEngine
  }
}
