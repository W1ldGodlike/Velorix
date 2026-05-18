import { useCallback, useMemo } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import type { EngineSummary } from './app-engines-ui'
import type { AppOverlayDialogsProps } from './components/shell/AppOverlayDialogs'
import type { AppStatusbarProps } from './components/shell/AppStatusbar'
import type { AppWorkspaceTopbarProps } from './components/shell/AppWorkspaceTopbar'
import type { AppSettingsDialogProps } from './components/shell/AppSettingsDialog'
import type { AppSettingsDialogSection } from '../../shared/app-settings-dialog-section'
import type { AppUiLocale } from '../../shared/app-ui-locale'
import type { EditorUrlPasteBehaviorId } from '../../shared/editor-url-paste-behavior'
import type { ExportPresetNameDialogProps } from './components/shell/ExportPresetNameDialog'
import type { WorkspaceTab } from './app-terminal-hint-ui'
import type { ResolvedAppTheme } from '../../shared/settings-contract'
import type { EnginePathsDraft } from './app-engines-ui'
import type { EngineId } from '../../shared/engine-contract'
import type { ExportPresetNameDialogState } from './use-editor-export-settings'

export type UseAppShellLayoutPropsInput = {
  chromeBusy: {
    engineDownloadBusy: boolean
    engineSummary: EngineSummary
    probePending: boolean
    exportBusy: boolean
    snapshotBusy: boolean
    extractFramesBusy: boolean
    exportCancelBusy: boolean
    terminalBusy: boolean
    batchExportBusy: boolean
    exportPresetSaving: boolean
    enginePathsSaving: boolean
    downloadsOptionsBusy: boolean
    downloadsHistoryBusy: boolean
  }
  topbar: {
    workspaceTab: WorkspaceTab
    setWorkspaceTab: Dispatch<SetStateAction<WorkspaceTab>>
    engineDownloadBusy: boolean
    engineSummary: EngineSummary
    previewPath: string | undefined
    exportBusy: boolean
    exportCancelBusy: boolean
    enginesOfferDownload: boolean
    theme: ResolvedAppTheme
    setKnowledgeInitialSlug: Dispatch<SetStateAction<string | null>>
    setKnowledgeOpen: Dispatch<SetStateAction<boolean>>
    setAboutInfo: Dispatch<
      SetStateAction<Awaited<ReturnType<typeof window.fluxalloy.about.getInfo>> | null>
    >
    setAboutOpen: Dispatch<SetStateAction<boolean>>
    setAppSettingsOpen: Dispatch<SetStateAction<boolean>>
    setAppSettingsSection: Dispatch<SetStateAction<AppSettingsDialogSection>>
    handleOpenVideoFolderToolbar: () => Promise<void>
    handleOpenToolbar: () => Promise<void>
    handleCancelExport: () => Promise<void>
    handleExtractFrames: () => Promise<void>
    handleEnginesDownload: () => Promise<void>
    handleUiLocaleToggle: () => void
    toggleTheme: () => Promise<void>
  }
  statusbar: Omit<AppStatusbarProps, 'appChromeBusy'>
  overlay: AppOverlayDialogsProps
  exportPreset: {
    dialog: ExportPresetNameDialogState
    exportPresetSaving: boolean
    setDialog: Dispatch<SetStateAction<ExportPresetNameDialogState>>
    handleSubmitExportPresetName: () => Promise<void>
  }
  appSettings: {
    open: boolean
    section: AppSettingsDialogSection
    setSection: Dispatch<SetStateAction<AppSettingsDialogSection>>
    setOpen: Dispatch<SetStateAction<boolean>>
    theme: ResolvedAppTheme
    setTheme: Dispatch<SetStateAction<ResolvedAppTheme>>
    editorUrlPasteBehavior: EditorUrlPasteBehaviorId
    setEditorUrlPasteBehavior: Dispatch<SetStateAction<EditorUrlPasteBehaviorId>>
    setUiLocaleRenderTick: Dispatch<SetStateAction<number>>
    enginePathsSaving: boolean
    engineDownloadBusy: boolean
    enginePathsDraft: EnginePathsDraft
    setEnginePathsDraft: Dispatch<SetStateAction<EnginePathsDraft>>
    settingsResetBusy: boolean
    setSettingsResetBusy: Dispatch<SetStateAction<boolean>>
    setWorkspaceTab: Dispatch<SetStateAction<WorkspaceTab>>
    setAboutInfo: Dispatch<
      SetStateAction<Awaited<ReturnType<typeof window.fluxalloy.about.getInfo>> | null>
    >
    setAboutOpen: Dispatch<SetStateAction<boolean>>
    handlePickEngine: (id: EngineId) => Promise<void>
    handleEnginesCheckUpdates: () => Promise<void>
    handleClearDownloadedEngines: () => Promise<void>
    handleSaveEnginePaths: () => Promise<void>
    onStatus: (message: string) => void
    setKnowledgeOpen: Dispatch<SetStateAction<boolean>>
    setKnowledgeInitialSlug: Dispatch<SetStateAction<string | null>>
  }
  externalFilterScript: {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    onStatus: (message: string) => void
    onApplied: () => void
  }
  workflowPlanner: {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
  }
  workflowScenarioBuilder: {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    onStatus: (message: string) => void
  }
}

