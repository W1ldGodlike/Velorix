import type { UseAppWorkspaceEditorPropsInput } from './use-app-workspace-editor-props'
import { buildAppShellPropsInputWorkspaceEditor } from './use-app-shell-props-input-workspace-editor'
import { buildAppShellPropsInputWorkspaceEditorShared } from './use-app-shell-props-input-workspace-shell'
import type { AppShellPropsInputCtx } from './use-app-shell-props-input-workspace-types'

export type { AppShellPropsInputCtx } from './use-app-shell-props-input-workspace-types'

export function buildAppShellPropsInputWorkspace(
  ctx: AppShellPropsInputCtx
): UseAppWorkspaceEditorPropsInput {
  return {
    ...buildAppShellPropsInputWorkspaceEditorShared(ctx),
    ...buildAppShellPropsInputWorkspaceEditor(ctx)
  }
}
