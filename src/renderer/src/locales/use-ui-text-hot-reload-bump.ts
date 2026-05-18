import { useEffect, type Dispatch, type SetStateAction } from 'react'

import { subscribeUiTextShardsUpdated } from './ui-text-hot-reload'

/** Dev HMR: перерисовать дерево после правки JSON в `locales/` (без reload окна). */
export function useUiTextHotReloadBump(
  setUiLocaleRenderTick: Dispatch<SetStateAction<number>>
): void {
  useEffect(() => {
    return subscribeUiTextShardsUpdated(() => {
      setUiLocaleRenderTick((n) => n + 1)
    })
  }, [setUiLocaleRenderTick])
}
