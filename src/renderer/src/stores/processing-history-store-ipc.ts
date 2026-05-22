import { useProcessingHistoryStore } from './processing-history-store'

export function bindProcessingHistoryStoreIpc(): () => void {
  let mounted = true
  void Promise.all([
    window.velorix.processingHistory.get({ limit: 100 }),
    window.velorix.processingHistory.weeklySummary()
  ]).then(([rows, summary]) => {
    if (mounted) {
      useProcessingHistoryStore.setState({
        processingHistory: rows,
        processingHistoryWeeklySummary: summary
      })
    }
  })

  const off = window.velorix.onProcessingHistoryChanged(() => {
    const filter = useProcessingHistoryStore.getState().processingHistoryFilter
    void useProcessingHistoryStore.getState().refreshProcessingHistory(filter, { silent: true })
  })

  return () => {
    mounted = false
    off()
  }
}
