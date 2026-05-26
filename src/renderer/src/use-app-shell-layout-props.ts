import { useCallback, useMemo } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import { downloadsRowMatchesStatus } from './downloads-queue-view'
import { useAppChromeBusy } from './hooks/use-app-chrome-busy'
import {
  useAppStatusbarActivity,
  useAppStatusbarUiLocale
} from './hooks/use-app-statusbar-activity'
import { useBatchExportStore, selectBatchExportBusy } from './stores/batch-export-store'
import { useAppShellStore } from './stores/app-shell-store'
import { useExportSettingsStore } from './stores/export-settings-store'

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
  topbar: {
    setKnowledgeInitialSlug: Dispatch<SetStateAction<string | null>>
    setKnowledgeOpen: Dispatch<SetStateAction<boolean>>
    setAboutInfo: Dispatch<
      SetStateAction<Awaited<ReturnType<typeof window.velorix.about.getInfo>> | null>
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
  statusbar: Pick<
    AppStatusbarProps,
    'exportCodecStatusbarLabel' | 'exportCodecStatusbarTitle' | 'exportCodecStatusbarAria'
  >
  overlay: Omit<AppOverlayDialogsProps, 'workspaceTab'>
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
      SetStateAction<Awaited<ReturnType<typeof window.velorix.about.getInfo>> | null>
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
  mediaFileUtilities: {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    onStatus: (message: string) => void
  }
}

export type AppShellLayoutChromeProps = {
  appChromeBusy: boolean
  topbar: AppWorkspaceTopbarProps
  statusbar: AppStatusbarProps
  overlay: Omit<AppOverlayDialogsProps, 'workspaceTab'>
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
  mediaFileUtilities: {
    open: boolean
    onClose: () => void
    onStatus: (message: string) => void
  }
}

export function useAppShellLayoutProps(
  input: UseAppShellLayoutPropsInput
): AppShellLayoutChromeProps {
  const {
    topbar: topbarInput,
    statusbar,
    overlay,
    exportPreset,
    appSettings,
    externalFilterScript,
    workflowPlanner,
    workflowScenarioBuilder,
    mediaFileUtilities
  } = input
  const {
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
  const appChromeBusy = useAppChromeBusy()
  const workspaceTab = useAppShellStore((s) => s.workspaceTab)
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const engineDownloadBusy = useAppShellStore((s) => s.engineDownloadBusy)
  const engineSummary = useAppShellStore((s) => s.engineSummary)
  const enginesOfferDownload = useAppShellStore((s) => s.enginesOfferDownload)
  const theme = useAppShellStore((s) => s.theme)
  const previewPath = useAppShellStore((s) => s.preview?.path)
  const exportBusy = useAppShellStore((s) => s.exportBusy)
  const exportCancelBusy = useAppShellStore((s) => s.exportCancelBusy)
  const probePending = useAppShellStore((s) => s.probePending)
  const statusHint = useAppShellStore((s) => s.statusHint)
  const engineVersionsLine = useAppShellStore((s) => s.engineVersionsLine)
  const downloadsRows = useAppShellStore((s) => s.downloadsRows)
  const snapshotBusy = useExportSettingsStore((s) => s.snapshotBusy)
  const batchExportBusy = useBatchExportStore((s) => selectBatchExportBusy(s))
  const downloadsRunning = useMemo(
    () => downloadsRows.filter((row) => downloadsRowMatchesStatus(row, 'running')).length,
    [downloadsRows]
  )
  const statusbarActivity = useAppStatusbarActivity(downloadsRunning)
  const uiLocale = useAppStatusbarUiLocale()

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

  const onOpenAppSettings = useCallback((): void => {
    setAppSettingsSection('general')
    setAppSettingsOpen(false)
    setWorkspaceTab('settings')
  }, [setAppSettingsOpen, setAppSettingsSection, setWorkspaceTab])

  const onOpenKnowledge = useCallback((): void => {
    setKnowledgeInitialSlug(null)
    setKnowledgeOpen(false)
    setWorkspaceTab('knowledge')
  }, [setKnowledgeInitialSlug, setKnowledgeOpen, setWorkspaceTab])

  const onOpenAbout = useCallback((): void => {
    void window.velorix.about.getInfo().then((info) => {
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
      engineDownloadBusy,
      engineSummary,
      previewPath,
      exportBusy,
      exportCancelBusy,
      enginesOfferDownload,
      theme,
      onOpenVideoFolder,
      onOpenFile,
      onCancelExport,
      onExtractFrames: handleExtractFrames,
      onEnginesDownload,
      onOpenAppSettings,
      onOpenKnowledge,
      onOpenAbout,
      onUiLocaleToggle: handleUiLocaleToggle,
      onToggleTheme
    }),
    [
      appChromeBusy,
      engineDownloadBusy,
      engineSummary,
      enginesOfferDownload,
      exportBusy,
      exportCancelBusy,
      handleExtractFrames,
      handleUiLocaleToggle,
      onCancelExport,
      onEnginesDownload,
      onOpenAbout,
      onOpenAppSettings,
      onOpenFile,
      onOpenKnowledge,
      onOpenVideoFolder,
      onToggleTheme,
      previewPath,
      setWorkspaceTab,
      theme,
      workspaceTab
    ]
  )

  const statusbarProps = useMemo(
    (): AppStatusbarProps => ({
      appChromeBusy,
      workspaceTab,
      engineDownloadBusy,
      engineSummary,
      engineVersionsLine,
      exportCodecStatusbarLabel: statusbar.exportCodecStatusbarLabel,
      exportCodecStatusbarTitle: statusbar.exportCodecStatusbarTitle,
      exportCodecStatusbarAria: statusbar.exportCodecStatusbarAria,
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
    }),
    [
      appChromeBusy,
      batchExportBusy,
      engineDownloadBusy,
      engineSummary,
      engineVersionsLine,
      exportBusy,
      exportCancelBusy,
      probePending,
      snapshotBusy,
      statusHint,
      statusbar,
      statusbarActivity.active,
      statusbarActivity.label,
      statusbarActivity.title,
      uiLocale,
      workspaceTab
    ]
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
        void window.velorix.about.getInfo().then((info) => {
          appSettings.setAboutInfo(info)
          appSettings.setAboutOpen(true)
        })
      },
      onOpenWorkflowPlanner: () => {
        workflowPlanner.setOpen(true)
      },
      onOpenWorkflowScenarioBuilder: () => {
        workflowScenarioBuilder.setOpen(true)
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
  }, [appSettings, workflowPlanner, workflowScenarioBuilder])

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
      onStatus: workflowScenarioBuilder.onStatus,
      onOpenKnowledgeArticle: (slug: string) => {
        setKnowledgeInitialSlug(slug)
        setKnowledgeOpen(true)
      }
    }),
    [workflowScenarioBuilder, setKnowledgeInitialSlug, setKnowledgeOpen]
  )

  const mediaFileUtilitiesProps = useMemo(
    () => ({
      open: mediaFileUtilities.open,
      onClose: () => {
        mediaFileUtilities.setOpen(false)
      },
      onStatus: mediaFileUtilities.onStatus
    }),
    [mediaFileUtilities]
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
    workflowScenarioBuilder: workflowScenarioBuilderProps,
    mediaFileUtilities: mediaFileUtilitiesProps
  }
}
