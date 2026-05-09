/** События лога yt-dlp для окна загрузок §6.4 (без зависимости runner → downloads-window). */

export type DownloadsLogPayload =
  | { kind: 'reset'; rowId: number }
  | { kind: 'line'; rowId: number; stream: 'stdout' | 'stderr'; text: string }

export const DOWNLOADS_LOG_CHANNEL = 'fluxalloy-downloads-log'

let sink: ((payload: DownloadsLogPayload) => void) | null = null

export function setDownloadsLogSink(fn: ((payload: DownloadsLogPayload) => void) | null): void {
  sink = fn
}

export function emitDownloadsLog(payload: DownloadsLogPayload): void {
  sink?.(payload)
}
