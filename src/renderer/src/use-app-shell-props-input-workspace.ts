import type { UseAppWorkspaceMainPropsInput } from './use-app-workspace-main-props'
import { buildAppShellPropsInputWorkspaceEditor } from './use-app-shell-props-input-workspace-editor'
import { buildAppShellPropsInputWorkspaceShell } from './use-app-shell-props-input-workspace-shell'
import { buildAppShellPropsInputWorkspaceTerminalDownloads } from './use-app-shell-props-input-workspace-terminal-downloads'
import type { AppShellPropsInputCtx } from './use-app-shell-props-input-workspace-types'

export type { AppShellPropsInputCtx } from './use-app-shell-props-input-workspace-types'

export function buildAppShellPropsInputWorkspace(
  ctx: AppShellPropsInputCtx
): UseAppWorkspaceMainPropsInput {
  return {
    ...buildAppShellPropsInputWorkspaceShell(ctx),
    ...buildAppShellPropsInputWorkspaceEditor(ctx),
    ...buildAppShellPropsInputWorkspaceTerminalDownloads(ctx)
  }
}
