import type { SetStateAction } from 'react'

import { createRendererStore } from './create-renderer-store'

import type { DownloadsLogLineView } from '../components/downloads/DownloadsLogPanel'
import { getUiLocale, uiText } from '../locales/ui-text'
import type { DownloadsLogPayload } from '../../../shared/downloads-log-contract'
import type { AppUiLocale } from '../../../shared/app-ui-locale'
import { groupYtdlpCommandHintsByCategory } from '../../../shared/ytdlp-command-hints-group'
import type {
  YtdlpDownloadOptionsPatch,
  YtdlpDownloadOptionsPayload
} from '../../../shared/ytdlp-download-contract'
import type {
  YtdlpDownloadHistoryEntry,
  YtdlpDownloadHistoryWeeklySummary
} from '../../../shared/ytdlp-history-contract'
import { useAppShellStore } from './app-shell-store'
import { applySetStateAction } from './store-set-action'

export type DownloadsHistoryOutcomeFilter = 'all' | YtdlpDownloadHistoryEntry['outcome']

export type DownloadsStoreState = {
  downloadsOptions: YtdlpDownloadOptionsPayload | null
  downloadsOptionsBusy: boolean
  downloadsExpertHintFilter: string
  downloadsHistory: YtdlpDownloadHistoryEntry[]
  downloadsHistoryBusy: boolean
  downloadsHistoryOutcomeFilter: DownloadsHistoryOutcomeFilter
  downloadsHistoryWeeklySummary: YtdlpDownloadHistoryWeeklySummary | null
  downloadsLogLines: DownloadsLogLineView[]
  downloadsLogTargetRowId: number | null
  downloadsOutputDirectory: { path: string; isDefault: boolean } | null
  downloadsLogNextId: number
}

type DownloadsStoreActions = {
  setDownloadsOptions: (
    next:
      | DownloadsStoreState['downloadsOptions']
      | ((prev: DownloadsStoreState['downloadsOptions']) => DownloadsStoreState['downloadsOptions'])
  ) => void
  setDownloadsExpertHintFilter: (next: string) => void
  setDownloadsHistory: (
    next:
      | YtdlpDownloadHistoryEntry[]
      | ((prev: YtdlpDownloadHistoryEntry[]) => YtdlpDownloadHistoryEntry[])
  ) => void
  setDownloadsHistoryOutcomeFilter: (next: DownloadsHistoryOutcomeFilter) => void
  setDownloadsLogLines: (
    next: DownloadsLogLineView[] | ((prev: DownloadsLogLineView[]) => DownloadsLogLineView[])
  ) => void
  setDownloadsLogTargetRowId: (next: SetStateAction<number | null>) => void
  setDownloadsOutputDirectory: (
    next: SetStateAction<DownloadsStoreState['downloadsOutputDirectory']>
  ) => void
  refreshDownloadsOptions: () => Promise<void>
  applyDownloadsOptionsPatch: (patch: YtdlpDownloadOptionsPatch) => Promise<void>
  appendDownloadsExtraArgsToken: (token: string) => void
  refreshDownloadsHistory: (opts?: { silent?: boolean }) => Promise<void>
  exportVisibleDownloadsHistory: () => Promise<void>
  handleDownloadsLogPayload: (payload: DownloadsLogPayload) => void
  refreshDownloadsOutputDirectory: () => Promise<void>
  reset: () => void
}

export type DownloadsStoreSlice = DownloadsStoreState & DownloadsStoreActions

const initialDownloadsState: DownloadsStoreState = {
  downloadsOptions: null,
  downloadsOptionsBusy: false,
  downloadsExpertHintFilter: '',
  downloadsHistory: [],
  downloadsHistoryBusy: false,
  downloadsHistoryOutcomeFilter: 'all',
  downloadsHistoryWeeklySummary: null,
  downloadsLogLines: [],
  downloadsLogTargetRowId: null,
  downloadsOutputDirectory: null,
  downloadsLogNextId: 1
}

