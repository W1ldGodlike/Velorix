import { create } from 'zustand'

import type { WorkspaceTab } from '../app/workspace-tab'
import type { SystemModalId } from '../app/system-modal'

type AppShellState = {
  workspaceTab: WorkspaceTab
  railOpen: boolean
  activeModal: SystemModalId | null
  setWorkspaceTab: (tab: WorkspaceTab) => void
  setRailOpen: (open: boolean) => void
  openModal: (id: SystemModalId) => void
  closeModal: () => void
}

export const useAppShellStore = create<AppShellState>((set) => ({
  workspaceTab: 'processing',
  railOpen: true,
  activeModal: null,
  setWorkspaceTab: (workspaceTab) => set({ workspaceTab }),
  setRailOpen: (railOpen) => set({ railOpen }),
  openModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null })
}))
