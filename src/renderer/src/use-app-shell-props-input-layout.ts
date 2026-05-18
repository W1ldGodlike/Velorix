import type { AppUiLocale } from '../../shared/app-ui-locale'
import { getUiLocale, uiText } from './locales/ui-text'
import { buildStatusbarActivityDisplay } from './statusbar-activity-resolve'
import type { AppShellPropsInputCtx } from './use-app-shell-props-input-workspace-types'
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
    extractFramesBusy,
    exportCancelBusy,
    terminalBusy,
    batchExportBusy,
    exportPresetSaving,
    enginePathsSaving,
    appSettingsOpen,
    appSettingsSection,
    settingsResetBusy,
    externalFilterScriptOpen,
    downloadsOptionsBusy,
    downloadsHistoryBusy,
    downloadsStats,
    workspaceTab,
    setWorkspaceTab,
    preview,
    enginesOfferDownload,
    theme,
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
    handleOpenVideoFolderToolbar,
    handleOpenToolbar,
    handleCancelExport,
    handleExtractFrames,
    handleEnginesDownload,
    handleUiLocaleToggle,
    toggleTheme,
    engineVersionsLine,
    exportCodecStatusbarLabel,
    exportCodecStatusbarTitle,
    exportCodecStatusbarAria,
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
    handleEnginesCheckUpdates,
    handleClearDownloadedEngines,
    handleSaveEnginePaths,
    hydrateExportFieldsFromSettings
  } = ctx

  const uiLocale = getUiLocale() as AppUiLocale
  const statusbarActivity = buildStatusbarActivityDisplay(
    {
      engineDownloadBusy,
      engineSummaryChecking: engineSummary === 'checking',
      exportBusy,
      snapshotBusy,
      extractFramesBusy,
      exportCancelBusy,
      probePending,
      batchExportBusy,
      terminalBusy,
      downloadsRunning: downloadsStats.running,
      downloadsOptionsBusy,
      downloadsHistoryBusy
    },
    (key: string) => uiText(key as Parameters<typeof uiText>[0])
  )

  return {
    chromeBusy: {
      engineDownloadBusy,
      engineSummary,
      probePending,
      exportBusy,
      snapshotBusy,
      extractFramesBusy,
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
      workspaceTab,
      engineDownloadBusy,
      engineSummary,
      engineVersionsLine,
      exportCodecStatusbarLabel,
      exportCodecStatusbarTitle,
      exportCodecStatusbarAria,
      exportBusy,
      snapshotBusy,
      exportCancelBusy,
      probePending,
      batchExportBusy,
      statusHint,
      uiLocale,
      statusbarActivityLabel: statusbarActivity.label,
      statusbarActivityTitle: statusbarActivity.title,
      statusbarActivityActive: statusbarActivity.active
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
    }
  }
}
