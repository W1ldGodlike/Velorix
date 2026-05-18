import { useEffect } from 'react'

import { subscribeUiTextShardsUpdated } from './ui-text-hot-reload'
import { useAppShellStore } from '../stores/app-shell-store'

/** Dev HMR: перерисовать дерево после правки JSON в `locales/` (без reload окна). */
export function useUiTextHotReloadBump(): void {
  const bumpUiLocaleRenderTick = useAppShellStore((s) => s.bumpUiLocaleRenderTick)
  useEffect(() => {
    return subscribeUiTextShardsUpdated(() => {
      bumpUiLocaleRenderTick()
    })
  }, [bumpUiLocaleRenderTick])
}
