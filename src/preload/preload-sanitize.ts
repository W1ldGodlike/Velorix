import type { DownloadsLogPayload } from '../shared/downloads-log-contract'

export function isDownloadsLogPayload(raw: unknown): raw is DownloadsLogPayload {
  if (!raw || typeof raw !== 'object') {
    return false
  }
  const o = raw as { kind?: unknown; rowId?: unknown; stream?: unknown; text?: unknown }
  if (o.kind === 'reset') {
    return typeof o.rowId === 'number' && Number.isFinite(o.rowId)
  }
  return (
    o.kind === 'line' &&
    typeof o.rowId === 'number' &&
    Number.isFinite(o.rowId) &&
    (o.stream === 'stdout' || o.stream === 'stderr') &&
    typeof o.text === 'string'
  )
}
