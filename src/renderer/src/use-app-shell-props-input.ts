import type { UseAppShellPropsInput } from './use-app-shell-props'
import type { AppCompositionState } from './use-app-composition-state'
import { useAppShellPropsInputHooks } from './use-app-shell-props-input-hooks'
import { buildAppShellPropsInputLayout } from './use-app-shell-props-input-layout'
import { buildAppShellPropsInputWorkspace } from './use-app-shell-props-input-workspace'

export function useAppShellPropsInput(state: AppCompositionState): UseAppShellPropsInput {
  const hooks = useAppShellPropsInputHooks(state)
  const ctx = { ...state, ...hooks }
  return {
    workspace: buildAppShellPropsInputWorkspace(ctx),
    layout: buildAppShellPropsInputLayout(ctx)
  }
}
