export type { UseAppMainWindowEffectsDeps } from './use-app-main-window-effects-deps'

import type { UseAppMainWindowEffectsDeps } from './use-app-main-window-effects-deps'
import { useAppMainWindowEffectsBootstrap } from './use-app-main-window-effects-bootstrap'
import { useAppMainWindowEffectsRuntime } from './use-app-main-window-effects-runtime'
import { useAppMainWindowEngineActions } from './use-app-main-window-engine-actions'

export function useAppMainWindowEffects(deps: UseAppMainWindowEffectsDeps): {
  refreshEngineUi: () => Promise<void>
} {
  const { applyTheme, refreshEngineUi } = useAppMainWindowEngineActions(deps)
  useAppMainWindowEffectsBootstrap(deps, { applyTheme })
  useAppMainWindowEffectsRuntime(deps, { refreshEngineUi })
  return { refreshEngineUi }
}
