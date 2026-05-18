import type {
  ProcessingHistoryEntry,
  ProcessingHistoryFilter,
  ProcessingHistoryWeeklySummary
} from '../../../shared/processing-history-contract'

export type ProcessingHistoryPanelProps = {
  open: boolean
  busy: boolean
  entries: ProcessingHistoryEntry[]
  filter: ProcessingHistoryFilter
  weeklySummary: ProcessingHistoryWeeklySummary | null
  onToggle: (nextOpen: boolean) => void
  onFilterChange: (next: ProcessingHistoryFilter) => void
  onRefresh: () => void
  onClear: () => void
  onExportVisible: () => void
  onOpenOutput: (id: string, mode: 'file' | 'folder' | 'preview') => void
  onOpenInputInHandler: (id: string) => void
  onAddInputToBatch?: (id: string) => void
  onOpenKnowledgeArticle?: (slug: string) => void
}
