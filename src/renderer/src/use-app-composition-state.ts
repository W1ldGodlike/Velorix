import { useAppCompositionIntegrations } from './use-app-composition-integrations'
import { useAppCompositionLocalState } from './use-app-composition-local-state'

/** Return type: `AppCompositionState` (declared below). */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- inferred object matches AppCompositionState
export function useAppCompositionState() {
  const local = useAppCompositionLocalState()
  const integrations = useAppCompositionIntegrations({ setStatusHint: local.setStatusHint })
  return { ...local, ...integrations }
}

export type AppCompositionState = ReturnType<typeof useAppCompositionState>
