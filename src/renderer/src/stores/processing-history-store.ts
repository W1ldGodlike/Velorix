import type { SetStateAction } from 'react'

import { createRendererStore } from './create-renderer-store'

import { getUiLocale, uiText } from '../locales/ui-text'
import type {
  ProcessingHistoryEntry,
  ProcessingHistoryFilter,
  ProcessingHistoryWeeklySummary
} from '../../../shared/processing-history-contract'
import { useAppShellStore } from './app-shell-store'
import { applySetStateAction } from './store-set-action'

type ProcessingHistoryStoreState = {
  processingHistory: ProcessingHistoryEntry[]
  processingHistoryBusy: boolean
  processingHistoryFilter: ProcessingHistoryFilter
  processingHistoryWeeklySummary: ProcessingHistoryWeeklySummary | null
}

type ProcessingHistoryStoreActions = {
  setProcessingHistory: (
    next: ProcessingHistoryEntry[] | ((prev: ProcessingHistoryEntry[]) => ProcessingHistoryEntry[])
  ) => void
  setProcessingHistoryWeeklySummary: (
    next: SetStateAction<ProcessingHistoryWeeklySummary | null>
  ) => void
  refreshProcessingHistory: (
    filter?: ProcessingHistoryFilter,
    opts?: { silent?: boolean }
  ) => Promise<void>
  applyProcessingHistoryFilter: (next: ProcessingHistoryFilter) => void
  exportVisibleProcessingHistory: () => Promise<void>
  reset: () => void
}

export type ProcessingHistoryStoreSlice = ProcessingHistoryStoreState &
  ProcessingHistoryStoreActions

const initialProcessingHistoryState: ProcessingHistoryStoreState = {
  processingHistory: [],
  processingHistoryBusy: false,
  processingHistoryFilter: {},
  processingHistoryWeeklySummary: null
}

export const useProcessingHistoryStore = createRendererStore<
  ProcessingHistoryStoreState & ProcessingHistoryStoreActions
>('ProcessingHistory', (set, get) => ({
  ...initialProcessingHistoryState,
  setProcessingHistory: (next) => {
    set((s) => ({ processingHistory: applySetStateAction(next, s.processingHistory) }))
  },
  setProcessingHistoryWeeklySummary: (next) => {
    set((s) => ({
      processingHistoryWeeklySummary: applySetStateAction(next, s.processingHistoryWeeklySummary)
    }))
  },
  refreshProcessingHistory: async (filter, opts) => {
    const activeFilter = filter ?? get().processingHistoryFilter
    if (!opts?.silent) {
      set({ processingHistoryBusy: true })
    }
    try {
      const [rows, summary] = await Promise.all([
        window.fluxalloy.processingHistory.get({ ...activeFilter, limit: 100 }),
        window.fluxalloy.processingHistory.weeklySummary()
      ])
      set({
        processingHistory: rows,
        processingHistoryWeeklySummary: summary,
        processingHistoryFilter: activeFilter
      })
    } finally {
      if (!opts?.silent) {
        set({ processingHistoryBusy: false })
      }
    }
  },
  applyProcessingHistoryFilter: (next) => {
    set({ processingHistoryFilter: next })
    void get().refreshProcessingHistory(next)
  },
  exportVisibleProcessingHistory: async () => {
    const { processingHistory, processingHistoryFilter, processingHistoryWeeklySummary } = get()
    const payload = {
      schema: 2,
      exportedAt: Date.now(),
      uiLocale: getUiLocale(),
      entryCount: processingHistory.length,
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
      useAppShellStore.getState().setStatusHint(uiText('processingHistoryExportSaved'))
    } else if ('error' in res) {
      useAppShellStore.getState().setStatusHint(res.error)
    }
  },
  reset: () => {
    set(initialProcessingHistoryState)
  }
}))
