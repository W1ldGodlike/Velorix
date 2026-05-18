import type { AppShellLayoutChromeProps } from './use-app-shell-layout-props'
import { buildAppShellPropsInputLayout } from './use-app-shell-props-input-layout'
import type { AppShellPropsInputCtx } from './use-app-shell-props-input-workspace-types'
import { useAppShellLayoutProps } from './use-app-shell-layout-props'

/** Layout chrome + dialogs (workspace — в `AppWorkspaceMain`). */
export function useAppShellLayoutController(ctx: AppShellPropsInputCtx): AppShellLayoutChromeProps {
  const layoutInput = buildAppShellPropsInputLayout(ctx)
  return useAppShellLayoutProps(layoutInput)
}
