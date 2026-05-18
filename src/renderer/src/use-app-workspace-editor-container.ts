import type { AppWorkspaceEditorProps } from './app-workspace-editor-props-types'
import { useRendererAppState } from './use-renderer-app-state'
import { useAppShellPropsInputHooks } from './use-app-shell-props-input-hooks'
import { buildAppShellPropsInputWorkspace } from './use-app-shell-props-input-workspace'
import { useAppWorkspaceEditorProps } from './use-app-workspace-editor-props'

/** Сборка editor workspace внутри `AppWorkspaceMain` (без prop drilling через `AppShellLayout`). */
export function useAppWorkspaceEditorContainer(): AppWorkspaceEditorProps {
  const state = useRendererAppState()
  const hooks = useAppShellPropsInputHooks(state)
  const workspaceInput = buildAppShellPropsInputWorkspace({ ...state, ...hooks })
  return useAppWorkspaceEditorProps(workspaceInput)
}