export const useDownloadsStore = createRendererStore<DownloadsStoreState & DownloadsStoreActions>(
  'Downloads',
  (set, get) => ({
    ...initialDownloadsState,
    setDownloadsOptions: (next) => {
      set((s) => ({ downloadsOptions: applySetStateAction(next, s.downloadsOptions) }))
    },
    setDownloadsExpertHintFilter: (next) => {
      set({ downloadsExpertHintFilter: next })
    },
    setDownloadsHistory: (next) => {
      set((s) => ({ downloadsHistory: applySetStateAction(next, s.downloadsHistory) }))
    },
    setDownloadsHistoryOutcomeFilter: (next) => {
      set({ downloadsHistoryOutcomeFilter: next })
    },
    setDownloadsLogLines: (next) => {
      set((s) => ({ downloadsLogLines: applySetStateAction(next, s.downloadsLogLines) }))
    },
    setDownloadsLogTargetRowId: (next) => {
      set((s) => ({
        downloadsLogTargetRowId: applySetStateAction(next, s.downloadsLogTargetRowId)
      }))
    },
    setDownloadsOutputDirectory: (next) => {
      set((s) => ({
        downloadsOutputDirectory: applySetStateAction(next, s.downloadsOutputDirectory)
      }))
    },
    refreshDownloadsOptions: async () => {
      const res = await window.fluxalloy.downloads.getCliOptions({
        uiLocale: getUiLocale() as AppUiLocale
      })
      if (res.ok) {
        set({ downloadsOptions: res.payload })
        return
      }
      useAppShellStore.getState().setStatusHint(res.error)
    },
    applyDownloadsOptionsPatch: async (patch) => {
      set({ downloadsOptionsBusy: true })
      try {
        const res = await window.fluxalloy.downloads.setCliOptions(patch)
        if (!res.ok) {
          useAppShellStore.getState().setStatusHint(res.error)
          return
        }
        await get().refreshDownloadsOptions()
      } finally {
        set({ downloadsOptionsBusy: false })
      }
    },
    appendDownloadsExtraArgsToken: (token) => {
      const downloadsOptions = get().downloadsOptions
      if (!downloadsOptions) {
        return
      }
      const cur = downloadsOptions.extraArgsLine.trim()
      const next = cur ? `${cur} ${token}` : token
      set({ downloadsOptions: { ...downloadsOptions, extraArgsLine: next } })
      void get().applyDownloadsOptionsPatch({ extraArgsLine: next })
    },
    refreshDownloadsHistory: async (opts) => {
      if (!opts?.silent) {
        set({ downloadsHistoryBusy: true })
      }
      try {
        const [rows, summary] = await Promise.all([
          window.fluxalloy.downloads.getHistory(),
          window.fluxalloy.downloads.getHistoryWeeklySummary()
        ])
        set({ downloadsHistory: rows, downloadsHistoryWeeklySummary: summary })
      } finally {
        if (!opts?.silent) {
          set({ downloadsHistoryBusy: false })
        }
      }
    },
    exportVisibleDownloadsHistory: async () => {
      const { downloadsHistory, downloadsHistoryOutcomeFilter, downloadsHistoryWeeklySummary } =
        get()
      const visible =
        downloadsHistoryOutcomeFilter === 'all'
          ? downloadsHistory
          : downloadsHistory.filter((e) => e.outcome === downloadsHistoryOutcomeFilter)
      const payload = {
        schema: 2,
        exportedAt: Date.now(),
        uiLocale: getUiLocale(),
        entryCount: visible.length,
        outcomeFilter: downloadsHistoryOutcomeFilter,
        weeklySummary: downloadsHistoryWeeklySummary,
        entries: visible
      }
      const res = await window.fluxalloy.saveTextWithDialog({
        title: uiText('downloadsHistoryExportDialogTitle'),
        defaultFileName: 'fluxalloy-downloads-history.json',
        content: JSON.stringify(payload, null, 2)
      })
      if (res.ok) {
        useAppShellStore.getState().setStatusHint(uiText('downloadsHistoryExportSaved'))
      } else if ('error' in res) {
        useAppShellStore.getState().setStatusHint(res.error)
      }
    },
    handleDownloadsLogPayload: (payload) => {
      if (payload.kind === 'reset') {
        set({ downloadsLogTargetRowId: payload.rowId, downloadsLogLines: [] })
        return
      }
      set((s) => {
        const nextId = s.downloadsLogNextId
        const next = [
          ...s.downloadsLogLines,
          { id: nextId, rowId: payload.rowId, stream: payload.stream, text: payload.text }
        ]
        return {
          downloadsLogTargetRowId: payload.rowId,
          downloadsLogNextId: nextId + 1,
          downloadsLogLines: next.length > 420 ? next.slice(next.length - 420) : next
        }
      })
    },
    refreshDownloadsOutputDirectory: async () => {
      const dir = await window.fluxalloy.downloads.getOutputDirectory()
      set({ downloadsOutputDirectory: dir })
    },
    reset: () => {
      set(initialDownloadsState)
    }
  })
)

export function selectVisibleDownloadsHistory(
  state: DownloadsStoreState
): YtdlpDownloadHistoryEntry[] {
  return state.downloadsHistoryOutcomeFilter === 'all'
    ? state.downloadsHistory
    : state.downloadsHistory.filter((e) => e.outcome === state.downloadsHistoryOutcomeFilter)
}

export function selectYtdlpCommandHintsFilteredByCategory(
  state: DownloadsStoreState
): ReturnType<typeof groupYtdlpCommandHintsByCategory> {
  return groupYtdlpCommandHintsByCategory(
    state.downloadsOptions?.commandHints,
    state.downloadsExpertHintFilter,
    getUiLocale() as AppUiLocale
  )
}
