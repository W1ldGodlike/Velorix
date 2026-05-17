import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react'

import { uiText } from './locales/ui-text'
import type {
  ProcessingHistoryEntry,
  ProcessingHistoryFilter,
  ProcessingHistoryWeeklySummary
} from '../../shared/processing-history-contract'

export type UseAppProcessingHistoryDeps = {
  setStatusHint: (hint: string | null) => void
}

export function useAppProcessingHistory(deps: UseAppProcessingHistoryDeps): {
  processingHistory: ProcessingHistoryEntry[]
  setProcessingHistory: Dispatch<SetStateAction<ProcessingHistoryEntry[]>>
  processingHistoryBusy: boolean
  processingHistoryFilter: ProcessingHistoryFilter
  processingHistoryWeeklySummary: ProcessingHistoryWeeklySummary | null
  setProcessingHistoryWeeklySummary: Dispatch<SetStateAction<ProcessingHistoryWeeklySummary | null>>
  refreshProcessingHistory: (filter?: ProcessingHistoryFilter) => Promise<void>
  applyProcessingHistoryFilter: (next: ProcessingHistoryFilter) => void
  exportVisibleProcessingHistory: () => Promise<void>
} {
  const { setStatusHint } = deps
  const [processingHistory, setProcessingHistory] = useState<ProcessingHistoryEntry[]>([])
  const [processingHistoryBusy, setProcessingHistoryBusy] = useState(false)
  const [processingHistoryFilter, setProcessingHistoryFilter] = useState<ProcessingHistoryFilter>(
    {}
  )
  const [processingHistoryWeeklySummary, setProcessingHistoryWeeklySummary] =
    useState<ProcessingHistoryWeeklySummary | null>(null)

  const refreshProcessingHistory = useCallback(
    async (filter: ProcessingHistoryFilter = processingHistoryFilter): Promise<void> => {
      setProcessingHistoryBusy(true)
      try {
        const [rows, summary] = await Promise.all([
          window.fluxalloy.processingHistory.get({ ...filter, limit: 100 }),
          window.fluxalloy.processingHistory.weeklySummary()
        ])
        setProcessingHistory(rows)
        setProcessingHistoryWeeklySummary(summary)
      } finally {
        setProcessingHistoryBusy(false)
      }
    },
    [processingHistoryFilter]
  )

  const applyProcessingHistoryFilter = useCallback(
    (next: ProcessingHistoryFilter): void => {
      setProcessingHistoryFilter(next)
      void refreshProcessingHistory(next)
    },
    [refreshProcessingHistory]
  )

  const exportVisibleProcessingHistory = useCallback(async (): Promise<void> => {
    const payload = {
      schema: 1,
      exportedAt: Date.now(),
      filter: processingHistoryFilter,
      weeklySummary: processingHistoryWeeklySummary,
      entries: processingHistory
    }
    const res = await window.fluxalloy.saveTextWithDialog({
      title: uiText('processingHistoryExportDialogTitle'),
      defaultFileName: 'fluxalloy-processing-history.json',
      content: JSON.stringify(payload, null, 2)
    })
    if (res.ok) {
      setStatusHint(uiText('processingHistoryExportSaved'))
    } else if ('error' in res) {
      setStatusHint(res.error)
    }
  }, [processingHistory, processingHistoryFilter, processingHistoryWeeklySummary, setStatusHint])

  useEffect(() => {
    let mounted = true
    void Promise.all([
      window.fluxalloy.processingHistory.get({ limit: 100 }),
      window.fluxalloy.processingHistory.weeklySummary()
    ]).then(([rows, summary]) => {
      if (mounted) {
        setProcessingHistory(rows)
        setProcessingHistoryWeeklySummary(summary)
      }
    })
    return (): void => {
      mounted = false
    }
  }, [])

  return {
    processingHistory,
    setProcessingHistory,
    processingHistoryBusy,
    processingHistoryFilter,
    processingHistoryWeeklySummary,
    setProcessingHistoryWeeklySummary,
    refreshProcessingHistory,
    applyProcessingHistoryFilter,
    exportVisibleProcessingHistory
  }
}
