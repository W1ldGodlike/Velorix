import type { AppShellPropsInputCtx } from './use-app-shell-props-input-workspace'
import type { UseAppShellLayoutPropsInput } from './use-app-shell-layout-props'

export function buildAppShellPropsInputLayout(
  ctx: AppShellPropsInputCtx
): UseAppShellLayoutPropsInput {
  const {
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
    downloadsHistoryBusy,
    workspaceTab,
    setWorkspaceTab,
    preview,
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
    toggleTheme,
    engineVersionsLine,
    exportCodecStatusbarLabel,
    statusHint,
    aboutOpen,
    aboutInfo,
    knowledgeOpen,
    knowledgeInitialSlug,
    uiLocaleRenderTick,
    setStatusHint,
    exportPresetNameDialog,
    setExportPresetNameDialog,
    handleSubmitExportPresetName,
    enginePathsDraft,
    setEnginePathsDraft,
    handlePickEngine,
    handleClearDownloadedEngines,
    handleSaveEnginePaths
  } = ctx

  return {
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
}
