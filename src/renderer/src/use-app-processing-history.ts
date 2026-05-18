import {
  useProcessingHistoryStore,
  type ProcessingHistoryStoreSlice
} from './stores/processing-history-store'

export type UseAppProcessingHistoryDeps = {
  setStatusHint: (hint: string | null) => void
}

export function useAppProcessingHistory(
  deps: UseAppProcessingHistoryDeps
): ProcessingHistoryStoreSlice {
  void deps
  return useProcessingHistoryStore()
}
