/**
 * §6.4 — повторы на уровне очереди (отдельно от `--retries` yt-dlp).
 *
 * После ненулевого exit code runner может сделать паузу и запустить ту же строку снова,
 * не добавляя URL заново. Профили фиксированы в коде, чтобы не превратить настройки в произвольный sleep.
 */

import type { YtdlpQueueRetryProfileId } from '../shared/ytdlp-download-contract'

export type { YtdlpQueueRetryProfileId } from '../shared/ytdlp-download-contract'

export interface YtdlpQueueRetryPlan {
  /** Сколько дополнительных запусков после первой неудачи (0 = только одна попытка). */
  extraAttempts: number
  /** Задержки перед каждым дополнительным запуском, мс; длина = extraAttempts. */
  delaysMs: number[]
}

export function parseYtdlpQueueRetryProfile(raw: unknown): YtdlpQueueRetryProfileId {
  if (raw === 'light' || raw === 'normal' || raw === 'persistent') {
    return raw
  }
  return 'off'
}

/** План пауз и числа повторов для выбранного профиля. */
export function resolveYtdlpQueueRetryPlan(profile: YtdlpQueueRetryProfileId): YtdlpQueueRetryPlan {
  if (profile === 'light') {
    return { extraAttempts: 1, delaysMs: [2500] }
  }
  if (profile === 'normal') {
    return { extraAttempts: 2, delaysMs: [3000, 8000] }
  }
  /** Долгие сетевые сбои / rate-limit: до четырёх запусков с растущей паузой §6.4. */
  if (profile === 'persistent') {
    return { extraAttempts: 3, delaysMs: [5000, 15000, 45000] }
  }
  return { extraAttempts: 0, delaysMs: [] }
}
