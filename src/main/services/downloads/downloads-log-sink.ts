import type { DownloadsLogPayload } from '../../../shared/downloads-log-contract'

let sink: ((payload: DownloadsLogPayload) => void) | null = null

export function setDownloadsLogSink(fn: ((payload: DownloadsLogPayload) => void) | null): void {
  sink = fn
}

/** Backend log lines (no renderer listener until rebuild). */
export function emitDownloadsLog(payload: DownloadsLogPayload): void {
  sink?.(payload)
}
