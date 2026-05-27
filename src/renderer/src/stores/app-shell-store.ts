import { create } from 'zustand'

import type { WorkspaceTab } from '../app/workspace-tab'

type AppShellState = {
  workspaceTab: WorkspaceTab
  railOpen: boolean
  setWorkspaceTab: (tab: WorkspaceTab) => void
  setRailOpen: (open: boolean) => void
}

export const useAppShellStore = create<AppShellState>((set) => ({
  workspaceTab: 'processing',
  railOpen: true,
  setWorkspaceTab: (workspaceTab) => set({ workspaceTab }),
  setRailOpen: (railOpen) => set({ railOpen })
}))
