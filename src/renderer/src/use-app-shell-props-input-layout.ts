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
    workflowPlannerOpen,
    workflowScenarioBuilderOpen,
    setWorkspaceTab,
    setKnowledgeInitialSlug,
    setKnowledgeOpen,
    setAboutInfo,
    setAboutOpen,
    setAppSettingsOpen,
    setAppSettingsSection,
    setSettingsResetBusy,
    setTheme,
    setEditorUrlPasteBehavior,
    editorUrlPasteBehavior,
    setUiLocaleRenderTick,
    setExternalFilterScriptOpen,
    setWorkflowPlannerOpen,
    setWorkflowScenarioBuilderOpen,
    handleOpenVideoFolderToolbar,
    handleOpenToolbar,
    handleCancelExport,
    handleExtractFrames,
    handleEnginesDownload,
    handleUiLocaleToggle,
    toggleTheme,
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
    theme,
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
      handleUiLocaleToggle,
      toggleTheme
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
      theme,
      setTheme,
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
        void window.fluxalloy.settings.get().then((loaded) => {
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
    }
  }
}
