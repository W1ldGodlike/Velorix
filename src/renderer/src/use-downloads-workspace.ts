import type { YtdlpDownloadHistoryEntry } from '../../shared/ytdlp-history-contract'
import { useDownloadsDerivedState } from './use-downloads-derived-state'
import {
  useDownloadsStore,
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
  const { visibleDownloadsHistory, ytdlpCommandHintsFilteredByCategory } =
    useDownloadsDerivedState(store)
  return {
    ...store,
    visibleDownloadsHistory,
    ytdlpCommandHintsFilteredByCategory
  }
}
