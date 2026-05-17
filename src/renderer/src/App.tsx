import { useCallback, useId, useMemo, useRef, useState } from 'react'
import type { JSX, SyntheticEvent } from 'react'

import { AppShellLayout } from './components/shell/AppShellLayout'
import { uiText } from './locales/ui-text'
import type { ResolvedAppTheme } from '../../shared/settings-contract'
import type { RestoredSourceInfo } from '../../shared/preview-dialog-contract'
import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'
import {
  useDownloadsWindowUiPanels,
  type DownloadsRailPanelKey
} from './use-downloads-window-ui-panels'
import { useMainWindowUiPanels } from './use-main-window-ui-panels'
import { useEditorExportSettings } from './use-editor-export-settings'
import { useEditorExportPipeline } from './use-editor-export-pipeline'
import { useAppShellProps } from './use-app-shell-props'
import { useAppProcessingHistory } from './use-app-processing-history'
import { useAppMainWindowEffects } from './use-app-main-window-effects'
import { useAppPreviewWorkspace } from './use-app-preview-workspace'
import { useAppToolbarEngineActions } from './use-app-toolbar-engine-actions'
import { useFfmpegExportBatch } from './use-ffmpeg-export-batch'
import { useTerminalWorkspace } from './use-terminal-workspace'
import { useDownloadsUrlActions } from './use-downloads-url-actions'
import { useDownloadsWorkspace } from './use-downloads-workspace'
import { type EnginePathsDraft, type EngineSummary } from './app-engines-ui'
import type { WorkspaceTab } from './app-terminal-hint-ui'
import {
  type DownloadsQueueRowView,
  type DownloadsStatusFilter,
  downloadsRowMatchesStatus,
  summarizeDownloadsRows
} from './downloads-queue-view'

