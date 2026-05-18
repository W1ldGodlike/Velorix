import type { JSX } from 'react'

import { AppShellLayout } from './AppShellLayout'
import type { AppWorkspaceMainProps } from './AppWorkspaceMain'
import { AppStoreBootstrap } from '../../use-app-store-bootstrap'
import { useAppShellLayoutController } from '../../use-app-shell-layout-controller'
import { useAppWorkspaceEditorContainer } from '../../use-app-workspace-editor-container'
import { useAppShellStore } from '../../stores/app-shell-store'
import { usePanelsStore } from '../../stores/panels-store'

export default function AppRoot(): JSX.Element {
  const layoutChrome = useAppShellLayoutController()
  const workspaceTab = useAppShellStore((s) => s.workspaceTab)
  const panelOpen = usePanelsStore((s) => s.panelOpen)
  const persistMainWindowUiPanelToggle = usePanelsStore((s) => s.persistMainWindowUiPanelToggle)
  const editor = useAppWorkspaceEditorContainer()
  const workspaceMain: AppWorkspaceMainProps = {
    workspaceTab,
    panelOpen,
    persistMainWindowUiPanelToggle,
    ...editor
  }

  return (
    <>
      <AppStoreBootstrap />
      <AppShellLayout {...layoutChrome} workspaceMain={workspaceMain} />
    </>
  )
}
