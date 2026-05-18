export type ProcessingHistoryKind =
  | 'ffmpegExport'
  | 'ffmpegBatchExport'
  | 'ffmpegSnapshot'
  | 'autoExport'
  | 'workflowScenario'
export type ProcessingHistoryOutcome = 'success' | 'error' | 'cancelled'

export interface ProcessingHistoryEntry {
  id: string
  kind: ProcessingHistoryKind
  startedAt: number
  finishedAt: number
  inputPath: string
  outputPath: string | null
  outcome: ProcessingHistoryOutcome
  status: string
  errorHint: string | null
  /** Фактический `-c:v` после резолва auto (экспорт ffmpeg / авто-экспорт). */
  exportVideoCodecUsed?: string
}

export interface ProcessingHistoryFilter {
  kind?: ProcessingHistoryKind
  outcome?: ProcessingHistoryOutcome
  query?: string
}

export interface ProcessingHistoryWeeklySummary {
  since: number
  until: number
  total: number
  success: number
  error: number
  cancelled: number
  ffmpegExport: number
  ffmpegBatchExport: number
  ffmpegSnapshot: number
  autoExport: number
  workflowScenario: number
  totalDurationMs: number
}
