import { useProcessingHistoryStore } from './processing-history-store'

export function bindProcessingHistoryStoreIpc(): () => void {
  let mounted = true
  void Promise.all([
    window.fluxalloy.processingHistory.get({ limit: 100 }),
    window.fluxalloy.processingHistory.weeklySummary()
  ]).then(([rows, summary]) => {
    if (mounted) {
      useProcessingHistoryStore.setState({
        processingHistory: rows,
        processingHistoryWeeklySummary: summary
      })
    }
  })

  const off = window.fluxalloy.onProcessingHistoryChanged(() => {
    const filter = useProcessingHistoryStore.getState().processingHistoryFilter
    void useProcessingHistoryStore.getState().refreshProcessingHistory(filter, { silent: true })
  })

  return () => {
    mounted = false
    off()
  }
}
