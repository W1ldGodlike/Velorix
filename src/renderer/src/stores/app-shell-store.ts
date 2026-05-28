import { create } from 'zustand'

import type { WorkspaceTab } from '../app/workspace-tab'
import type { SystemModalId } from '../app/system-modal'
import type { UtilityToolId } from '../features/tools/utility-tool-id'
import type { EngineId, EnginePathOverrides } from '../../../shared/engine-contract'
import type { MediaExportTrimPayload } from '../../../shared/ffmpeg-export-contract'
import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'
import type { ProcessErrorDialogPayload } from '../../../shared/process-error-dialog-contract'
import type { QuitConfirmRequestPayload } from '../../../shared/quit-confirm-contract'
import type { ShellMediaSource } from './shell-media-source'

export type SettingsSectionId = 'app' | 'processing' | 'cache'

type AppShellState = {
  workspaceTab: WorkspaceTab
  toolsView: UtilityToolId
  railOpen: boolean
  activeModal: SystemModalId | null
  commandPaletteOpen: boolean
  terminalCommandLine: string
  settingsSection: SettingsSectionId
  mediaSource: ShellMediaSource | null
  mediaProbe: MediaProbeSuccess | null
  exportTrim: MediaExportTrimPayload | null
  previewSeekSec: number | null
  pendingKnowledgeSlug: string | null
  quitConfirmRequest: QuitConfirmRequestPayload | null
  ffmpegErrorMessage: string | null
  processErrorDialog: ProcessErrorDialogPayload | null
  exportPresetDraftLabel: string
  exportPresetSaveNote: string | null
  plannerSelectedTaskId: string | null
  enginePathDraft: EnginePathOverrides
  setWorkspaceTab: (tab: WorkspaceTab) => void
  setToolsView: (view: UtilityToolId) => void
  setRailOpen: (open: boolean) => void
  setCommandPaletteOpen: (open: boolean) => void
  setTerminalCommandLine: (line: string) => void
  setSettingsSection: (section: SettingsSectionId) => void
  setMediaSource: (source: ShellMediaSource | null) => void
  setMediaProbe: (probe: MediaProbeSuccess | null) => void
  setExportTrim: (trim: MediaExportTrimPayload | null) => void
  requestPreviewSeek: (sec: number) => void
  ackPreviewSeek: () => void
  setPendingKnowledgeSlug: (slug: string | null) => void
  setQuitConfirmRequest: (payload: QuitConfirmRequestPayload | null) => void
  setFfmpegErrorMessage: (message: string | null) => void
  setProcessErrorDialog: (payload: ProcessErrorDialogPayload | null) => void
  setExportPresetDraftLabel: (label: string) => void
  setExportPresetSaveNote: (note: string | null) => void
  setPlannerSelectedTaskId: (taskId: string | null) => void
  setEnginePathDraftField: (engineId: EngineId, path: string) => void
  hydrateEnginePathDraft: () => Promise<void>
  persistEnginePathDraft: () => Promise<void>
  openModal: (id: SystemModalId) => void
  closeModal: () => void
}

export const useAppShellStore = create<AppShellState>((set) => ({
  workspaceTab: 'processing',
  toolsView: 'hub',
  railOpen: true,
  activeModal: null,
  commandPaletteOpen: false,
  terminalCommandLine: 'ffmpeg -version',
  settingsSection: 'app',
  mediaSource: null,
  mediaProbe: null,
  exportTrim: null,
  previewSeekSec: null,
  pendingKnowledgeSlug: null,
  quitConfirmRequest: null,
  ffmpegErrorMessage: null,
  processErrorDialog: null,
  exportPresetDraftLabel: 'Мой пресет',
  exportPresetSaveNote: null,
  plannerSelectedTaskId: null,
  enginePathDraft: {},
  setWorkspaceTab: (workspaceTab) =>
    set((state) => ({
      workspaceTab,
      toolsView: workspaceTab === 'tools' ? state.toolsView : 'hub'
    })),
  setToolsView: (toolsView) => set({ toolsView, workspaceTab: 'tools' }),
  setRailOpen: (railOpen) => set({ railOpen }),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setTerminalCommandLine: (terminalCommandLine) => set({ terminalCommandLine }),
  setSettingsSection: (settingsSection) => set({ settingsSection }),
  setMediaSource: (mediaSource) =>
    set((state) => ({
      mediaSource,
      exportTrim: mediaSource?.path === state.mediaSource?.path ? state.exportTrim : null
    })),
  setMediaProbe: (mediaProbe) => set({ mediaProbe }),
  setExportTrim: (exportTrim) => set({ exportTrim }),
  requestPreviewSeek: (sec) => set({ previewSeekSec: sec }),
  ackPreviewSeek: () => set({ previewSeekSec: null }),
  setPendingKnowledgeSlug: (pendingKnowledgeSlug) => set({ pendingKnowledgeSlug }),
  setQuitConfirmRequest: (quitConfirmRequest) => set({ quitConfirmRequest }),
  setFfmpegErrorMessage: (ffmpegErrorMessage) => set({ ffmpegErrorMessage }),
  setProcessErrorDialog: (processErrorDialog) => set({ processErrorDialog }),
  setExportPresetDraftLabel: (exportPresetDraftLabel) => set({ exportPresetDraftLabel }),
  setExportPresetSaveNote: (exportPresetSaveNote) => set({ exportPresetSaveNote }),
  setPlannerSelectedTaskId: (plannerSelectedTaskId) => set({ plannerSelectedTaskId }),
  setEnginePathDraftField: (engineId, path) =>
    set((state) => ({
      enginePathDraft: { ...state.enginePathDraft, [engineId]: path }
    })),
  hydrateEnginePathDraft: async () => {
    const get = window.velorix?.settings?.get
    if (get == null) {
      return
    }
    const view = await get()
    set({ enginePathDraft: view.engineExecutablePaths ?? {} })
  },
  persistEnginePathDraft: async () => {
    const setPaths = window.velorix?.settings?.setEngineExecutablePaths
    if (setPaths == null) {
      return
    }
    const draft = useAppShellStore.getState().enginePathDraft
    await setPaths(draft)
  },
  openModal: (activeModal) =>
    set({
      activeModal,
      ...(activeModal === 'export-preset-name' ? { exportPresetSaveNote: null } : {})
    }),
  closeModal: () => set({ activeModal: null, processErrorDialog: null })
}))