function App(): JSX.Element {
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('editor')
  const [theme, setTheme] = useState<ResolvedAppTheme>('dark')
  const [engineSummary, setEngineSummary] = useState<EngineSummary>('checking')
  const [enginesOfferDownload, setEnginesOfferDownload] = useState(false)
  const [engineDownloadBusy, setEngineDownloadBusy] = useState(false)
  const [enginePathsOpen, setEnginePathsOpen] = useState(false)
  /** Сброс дерева после `applyPersistedUiLocale` — строки из `ui-text` читают `getUiLocale()` из модуля. */
  const [uiLocaleRenderTick, setUiLocaleRenderTick] = useState(0)
  const [knowledgeOpen, setKnowledgeOpen] = useState(false)
  const [knowledgeInitialSlug, setKnowledgeInitialSlug] = useState<string | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [aboutInfo, setAboutInfo] = useState<Awaited<
    ReturnType<typeof window.fluxalloy.about.getInfo>
  > | null>(null)
  const [enginePathsDraft, setEnginePathsDraft] = useState<EnginePathsDraft>({
    ffmpeg: '',
    ffprobe: '',
    'yt-dlp': ''
  })
  const [enginePathsSaving, setEnginePathsSaving] = useState(false)
  /** Подстрочное сообщение статусбара: прогресс загрузки движков, ошибки DnD и т.п. */
  const [statusHint, setStatusHint] = useState<string | null>(null)
  const [preview, setPreview] = useState<RestoredSourceInfo | null>(null)
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null)
  const [probeInfo, setProbeInfo] = useState<MediaProbeSuccess | null>(null)
  const [probePending, setProbePending] = useState(false)
  const [downloadsUrl, setDownloadsUrl] = useState('')
  const [downloadsRows, setDownloadsRows] = useState<DownloadsQueueRowView[]>([])
  const [downloadsStatusFilter, setDownloadsStatusFilter] = useState<DownloadsStatusFilter>('all')
  const {
    downloadsOptions,
    setDownloadsOptions,
    downloadsOptionsBusy,
    downloadsExpertHintFilter,
    setDownloadsExpertHintFilter,
    downloadsHistory,
    setDownloadsHistory,
    downloadsHistoryBusy,
    downloadsHistoryOutcomeFilter,
    setDownloadsHistoryOutcomeFilter,
    downloadsHistoryWeeklySummary,
    downloadsLogLines,
    setDownloadsLogLines,
    downloadsLogTargetRowId,
    setDownloadsLogTargetRowId,
    downloadsOutputDirectory,
    setDownloadsOutputDirectory,
    visibleDownloadsHistory,
    ytdlpCommandHintsFilteredByCategory,
    refreshDownloadsOptions,
    applyDownloadsOptionsPatch,
    appendDownloadsExtraArgsToken,
    refreshDownloadsHistory,
    exportVisibleDownloadsHistory,
    refreshDownloadsOutputDirectory
  } = useDownloadsWorkspace({ setStatusHint })
  const {
    processingHistory,
    setProcessingHistory,
    processingHistoryBusy,
    processingHistoryFilter,
    processingHistoryWeeklySummary,
    setProcessingHistoryWeeklySummary,
    refreshProcessingHistory,
    applyProcessingHistoryFilter,
    exportVisibleProcessingHistory
  } = useAppProcessingHistory({ setStatusHint })
  const {
    downloadsEmbeddedHistoryOpen,
    downloadsEmbeddedLogOpen,
    downloadsRailPanels,
    hydrateDownloadsWindowUiPanels,
    persistDownloadsEmbeddedHistoryOpen,
    persistDownloadsEmbeddedLogOpen,
    persistDownloadsRailPanelToggle
  } = useDownloadsWindowUiPanels()
  /** Совпадает с `max-width: 1100px` в `main.css` для вкладки «Загрузки». */
  const [downloadsNarrowLayout, setDownloadsNarrowLayout] = useState(false)
  const downloadsMainUrlFieldId = useId()
  const [engineVersionsLine, setEngineVersionsLine] = useState('')
  const [exportBusy, setExportBusy] = useState(false)
  const [exportCancelBusy, setExportCancelBusy] = useState(false)
  const {
    exportEncodePreset,
    setExportEncodePreset,
    exportVideoCodec,
    setExportVideoCodec,
    hwEncoderProbe,
    exportContainer,
    setExportContainer,
    exportCrf,
    setExportCrf,
    exportVideoBitrate,
    setExportVideoBitrate,
    exportAudioMode,
    setExportAudioMode,
    exportAudioBitrate,
    setExportAudioBitrate,
    exportFps,
    setExportFps,
    exportVideoTransform,
    setExportVideoTransform,
    exportCropPreset,
    setExportCropPreset,
    exportScalePreset,
    setExportScalePreset,
    exportTwoPass,
    setExportTwoPass,
    exportEconomyMode,
    setExportEconomyMode,
    exportHwDecode,
    setExportHwDecode,
    exportExtraArgsLine,
    setExportExtraArgsLine,
    editorUrlPasteBehavior,
    setEditorUrlPasteBehavior,
    batchOutputSuffix,
    setBatchOutputSuffix,
    batchOutputDirectory,
    setBatchOutputDirectory,
    exportAudioGainDb,
    setExportAudioGainDb,
    exportStripMetadata,
    setExportStripMetadata,
    exportStripChapters,
    setExportStripChapters,
    exportSubtitleMode,
    setExportSubtitleMode,
    exportVideoDeinterlace,
    setExportVideoDeinterlace,
    exportVideoDenoise,
    setExportVideoDenoise,
    exportVideoDeband,
    setExportVideoDeband,
    exportVideoHisteq,
    setExportVideoHisteq,
    exportVideoLut3d,
    setExportVideoLut3d,
    lutCubePathForPreview,
    exportVideoSharpen,
    setExportVideoSharpen,
    exportVideoEqPreset,
    setExportVideoEqPreset,
    exportVideoHue,
    setExportVideoHue,
    exportVideoGrain,
    setExportVideoGrain,
    exportVideoVignette,
    setExportVideoVignette,
    exportVideoBlur,
    setExportVideoBlur,
    exportAudioNormalize,
    setExportAudioNormalize,
    exportUserPresets,
    setExportUserPresets,
    selectedUserPresetId,
    setSelectedUserPresetId,
    selectedExportUserPreset,
    exportPresetNameDialog,
    setExportPresetNameDialog,
    exportPresetSaving,
    lastExportPath,
    setLastExportPath,
    lastSnapshotPath,
    setLastSnapshotPath,
    snapshotFormat,
    setSnapshotFormat,
    snapshotBusy,
    setSnapshotBusy,
    ffmpegExportSelectOptions,
    exportVideoCodecResolvedForPreview,
    exportExtraArgsParsed,
    exportHwaccelDecodeForPreview,
    exportCodecStatusbarLabel,
    refetchHwEncoders,
    hydrateExportFieldsFromSettings,
    bumpManualExportEdit,
    buildCurrentFfmpegExportOverrides,
    handleSaveExportUserPreset,
    handleDeleteExportUserPreset,
    handleRenameExportUserPreset,
    handleSubmitExportPresetName,
    handleOverwriteExportUserPreset
  } = useEditorExportSettings({ setStatusHint })
  const videoRef = useRef<HTMLVideoElement>(null)
  const { panelOpen, hydrateMainWindowUiPanels, persistMainWindowUiPanelToggle } =
    useMainWindowUiPanels()
  /** Стек видео+транспорт+таймлайн: цель fullscreen по референсу v0. */
  const previewStackRef = useRef<HTMLDivElement>(null)
  /** §6 / узкая ширина: `scrollIntoView` к панели настроек yt-dlp под очередью. */
  const downloadsSettingsRailRef = useRef<HTMLElement | null>(null)

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
    preview,
    setPreview,
    previewBlobUrl,
    setPreviewBlobUrl,
    setProbeInfo,
    setStatusHint,
    setWorkspaceTab,
    persistMainWindowUiPanelToggle,
    editorUrlPasteBehavior,
    setDownloadsUrl
  })

  const {
    terminalLine,
    setTerminalLine,
    terminalBusy,
    terminalHintFilter,
    setTerminalHintFilter,
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
    copyTerminalOutputLine
  } = useTerminalWorkspace({
    workspaceTab,
    currentSourcePath,
    setStatusHint
  })

  const downloadsStats = useMemo(() => summarizeDownloadsRows(downloadsRows), [downloadsRows])
  const visibleDownloadsRows = useMemo(
    () => downloadsRows.filter((row) => downloadsRowMatchesStatus(row, downloadsStatusFilter)),
    [downloadsRows, downloadsStatusFilter]
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
        persistDownloadsRailPanelToggle(key, open)
      }
    },
    [persistDownloadsRailPanelToggle]
  )

  const {
    handleAddDownloadsFromMain,
    handleQuickYtdlpEnqueueLines,
    handleDownloadFirstUrlOpenInEditor
  } = useDownloadsUrlActions({
    downloadsUrl,
    setDownloadsUrl,
    setWorkspaceTab,
    setStatusHint
  })

  const { refreshEngineUi } = useAppMainWindowEffects({
    trimSnapshotRef,
    currentSourcePath,
    setDownloadsRows,
    setTheme,
    setUiLocaleRenderTick,
    hydrateExportFieldsFromSettings,
    hydrateMainWindowUiPanels,
    hydrateDownloadsWindowUiPanels,
    setExportUserPresets,
    setSnapshotFormat,
    refetchHwEncoders,
    applyPreview,
    previewPath: currentSourcePath,
    previewMediaUrl: preview?.mediaUrl,
    setPreviewBlobUrl,
    setProbeInfo,
    setProbePending,
    setStatusHint,
    setEngineSummary,
    setEngineVersionsLine,
    setEnginesOfferDownload,
    engineSummary,
    enginePathsOpen,
    setEnginePathsDraft,
    setEnginePathsOpen,
    setAboutInfo,
    setAboutOpen,
    editorUrlPasteBehavior,
    setWorkspaceTab,
    setDownloadsUrl,
    setDownloadsNarrowLayout
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
    setStatusHint,
    setWorkspaceTab,
    buildExportOverrides: buildCurrentFfmpegExportOverrides,
    previewPath: preview?.path,
    exportBusy,
    setBatchOutputDirectory,
    onBatchRunFinished: refreshProcessingHistory
  })

  const {
    handleSnapshot,
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
    setStatusHint,
    preview,
    probeInfo,
    trimRange,
    trimSnapshotRef,
    videoRef,
    exportBusy,
    setExportBusy,
    exportCancelBusy,
    setExportCancelBusy,
    batchExportBusy,
    snapshotBusy,
    setSnapshotBusy,
    refreshProcessingHistory,
    buildCurrentFfmpegExportOverrides,
    exportContainer,
    exportEncodePreset,
    exportVideoCodecResolvedForPreview,
    exportCrf,
    exportVideoBitrate,
    exportAudioMode,
    exportAudioBitrate,
    exportFps,
    exportScalePreset,
    exportVideoTransform,
    exportCropPreset,
    exportTwoPass,
    exportEconomyMode,
    exportHwaccelDecodeForPreview,
    exportExtraArgsParsed,
    exportAudioGainDb,
    exportStripMetadata,
    exportStripChapters,
    exportSubtitleMode,
    exportVideoDeinterlace,
    exportVideoDenoise,
    exportVideoDeband,
    exportVideoHisteq,
    lutCubePathForPreview,
    exportVideoSharpen,
    exportVideoEqPreset,
    exportVideoHue,
    exportVideoGrain,
    exportVideoVignette,
    exportVideoBlur,
    exportAudioNormalize,
    lastExportPath,
    setLastExportPath,
    lastSnapshotPath,
    setLastSnapshotPath
  })

  const {
    toggleTheme,
    handleUiLocaleToggle,
    handleOpenToolbar,
    handleOpenVideoFolderToolbar,
    handleEnginesDownload,
    handleClearDownloadedEngines,
    handleSaveEnginePaths,
    handlePickEngine
  } = useAppToolbarEngineActions({
    applyPreview,
    setStatusHint,
    setUiLocaleRenderTick,
    refreshEngineUi,
    setEngineDownloadBusy,
    enginePathsDraft,
    setEnginePathsDraft,
    setEnginePathsOpen,
    setEnginePathsSaving
  })

  const appShellProps = useAppShellProps({
    workspace: {
    shell: {
      workspaceTab,
      panelOpen,
      persistMainWindowUiPanelToggle,
      downloadsSettingsRailRef
    },
    knowledge: {
      setKnowledgeInitialSlug,
      setKnowledgeOpen
    },
    busy: {
      engineDownloadBusy,
      exportBusy,
      snapshotBusy,
      probePending,
      exportCancelBusy,
      batchExportBusy,
      downloadsOptionsBusy,
      downloadsHistoryBusy
    },
    editorQuick: {
      downloadsUrl,
      setDownloadsUrl,
      editorUrlPasteBehavior,
      setEditorUrlPasteBehavior,
      handleQuickYtdlpEnqueueLines,
      handleDownloadFirstUrlOpenInEditor
    },
    editorBatch: {
      batchExportBusy,
      batchSnapshot,
      batchOutputSuffix,
      setBatchOutputSuffix,
      batchOutputDirectory,
      batchDragRowId,
      setBatchDragRowId,
      previewPath: preview?.path,
      setStatusHint,
      handleBatchDropFiles,
      handleBatchPickOutputFolder,
      handleBatchRevealSharedOutputFolder,
      handleBatchClearOutputDirectory,
      handleBatchPickFiles,
      handleBatchPickFolder,
      handleBatchAddCurrentPreview,
      handleBatchAddDownloadsDone,
      handleBatchStart,
      handleBatchCancel,
      handleBatchRetryFailed,
      handleBatchRetryFailedAndStart,
      handleBatchClearCompleted,
      handleBatchCopyInputPaths,
      handleBatchCopyOutputPaths,
      handleBatchSaveReport,
      handleBatchRemoveWaiting,
      handleBatchOpenOutput,
      handleBatchOpenInput,
      handleBatchCopyRowPath
    },
    editorPreview: {
      preview,
      previewPlaybackUrl,
      previewStackRef,
      videoRef,
      probeInfo,
      probePending,
      exportBusy,
      snapshotBusy,
      handlePreviewDrop,
      handlePreviewVideoLoaded,
      handlePreviewVideoError,
      onTrimRangeSnapshot,
      jumpToTrimExport,
      handleExport,
      handleSnapshot
    },
    editorFfmpeg: {
      setStatusHint,
      exportBusy,
      exportCancelBusy,
      snapshotBusy,
      probePending,
      exportEncodePreset,
      setExportEncodePreset,
      exportVideoCodec,
      setExportVideoCodec,
      exportContainer,
      setExportContainer,
      exportCrf,
      setExportCrf,
      exportVideoBitrate,
      setExportVideoBitrate,
      exportAudioMode,
      setExportAudioMode,
      exportAudioBitrate,
      setExportAudioBitrate,
      exportFps,
      setExportFps,
      exportVideoTransform,
      setExportVideoTransform,
      exportCropPreset,
      setExportCropPreset,
      exportScalePreset,
      setExportScalePreset,
      exportTwoPass,
      setExportTwoPass,
      exportEconomyMode,
      setExportEconomyMode,
      exportHwDecode,
      setExportHwDecode,
      exportExtraArgsLine,
      setExportExtraArgsLine,
      exportAudioGainDb,
      setExportAudioGainDb,
      exportStripMetadata,
      setExportStripMetadata,
      exportStripChapters,
      setExportStripChapters,
      exportSubtitleMode,
      setExportSubtitleMode,
      exportVideoDeinterlace,
      setExportVideoDeinterlace,
      exportVideoDenoise,
      setExportVideoDenoise,
      exportVideoDeband,
      setExportVideoDeband,
      exportVideoHisteq,
      setExportVideoHisteq,
      exportVideoLut3d,
      setExportVideoLut3d,
      exportVideoSharpen,
      setExportVideoSharpen,
      exportVideoEqPreset,
      setExportVideoEqPreset,
      exportVideoHue,
      setExportVideoHue,
      exportVideoGrain,
      setExportVideoGrain,
      exportVideoVignette,
      setExportVideoVignette,
      exportVideoBlur,
      setExportVideoBlur,
      exportAudioNormalize,
      setExportAudioNormalize,
      exportUserPresets,
      selectedUserPresetId,
      setSelectedUserPresetId,
      selectedExportUserPreset,
      lastExportPath,
      lastSnapshotPath,
      snapshotFormat,
      setSnapshotFormat,
      ffmpegExportSelectOptions,
      exportExtraArgsParsed,
      hydrateExportFieldsFromSettings,
      bumpManualExportEdit,
      handleSaveExportUserPreset,
      handleDeleteExportUserPreset,
      handleRenameExportUserPreset,
      handleOverwriteExportUserPreset,
      exportPreview,
      exportPreviewCommand,
      exportPreviewHint,
      handleCopyExportPreview,
      handleOpenLastExport,
      handleCopyLastExportPath,
      handleOpenLastSnapshot,
      handleCopyLastSnapshotPath,
      processingHistory,
      setProcessingHistory,
      processingHistoryBusy,
      processingHistoryFilter,
      processingHistoryWeeklySummary,
      setProcessingHistoryWeeklySummary,
      applyProcessingHistoryFilter,
      refreshProcessingHistory,
      exportVisibleProcessingHistory,
      reportBatchPathsAdded,
      hwEncoderProbe
    },
    terminal: {
      terminalBusy,
      terminalLine,
      setTerminalLine,
      terminalCommandInputId,
      terminalInlineSuggestions,
      terminalSuggestFocus,
      setTerminalSuggestFocus,
      terminalSuggestActiveIndex,
      setTerminalSuggestIndex,
      terminalSuggestBlurTimeoutRef,
      currentSourcePath,
      runTerminalLine,
      applyTerminalSuggest,
      appendTerminalToken,
      terminalHistory,
      copyTerminalOutputLine,
      terminalHintsSearchFieldId,
      terminalHintFilter,
      setTerminalHintFilter,
      visibleTerminalHints
    },
    downloads: {
      main: {
        downloadsOptionsBusy,
        downloadsHistoryBusy,
        downloadsUrl,
        setDownloadsUrl,
        downloadsMainUrlFieldId,
        downloadsNarrowLayout,
        downloadsStats,
        downloadsStatusFilter,
        setDownloadsStatusFilter,
        downloadsStatusFilterChips,
        downloadsRows,
        visibleDownloadsRows,
        setStatusHint,
        downloadsEmbeddedHistoryOpen,
        persistDownloadsEmbeddedHistoryOpen,
        visibleDownloadsHistory,
        downloadsHistoryCount: downloadsHistory.length,
        downloadsHistoryOutcomeFilter,
        setDownloadsHistoryOutcomeFilter,
        downloadsHistoryWeeklySummary: downloadsHistoryWeeklySummary ?? {
          since: 0,
          until: 0,
          total: 0,
          success: 0,
          error: 0,
          cancelled: 0
        },
        refreshDownloadsHistory,
        setDownloadsHistory,
        exportVisibleDownloadsHistory,
        downloadsEmbeddedLogOpen,
        persistDownloadsEmbeddedLogOpen,
        downloadsLogTargetRowId,
        downloadsLogLines,
        setDownloadsLogLines,
        setDownloadsLogTargetRowId
      },
      settings: {
        downloadsOptionsBusy,
        downloadsHistoryBusy,
        downloadsOptions,
        setDownloadsOptions,
        downloadsRailPanels,
        onRailSectionToggle: handleDownloadsRailSectionToggle,
        applyDownloadsOptionsPatch,
        downloadsOutputDirectory,
        setDownloadsOutputDirectory,
        refreshDownloadsOutputDirectory,
        setStatusHint,
        downloadsExpertHintFilter,
        setDownloadsExpertHintFilter,
        ytdlpCommandHintsFilteredByCategory,
        appendDownloadsExtraArgsToken,
        refreshDownloadsOptions
      },
      setWorkspaceTab,
      handleAddDownloadsFromMain,
      handleBatchAddDownloadsDone
    }
    },
    layout: {
    chromeBusy: {
      engineDownloadBusy,
      engineSummary,
      probePending,
      exportBusy,
      snapshotBusy,
      exportCancelBusy,
      terminalBusy,
      batchExportBusy,
      exportPresetSaving,
      enginePathsSaving,
      downloadsOptionsBusy,
      downloadsHistoryBusy
    },
    topbar: {
      workspaceTab,
      setWorkspaceTab,
      engineDownloadBusy,
      engineSummary,
      previewPath: preview?.path,
      exportBusy,
      exportCancelBusy,
      enginesOfferDownload,
      theme,
      setKnowledgeInitialSlug,
      setKnowledgeOpen,
      setAboutInfo,
      setAboutOpen,
      setEnginePathsOpen,
      handleOpenVideoFolderToolbar,
      handleOpenToolbar,
      handleCancelExport,
      handleEnginesDownload,
      handleUiLocaleToggle,
      toggleTheme
    },
    statusbar: {
      workspaceTab,
      engineDownloadBusy,
      engineSummary,
      engineVersionsLine,
      exportCodecStatusbarLabel,
      exportBusy,
      snapshotBusy,
      exportCancelBusy,
      probePending,
      batchExportBusy,
      statusHint
    },
    overlay: {
      aboutOpen,
      aboutInfo,
      setAboutOpen,
      knowledgeOpen,
      knowledgeInitialSlug,
      setKnowledgeOpen,
      setKnowledgeInitialSlug,
      uiLocaleRenderTick,
      onStatusHint: setStatusHint
    },
    exportPreset: {
      dialog: exportPresetNameDialog,
      exportPresetSaving,
      setDialog: setExportPresetNameDialog,
      handleSubmitExportPresetName
    },
    enginePaths: {
      enginePathsSaving,
      engineDownloadBusy,
      enginePathsDraft,
      setEnginePathsDraft,
      setEnginePathsOpen,
      handlePickEngine,
      handleClearDownloadedEngines,
      handleSaveEnginePaths
    }
    }
  })

  return <AppShellLayout {...appShellProps} />
}

export default App
