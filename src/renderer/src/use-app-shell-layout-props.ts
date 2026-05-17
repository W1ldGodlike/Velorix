import { useCallback, useMemo } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import type { EngineSummary } from './app-engines-ui'
import type { AppOverlayDialogsProps } from './components/shell/AppOverlayDialogs'
import type { AppStatusbarProps } from './components/shell/AppStatusbar'
import type { AppWorkspaceTopbarProps } from './components/shell/AppWorkspaceTopbar'
import type { EnginePathsDialogProps } from './components/shell/EnginePathsDialog'
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
    setEnginePathsOpen: Dispatch<SetStateAction<boolean>>
    handleOpenVideoFolderToolbar: () => Promise<void>
    handleOpenToolbar: () => Promise<void>
    handleCancelExport: () => Promise<void>
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
  enginePaths: {
    enginePathsSaving: boolean
    engineDownloadBusy: boolean
    enginePathsDraft: EnginePathsDraft
    setEnginePathsDraft: Dispatch<SetStateAction<EnginePathsDraft>>
    setEnginePathsOpen: Dispatch<SetStateAction<boolean>>
    handlePickEngine: (id: EngineId) => Promise<void>
    handleClearDownloadedEngines: () => Promise<void>
    handleSaveEnginePaths: () => Promise<void>
  }
}

export type AppShellLayoutChromeProps = {
  appChromeBusy: boolean
  topbar: AppWorkspaceTopbarProps
  statusbar: AppStatusbarProps
  overlay: AppOverlayDialogsProps
  exportPreset: ExportPresetNameDialogProps
  enginePaths: EnginePathsDialogProps
}

export function useAppShellLayoutProps(input: UseAppShellLayoutPropsInput): AppShellLayoutChromeProps {
  const { chromeBusy, topbar: topbarInput, statusbar, overlay, exportPreset, enginePaths } = input
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
    setEnginePathsOpen,
    handleOpenVideoFolderToolbar,
    handleOpenToolbar,
    handleCancelExport,
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
    setEnginePathsOpen(true)
  }, [setEnginePathsOpen])

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

  const {
    enginePathsSaving,
    engineDownloadBusy: enginePathsEngineDownloadBusy,
    enginePathsDraft,
    setEnginePathsDraft,
    setEnginePathsOpen: closeEnginePathsOpen,
    handlePickEngine,
    handleClearDownloadedEngines,
    handleSaveEnginePaths
  } = enginePaths

  const enginePathsProps = useMemo(
    (): EnginePathsDialogProps => ({
      enginePathsSaving,
      engineDownloadBusy: enginePathsEngineDownloadBusy,
      enginePathsDraft,
      setEnginePathsDraft,
      onClose: () => {
        closeEnginePathsOpen(false)
      },
      onPickEngine: (id) => {
        void handlePickEngine(id)
      },
      onClearDownloadedEngines: () => {
        void handleClearDownloadedEngines()
      },
      onSave: () => {
        void handleSaveEnginePaths()
      }
    }),
    [
      closeEnginePathsOpen,
      enginePathsDraft,
      enginePathsEngineDownloadBusy,
      enginePathsSaving,
      handleClearDownloadedEngines,
      handlePickEngine,
      handleSaveEnginePaths,
      setEnginePathsDraft
    ]
  )

  return {
    appChromeBusy,
    topbar: topbarProps,
    statusbar: statusbarProps,
    overlay,
    exportPreset: exportPresetProps,
    enginePaths: enginePathsProps
  }
}
