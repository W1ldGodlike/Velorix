import { create } from 'zustand'

import type { WorkspaceTab } from '../app/workspace-tab'
import type { SystemModalId } from '../app/system-modal'
import type { UtilityToolId } from '../features/tools/utility-tool-id'
import type { EngineId, EnginePathOverrides } from '../../../shared/engine-contract'
import type { ShellMediaSource } from './shell-media-source'

type AppShellState = {
  workspaceTab: WorkspaceTab
  toolsView: UtilityToolId
  railOpen: boolean
  activeModal: SystemModalId | null
  commandPaletteOpen: boolean
  mediaSource: ShellMediaSource | null
  enginePathDraft: EnginePathOverrides
  setWorkspaceTab: (tab: WorkspaceTab) => void
  setToolsView: (view: UtilityToolId) => void
  setRailOpen: (open: boolean) => void
  setCommandPaletteOpen: (open: boolean) => void
  setMediaSource: (source: ShellMediaSource | null) => void
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
  mediaSource: null,
  enginePathDraft: {},
  setWorkspaceTab: (workspaceTab) =>
    set((state) => ({
      workspaceTab,
      toolsView: workspaceTab === 'tools' ? state.toolsView : 'hub'
    })),
  setToolsView: (toolsView) => set({ toolsView, workspaceTab: 'tools' }),
  setRailOpen: (railOpen) => set({ railOpen }),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setMediaSource: (mediaSource) => set({ mediaSource }),
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
  openModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null })
}))
