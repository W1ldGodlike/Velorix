import { useMemo } from 'react'

import { getUiLocale } from './locales/ui-text'
import { useAppShellStore } from './stores/app-shell-store'
import {
  selectVisibleDownloadsHistory,
  selectYtdlpCommandHintsFilteredByCategory,
  type DownloadsStoreState
} from './stores/downloads-store'

type DownloadsDerivedInput = Pick<
  DownloadsStoreState,
  | 'downloadsHistory'
  | 'downloadsHistoryOutcomeFilter'
  | 'downloadsOptions'
  | 'downloadsExpertHintFilter'
>

/** Производные списки загрузок (§6.3): только через useMemo — селекторы возвращают новые массивы. */
export function useDownloadsDerivedState(downloads: DownloadsDerivedInput): {
  visibleDownloadsHistory: ReturnType<typeof selectVisibleDownloadsHistory>
  ytdlpCommandHintsFilteredByCategory: ReturnType<typeof selectYtdlpCommandHintsFilteredByCategory>
} {
  const {
    downloadsHistory,
    downloadsHistoryOutcomeFilter,
    downloadsOptions,
    downloadsExpertHintFilter
  } = downloads

  useAppShellStore((s) => s.uiLocaleRenderTick)
  const uiLocale = getUiLocale()

  const visibleDownloadsHistory = useMemo(
    () =>
      selectVisibleDownloadsHistory({
        downloadsHistory,
        downloadsHistoryOutcomeFilter
      } as DownloadsStoreState),
    [downloadsHistory, downloadsHistoryOutcomeFilter]
  )

  const ytdlpCommandHintsFilteredByCategory = useMemo(
    () =>
      selectYtdlpCommandHintsFilteredByCategory(
        { downloadsOptions, downloadsExpertHintFilter },
        uiLocale
      ),
    [downloadsOptions, downloadsExpertHintFilter, uiLocale]
  )

  return { visibleDownloadsHistory, ytdlpCommandHintsFilteredByCategory }
}
