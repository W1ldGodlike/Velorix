/** События потокового лога yt-dlp §6.4 (IPC в окно загрузок). */

/** Returned when the user dismisses the save dialog; not meant as a user-visible error string. */
export const DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED = 'fluxalloy:visible_log_save_cancelled'

export type DownloadsLogPayload =
  | { kind: 'reset'; rowId: number }
  | { kind: 'line'; rowId: number; stream: 'stdout' | 'stderr'; text: string }
