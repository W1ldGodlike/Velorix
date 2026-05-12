/** Запись истории завершённых загрузок yt-dlp §6.4 (формат `history.json`). */

export type YtdlpDownloadHistoryOutcome = 'success' | 'error' | 'cancelled'

export interface YtdlpDownloadHistoryEntry {
  id: string
  startedAt: number
  finishedAt: number
  url: string
  shortLabel: string
  outcome: YtdlpDownloadHistoryOutcome
  /** Финальный статус строки очереди (как в таблице §6.1). */
  status: string
  /** Последний известный код выхода yt-dlp; при ошибке spawn — null. */
  exitCode: number | null
  /** Последняя распознанная строка ERROR: из stdout/stderr, если была. */
  errorHint: string | null
  /** Best-effort путь готового файла, если yt-dlp сообщил его в stdout/stderr. */
  outputPath?: string | null
}

export interface YtdlpDownloadHistoryWeeklySummary {
  since: number
  until: number
  total: number
  success: number
  error: number
  cancelled: number
}
