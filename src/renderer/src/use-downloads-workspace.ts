import type { YtdlpDownloadHistoryEntry } from '../../shared/ytdlp-history-contract'
import {
  useDownloadsStore,
  selectVisibleDownloadsHistory,
  selectYtdlpCommandHintsFilteredByCategory,
  type DownloadsStoreSlice
} from './stores/downloads-store'

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
  const visibleDownloadsHistory = useDownloadsStore(selectVisibleDownloadsHistory)
  const ytdlpCommandHintsFilteredByCategory = useDownloadsStore(
    selectYtdlpCommandHintsFilteredByCategory
  )
  return {
    ...store,
    visibleDownloadsHistory,
    ytdlpCommandHintsFilteredByCategory
  }
}
