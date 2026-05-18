import type { Dispatch, SetStateAction } from 'react'

import type {
  YtdlpDownloadHistoryEntry,
  YtdlpDownloadHistoryWeeklySummary
} from '../../../../shared/ytdlp-history-contract'
import type { DownloadsLogLineView } from './DownloadsLogPanel'
import type {
  DownloadsQueueRowView,
  DownloadsQueueStats,
  DownloadsStatusFilter
} from '../../downloads-queue-view'
import type { DownloadsHistoryListMode } from '../../../../shared/settings-contract'
import type { DownloadsHistoryOutcomeFilter } from '../../use-downloads-workspace'

export type DownloadsWorkspaceMainProps = {
  downloadsOptionsBusy: boolean
  downloadsHistoryBusy: boolean
  downloadsUrl: string
  setDownloadsUrl: Dispatch<SetStateAction<string>>
  downloadsMainUrlFieldId: string
  onAddToQueue: () => void
  downloadsNarrowLayout: boolean
  onScrollToSettings: () => void
  downloadsStats: DownloadsQueueStats
  downloadsStatusFilter: DownloadsStatusFilter
  setDownloadsStatusFilter: (next: DownloadsStatusFilter) => void
  downloadsStatusFilterChips: Array<{ id: DownloadsStatusFilter; label: string }>
  downloadsRows: DownloadsQueueRowView[]
  visibleDownloadsRows: DownloadsQueueRowView[]
  setStatusHint: (hint: string | null) => void
  onBatchAddDownloadsDone: (rowIds: number[]) => void
  onSelectDownloadsTab: () => void
  downloadsEmbeddedHistoryOpen: boolean
  persistDownloadsEmbeddedHistoryOpen: (nextOpen: boolean) => void
  downloadsHistoryListMode: DownloadsHistoryListMode
  persistDownloadsHistoryListMode: (nextMode: DownloadsHistoryListMode) => void
  visibleDownloadsHistory: YtdlpDownloadHistoryEntry[]
  downloadsHistoryCount: number
  downloadsHistoryOutcomeFilter: DownloadsHistoryOutcomeFilter
  setDownloadsHistoryOutcomeFilter: (next: DownloadsHistoryOutcomeFilter) => void
  downloadsHistoryWeeklySummary: YtdlpDownloadHistoryWeeklySummary
  refreshDownloadsHistory: () => Promise<void>
  setDownloadsHistory: Dispatch<SetStateAction<YtdlpDownloadHistoryEntry[]>>
  exportVisibleDownloadsHistory: () => Promise<void>
  downloadsEmbeddedLogOpen: boolean
  persistDownloadsEmbeddedLogOpen: (nextOpen: boolean) => void
  downloadsLogTargetRowId: number | null
  downloadsLogLines: DownloadsLogLineView[]
  setDownloadsLogLines: Dispatch<SetStateAction<DownloadsLogLineView[]>>
  setDownloadsLogTargetRowId: Dispatch<SetStateAction<number | null>>
}
