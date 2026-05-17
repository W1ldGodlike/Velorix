import type { AppShellLayoutProps } from './components/shell/AppShellLayout'
import { useAppShellProps } from './use-app-shell-props'
import { useAppCompositionState } from './use-app-composition-state'
import { useAppShellPropsInput } from './use-app-shell-props-input'

export function useAppComposition(): AppShellLayoutProps {
  const state = useAppCompositionState()
  const input = useAppShellPropsInput(state)
  return useAppShellProps(input)
}
