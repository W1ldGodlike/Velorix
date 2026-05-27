import type { AppShellPropsInputCtx } from './use-app-shell-props-input-workspace-types'
import type { UseAppShellLayoutPropsInput } from './use-app-shell-layout-props'

export function buildAppShellPropsInputLayout(
  ctx: AppShellPropsInputCtx
): UseAppShellLayoutPropsInput {
  const {
    exportPresetSaving,
    enginePathsSaving,
    appSettingsOpen,
    appSettingsSection,
    settingsResetBusy,
    externalFilterScriptOpen,
    mediaFileUtilitiesOpen,
    workflowPlannerOpen,
    workflowScenarioBuilderOpen,
    processErrorDialog,
    quitConfirmRequest,
    setWorkspaceTab,
    setKnowledgeInitialSlug,
    setKnowledgeOpen,
    setAboutInfo,
    setAboutOpen,
    setAppSettingsOpen,
    setAppSettingsSection,
    setSettingsResetBusy,
    setEditorUrlPasteBehavior,
    editorUrlPasteBehavior,
    setUiLocaleRenderTick,
    setExternalFilterScriptOpen,
    setMediaFileUtilitiesOpen,
    setWorkflowPlannerOpen,
    setWorkflowScenarioBuilderOpen,
    setProcessErrorDialog,
    setQuitConfirmRequest,
    handleOpenVideoFolderToolbar,
    handleOpenToolbar,
    handleCancelExport,
    handleExtractFrames,
    handleEnginesDownload,
    handleUiLocaleToggle,
    exportCodecStatusbarLabel,
    exportCodecStatusbarTitle,
    exportCodecStatusbarAria,
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
    handleEnginesCheckUpdates,
    handleClearDownloadedEngines,
    handleSaveEnginePaths,
    hydrateExportFieldsFromSettings,
    engineDownloadBusy
  } = ctx

  return {
    topbar: {
      setKnowledgeInitialSlug,
      setKnowledgeOpen,
      setAboutInfo,
      setAboutOpen,
      setAppSettingsOpen,
      setAppSettingsSection,
      handleOpenVideoFolderToolbar,
      handleOpenToolbar,
      handleCancelExport,
      handleExtractFrames,
      handleEnginesDownload,
      handleUiLocaleToggle
    },
    statusbar: {
      exportCodecStatusbarLabel,
      exportCodecStatusbarTitle,
      exportCodecStatusbarAria
    },
    overlay: {
      aboutOpen,
      aboutInfo,
      setAboutOpen,
      knowledgeOpen,
      knowledgeInitialSlug,
      setKnowledgeOpen,
      setKnowledgeInitialSlug,
      processErrorDialog,
      setProcessErrorDialog,
      quitConfirmRequest,
      setQuitConfirmRequest,
      uiLocaleRenderTick,
      onStatusHint: setStatusHint
    },
    exportPreset: {
      dialog: exportPresetNameDialog,
      exportPresetSaving,
      setDialog: setExportPresetNameDialog,
      handleSubmitExportPresetName
    },
    appSettings: {
      open: appSettingsOpen,
      section: appSettingsSection,
      setSection: setAppSettingsSection,
      setOpen: setAppSettingsOpen,
      setKnowledgeOpen,
      setKnowledgeInitialSlug,
      editorUrlPasteBehavior,
      setEditorUrlPasteBehavior,
      setUiLocaleRenderTick,
      enginePathsSaving,
      engineDownloadBusy,
      enginePathsDraft,
      setEnginePathsDraft,
      settingsResetBusy,
      setSettingsResetBusy,
      setWorkspaceTab,
      setAboutInfo,
      setAboutOpen,
      handlePickEngine,
      handleEnginesCheckUpdates,
      handleClearDownloadedEngines,
      handleSaveEnginePaths,
      onStatus: setStatusHint
    },
    externalFilterScript: {
      open: externalFilterScriptOpen,
      setOpen: setExternalFilterScriptOpen,
      onStatus: setStatusHint,
      onApplied: () => {
        void window.velorix.settings.get().then((loaded) => {
          hydrateExportFieldsFromSettings(loaded)
        })
      }
    },
    workflowPlanner: {
      open: workflowPlannerOpen,
      setOpen: setWorkflowPlannerOpen
    },
    workflowScenarioBuilder: {
      open: workflowScenarioBuilderOpen,
      setOpen: setWorkflowScenarioBuilderOpen,
      onStatus: setStatusHint
    },
    mediaFileUtilities: {
      open: mediaFileUtilitiesOpen,
      setOpen: setMediaFileUtilitiesOpen,
      onStatus: setStatusHint
    }
  }
}
