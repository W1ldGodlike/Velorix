import { useCallback } from 'react'

import { formatEngineVersionsLine, summarizeEngines } from './app-engines-ui'
import { getUiLocale } from './locales/ui-text'
import type { AppUiLocale } from '../../shared/app-ui-locale'
import type { ResolvedAppTheme } from '../../shared/settings-contract'
import type { UseAppMainWindowEffectsDeps } from './use-app-main-window-effects-deps'

export function useAppMainWindowEngineActions(
  deps: Pick<
    UseAppMainWindowEffectsDeps,
    | 'setTheme'
    | 'setEngineSummary'
    | 'setEngineVersionsLine'
    | 'setEnginesOfferDownload'
    | 'refetchHwEncoders'
  >
): {
  applyTheme: (value: ResolvedAppTheme) => void
  refreshEngineUi: () => Promise<void>
} {
  const {
    setTheme,
    setEngineSummary,
    setEngineVersionsLine,
    setEnginesOfferDownload,
    refetchHwEncoders
  } = deps

  const applyTheme = useCallback(
    (value: ResolvedAppTheme) => {
      document.documentElement.dataset['theme'] = value
      setTheme(value)
    },
    [setTheme]
  )

  const refreshEngineUi = useCallback(async (): Promise<void> => {
    try {
      const loc = getUiLocale() as AppUiLocale
      const snapshot = await window.velorix.engines.getStatus(loc)
      setEngineSummary(summarizeEngines(snapshot.engines))
      setEngineVersionsLine(formatEngineVersionsLine(snapshot))
      const need = await window.velorix.engines.shouldOfferDownload()
      setEnginesOfferDownload(need)
      await refetchHwEncoders()
    } catch {
      setEngineSummary('error')
      setEngineVersionsLine('')
    }
  }, [refetchHwEncoders, setEngineSummary, setEngineVersionsLine, setEnginesOfferDownload])

  return { applyTheme, refreshEngineUi }
}
