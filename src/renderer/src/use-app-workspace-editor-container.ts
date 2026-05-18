import type { AppWorkspaceEditorProps } from './app-workspace-editor-props-types'
import { buildAppShellPropsInputWorkspace } from './use-app-shell-props-input-workspace'
import type { AppShellPropsInputCtx } from './use-app-shell-props-input-workspace-types'
import { useAppWorkspaceEditorProps } from './use-app-workspace-editor-props'

/** Сборка editor workspace внутри `AppWorkspaceMain` (без prop drilling через `AppShellLayout`). */
export function useAppWorkspaceEditorContainer(
  ctx: AppShellPropsInputCtx
): AppWorkspaceEditorProps {
  const workspaceInput = buildAppShellPropsInputWorkspace(ctx)
  return useAppWorkspaceEditorProps(workspaceInput)
}
