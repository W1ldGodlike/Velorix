import type { DownloadsLogPayload } from '../shared/downloads-log-contract'

import { downloadsIpc } from '../shared/ipc-channels'

export type { DownloadsLogPayload } from '../shared/downloads-log-contract'

export const DOWNLOADS_LOG_CHANNEL = downloadsIpc.log

let sink: ((payload: DownloadsLogPayload) => void) | null = null

export function setDownloadsLogSink(fn: ((payload: DownloadsLogPayload) => void) | null): void {
  sink = fn
}

export function emitDownloadsLog(payload: DownloadsLogPayload): void {
  sink?.(payload)
}
