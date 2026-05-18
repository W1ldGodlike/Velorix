import { useMemo } from 'react'

import type { YtdlpDownloadHistoryEntry } from '../../shared/ytdlp-history-contract'
import {
  useDownloadsStore,
  selectVisibleDownloadsHistory,
  selectYtdlpCommandHintsFilteredByCategory,
  type DownloadsStoreSlice,
  type DownloadsStoreState
} from './stores/downloads-store'
import { getUiLocale } from './locales/ui-text'
import { useAppShellStore } from './stores/app-shell-store'

export type { DownloadsHistoryOutcomeFilter } from './stores/downloads-store'

export type UseDownloadsWorkspaceDeps = {
  setStatusHint: (hint: string | null) => void
}

export type UseDownloadsWorkspaceResult = DownloadsStoreSlice & {
  visibleDownloadsHistory: YtdlpDownloadHistoryEntry[]
  ytdlpCommandHintsFilteredByCategory: ReturnType<typeof selectYtdlpCommandHintsFilteredByCategory>
}

export function useDownloadsWorkspace(
  deps: UseDownloadsWorkspaceDeps
): UseDownloadsWorkspaceResult {
  void deps
  const store = useDownloadsStore()
  const {
    downloadsHistory,
    downloadsHistoryOutcomeFilter,
    downloadsOptions,
    downloadsExpertHintFilter
  } = store
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
  return {
    ...store,
    visibleDownloadsHistory,
    ytdlpCommandHintsFilteredByCategory
  }
}
