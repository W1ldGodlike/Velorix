/**
 * §6 — canonical `DownloadsQueueRow.status` strings (Russian) persisted in `queue.json`.
 * Single source of truth for main, pop-out downloads window, and renderer matching.
 */

export const YTDLP_QUEUE_STATUS_WAITING = 'Ожидание'
export const YTDLP_QUEUE_STATUS_RUNNING = 'Загрузка…'
export const YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX = 'Пауза перед повтором'
export const YTDLP_QUEUE_STATUS_DONE = 'Готово'
export const YTDLP_QUEUE_STATUS_CANCELLED = 'Отменено'

/** Failure rows start with this token (`Ошибка: …`, `Ошибка (код …)`, etc.). */
export const YTDLP_QUEUE_STATUS_ERROR_PREFIX = 'Ошибка'

export function isYtdlpQueueStatusWaiting(status: string): boolean {
  return status === YTDLP_QUEUE_STATUS_WAITING
}

export function isYtdlpQueueStatusRunningLike(status: string): boolean {
  return status === YTDLP_QUEUE_STATUS_RUNNING || status.startsWith(YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX)
}

export function isYtdlpQueueStatusDone(status: string): boolean {
  return status === YTDLP_QUEUE_STATUS_DONE
}

export function isYtdlpQueueStatusCancelled(status: string): boolean {
  return status === YTDLP_QUEUE_STATUS_CANCELLED
}

export function isYtdlpQueueStatusErrorLike(status: string): boolean {
  return status.startsWith(YTDLP_QUEUE_STATUS_ERROR_PREFIX)
}

const RETRY_PAUSE_NUMBERS_RE = new RegExp(
  `^${YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\((\\d+)/(\\d+)\\)`
)

export function parseYtdlpQueueRetryPauseCounts(status: string): { cur: string; max: string } | null {
  const m = RETRY_PAUSE_NUMBERS_RE.exec(status)
  if (!m?.[1] || !m[2]) {
    return null
  }
  return { cur: m[1], max: m[2] }
}
