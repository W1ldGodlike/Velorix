import type { AppShellLayoutChromeProps } from './use-app-shell-layout-props'
import { useRendererAppState } from './use-renderer-app-state'
import { useAppShellPropsInputHooks } from './use-app-shell-props-input-hooks'
import { buildAppShellPropsInputLayout } from './use-app-shell-props-input-layout'
import { useAppShellLayoutProps } from './use-app-shell-layout-props'

/** Layout chrome + dialogs (workspace — в `AppWorkspaceMain`). */
export function useAppShellLayoutController(): AppShellLayoutChromeProps {
  const state = useRendererAppState()
  const hooks = useAppShellPropsInputHooks(state)
  const layoutInput = buildAppShellPropsInputLayout({ ...state, ...hooks })
  return useAppShellLayoutProps(layoutInput)
}
