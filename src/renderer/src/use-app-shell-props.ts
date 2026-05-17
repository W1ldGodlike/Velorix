import type { AppShellLayoutProps } from './components/shell/AppShellLayout'
import { useAppShellLayoutProps, type UseAppShellLayoutPropsInput } from './use-app-shell-layout-props'
import { useAppWorkspaceMainProps, type UseAppWorkspaceMainPropsInput } from './use-app-workspace-main-props'

export type UseAppShellPropsInput = {
  workspace: UseAppWorkspaceMainPropsInput
  layout: UseAppShellLayoutPropsInput
}

export function useAppShellProps(input: UseAppShellPropsInput): AppShellLayoutProps {
  const workspaceMain = useAppWorkspaceMainProps(input.workspace)
  const layout = useAppShellLayoutProps(input.layout)
  return { workspaceMain, ...layout }
}
