import type { JSX } from 'react'

import { AppShellLayout } from './AppShellLayout'
import type { AppWorkspaceMainProps } from './AppWorkspaceMain'
import { AppStoreBootstrap } from '../../use-app-store-bootstrap'
import { useAppShellLayoutController } from '../../use-app-shell-layout-controller'
import { useAppShellPropsInputHooks } from '../../use-app-shell-props-input-hooks'
import { useAppWorkspaceEditorContainer } from '../../use-app-workspace-editor-container'
import { useRendererAppState } from '../../use-renderer-app-state'
import { useAppShellStore } from '../../stores/app-shell-store'
import { usePanelsStore } from '../../stores/panels-store'

export default function AppRoot(): JSX.Element {
  const state = useRendererAppState()
  const hooks = useAppShellPropsInputHooks(state)
  const shellInput = { ...state, ...hooks }
  const layoutChrome = useAppShellLayoutController(shellInput)
  const workspaceTab = useAppShellStore((s) => s.workspaceTab)
  const panelOpen = usePanelsStore((s) => s.panelOpen)
  const persistMainWindowUiPanelToggle = usePanelsStore((s) => s.persistMainWindowUiPanelToggle)
  const editor = useAppWorkspaceEditorContainer(shellInput)
  const workspaceMain: AppWorkspaceMainProps = {
    workspaceTab,
    panelOpen,
    persistMainWindowUiPanelToggle,
    appSettingsRoute: layoutChrome.appSettings,
    ...editor
  }

  return (
    <>
      <AppStoreBootstrap />
      <AppShellLayout {...layoutChrome} workspaceMain={workspaceMain} />
    </>
  )
}
