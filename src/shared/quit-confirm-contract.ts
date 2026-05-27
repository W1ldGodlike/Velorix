export type QuitConfirmMode = 'busy' | 'idle'

export type QuitConfirmRequestPayload = {
  requestId: number
  mode: QuitConfirmMode
  exportBusy: boolean
  downloadsBusy: boolean
  waitingCount: number
}

export type QuitConfirmResponsePayload = {
  requestId: number
  confirmed: boolean
}

export function parseQuitConfirmRequestPayload(raw: unknown): QuitConfirmRequestPayload | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const payload = raw as Record<string, unknown>
  if (
    typeof payload['requestId'] !== 'number' ||
    (payload['mode'] !== 'busy' && payload['mode'] !== 'idle') ||
    typeof payload['exportBusy'] !== 'boolean' ||
    typeof payload['downloadsBusy'] !== 'boolean' ||
    typeof payload['waitingCount'] !== 'number'
  ) {
    return null
  }
  return {
    requestId: payload['requestId'],
    mode: payload['mode'],
    exportBusy: payload['exportBusy'],
    downloadsBusy: payload['downloadsBusy'],
    waitingCount: payload['waitingCount']
  }
}

export function parseQuitConfirmResponsePayload(raw: unknown): QuitConfirmResponsePayload | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const payload = raw as Record<string, unknown>
  if (typeof payload['requestId'] !== 'number' || typeof payload['confirmed'] !== 'boolean') {
    return null
  }
  return {
    requestId: payload['requestId'],
    confirmed: payload['confirmed']
  }
}
