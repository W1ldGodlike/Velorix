import { useBatchExportStore } from './batch-export-store'
import { useProcessingHistoryStore } from './processing-history-store'

export function bindBatchExportStoreIpc(): () => void {
  void window.velorix.batchExport
    .getSnapshot()
    .then((snap) => {
      useBatchExportStore.setState({ batchSnapshot: snap })
    })
    .catch(console.error)

  return window.velorix.batchExport.onSnapshot((snap) => {
    useBatchExportStore.setState((prev) => {
      if (prev.batchSnapshot?.running === true && snap.running === false) {
        void useProcessingHistoryStore.getState().refreshProcessingHistory(undefined, {
          silent: true
        })
      }
      return { batchSnapshot: snap }
    })
  })
}