export type AppShellLayoutChromeProps = {
  appChromeBusy: boolean
  topbar: AppWorkspaceTopbarProps
  statusbar: AppStatusbarProps
  overlay: AppOverlayDialogsProps
  exportPreset: ExportPresetNameDialogProps
  appSettings: AppSettingsDialogProps
  externalFilterScript: {
    open: boolean
    onClose: () => void
    onStatus: (message: string) => void
    onApplied: () => void
  }
  workflowPlanner: {
    open: boolean
    onClose: () => void
    onStatus?: (message: string) => void
  }
  workflowScenarioBuilder: {
    open: boolean
    onClose: () => void
    onStatus: (message: string) => void
  }
}

export function useAppShellLayoutProps(input: UseAppShellLayoutPropsInput): AppShellLayoutChromeProps {
  const {
    chromeBusy,
    topbar: topbarInput,
    statusbar,
    overlay,
    exportPreset,
    appSettings,
    externalFilterScript,
    workflowPlanner,
    workflowScenarioBuilder
  } = input
  const {
    workspaceTab,
    setWorkspaceTab,
    engineDownloadBusy: topbarEngineDownloadBusy,
    engineSummary: topbarEngineSummary,
    previewPath,
    exportBusy: topbarExportBusy,
    exportCancelBusy: topbarExportCancelBusy,
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
  } = topbarInput
  const appChromeBusy = useMemo(
    () =>
      chromeBusy.engineDownloadBusy ||
      chromeBusy.engineSummary === 'checking' ||
      chromeBusy.probePending ||
      chromeBusy.exportBusy ||
      chromeBusy.snapshotBusy ||
      chromeBusy.extractFramesBusy ||
      chromeBusy.exportCancelBusy ||
      chromeBusy.terminalBusy ||
      chromeBusy.batchExportBusy ||
      chromeBusy.exportPresetSaving ||
      chromeBusy.enginePathsSaving ||
      chromeBusy.downloadsOptionsBusy ||
      chromeBusy.downloadsHistoryBusy,
    [chromeBusy]
  )

  const onOpenVideoFolder = useCallback((): void => {
    void handleOpenVideoFolderToolbar()
  }, [handleOpenVideoFolderToolbar])

  const onOpenFile = useCallback((): void => {
    void handleOpenToolbar()
  }, [handleOpenToolbar])

  const onCancelExport = useCallback((): void => {
    void handleCancelExport()
  }, [handleCancelExport])

  const onEnginesDownload = useCallback((): void => {
    void handleEnginesDownload()
  }, [handleEnginesDownload])

  const onOpenEnginePaths = useCallback((): void => {
    setAppSettingsSection('dependencies')
    setAppSettingsOpen(true)
  }, [setAppSettingsOpen, setAppSettingsSection])

  const onOpenKnowledge = useCallback((): void => {
    setKnowledgeInitialSlug(null)
    setKnowledgeOpen(true)
  }, [setKnowledgeInitialSlug, setKnowledgeOpen])

  const onOpenAbout = useCallback((): void => {
    void window.fluxalloy.about.getInfo().then((info) => {
      setAboutInfo(info)
      setAboutOpen(true)
    })
  }, [setAboutInfo, setAboutOpen])

  const onToggleTheme = useCallback((): void => {
    void toggleTheme()
  }, [toggleTheme])

  const topbarProps = useMemo(
    (): AppWorkspaceTopbarProps => ({
      appChromeBusy,
      workspaceTab,
      setWorkspaceTab,
      engineDownloadBusy: topbarEngineDownloadBusy,
      engineSummary: topbarEngineSummary,
      previewPath,
      exportBusy: topbarExportBusy,
      exportCancelBusy: topbarExportCancelBusy,
      enginesOfferDownload,
      theme,
      onOpenVideoFolder,
      onOpenFile,
      onCancelExport,
      onExtractFrames: handleExtractFrames,
      onEnginesDownload,
      onOpenEnginePaths,
      onOpenKnowledge,
      onOpenAbout,
      onUiLocaleToggle: handleUiLocaleToggle,
      onToggleTheme
    }),
    [
      appChromeBusy,
      enginesOfferDownload,
      handleExtractFrames,
      onCancelExport,
      onEnginesDownload,
      onOpenAbout,
      onOpenEnginePaths,
      onOpenFile,
      onOpenKnowledge,
      onOpenVideoFolder,
      onToggleTheme,
      handleUiLocaleToggle,
      previewPath,
      setWorkspaceTab,
      theme,
      topbarEngineDownloadBusy,
      topbarEngineSummary,
      topbarExportBusy,
      topbarExportCancelBusy,
      workspaceTab
    ]
  )

  const statusbarProps = useMemo(
    (): AppStatusbarProps => ({
      appChromeBusy,
      ...statusbar
    }),
    [appChromeBusy, statusbar]
  )

  const {
    dialog: exportPresetDialog,
    exportPresetSaving,
    setDialog: setExportPresetDialog,
    handleSubmitExportPresetName
  } = exportPreset

  const exportPresetProps = useMemo(
    (): ExportPresetNameDialogProps => ({
      dialog: exportPresetDialog,
      exportPresetSaving,
      setDialog: setExportPresetDialog,
      onSubmit: () => {
        void handleSubmitExportPresetName()
      }
    }),
    [exportPresetDialog, exportPresetSaving, handleSubmitExportPresetName, setExportPresetDialog]
  )

  const appSettingsProps = useMemo((): AppSettingsDialogProps => {
    const onUiLocalePersisted = (locale: AppUiLocale): void => {
      appSettings.setUiLocaleRenderTick((n) => n + 1)
      void locale
    }
    return {
      open: appSettings.open,
      section: appSettings.section,
      onSectionChange: appSettings.setSection,
      onClose: () => {
        appSettings.setOpen(false)
      },
      onStatus: appSettings.onStatus,
      setTheme: appSettings.setTheme,
      onUiLocalePersisted,
      editorUrlPasteBehavior: appSettings.editorUrlPasteBehavior,
      setEditorUrlPasteBehavior: appSettings.setEditorUrlPasteBehavior,
      setWorkspaceTab: appSettings.setWorkspaceTab,
      onOpenAbout: () => {
        void window.fluxalloy.about.getInfo().then((info) => {
          appSettings.setAboutInfo(info)
          appSettings.setAboutOpen(true)
        })
      },
      enginePathsSaving: appSettings.enginePathsSaving,
      engineDownloadBusy: appSettings.engineDownloadBusy,
      enginePathsDraft: appSettings.enginePathsDraft,
      setEnginePathsDraft: appSettings.setEnginePathsDraft,
      onPickEngine: (id) => {
        void appSettings.handlePickEngine(id)
      },
      onClearDownloadedEngines: () => {
        void appSettings.handleClearDownloadedEngines()
      },
      onCheckEngineUpdates: () => {
        void appSettings.handleEnginesCheckUpdates()
      },
      onSaveEnginePaths: () => {
        void appSettings.handleSaveEnginePaths()
      },
      resetBusy: appSettings.settingsResetBusy,
      setResetBusy: appSettings.setSettingsResetBusy,
      onOpenKnowledgeArticle: (slug) => {
        appSettings.setKnowledgeInitialSlug(slug)
        appSettings.setKnowledgeOpen(true)
      }
    }
  }, [appSettings])

  const externalFilterScriptProps = useMemo(
    () => ({
      open: externalFilterScript.open,
      onClose: () => {
        externalFilterScript.setOpen(false)
      },
      onStatus: externalFilterScript.onStatus,
      onApplied: externalFilterScript.onApplied
    }),
    [externalFilterScript]
  )

  const workflowPlannerProps = useMemo(
    () => ({
      open: workflowPlanner.open,
      onClose: () => {
        workflowPlanner.setOpen(false)
      },
      onStatus: workflowScenarioBuilder.onStatus,
      onOpenKnowledgeArticle: (slug: string) => {
        setKnowledgeInitialSlug(slug)
        setKnowledgeOpen(true)
      }
    }),
    [workflowPlanner, workflowScenarioBuilder.onStatus, setKnowledgeInitialSlug, setKnowledgeOpen]
  )

  const workflowScenarioBuilderProps = useMemo(
    () => ({
      open: workflowScenarioBuilder.open,
      onClose: () => {
        workflowScenarioBuilder.setOpen(false)
      },
      onStatus: workflowScenarioBuilder.onStatus
    }),
    [workflowScenarioBuilder]
  )

  return {
    appChromeBusy,
    topbar: topbarProps,
    statusbar: statusbarProps,
    overlay,
    exportPreset: exportPresetProps,
    appSettings: appSettingsProps,
    externalFilterScript: externalFilterScriptProps,
    workflowPlanner: workflowPlannerProps,
    workflowScenarioBuilder: workflowScenarioBuilderProps
  }
}
