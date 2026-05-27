export type ProcessErrorDialogPayload = {
  kind: 'uncaughtException' | 'unhandledRejection'
  title: string
  message: string
  detail: string
  copyLabel: string
  openLogLabel: string
  supportZipLabel: string
  closeLabel: string
}

export function parseProcessErrorDialogPayload(raw: unknown): ProcessErrorDialogPayload | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const payload = raw as Record<string, unknown>
  if (
    (payload['kind'] !== 'uncaughtException' && payload['kind'] !== 'unhandledRejection') ||
    typeof payload['title'] !== 'string' ||
    typeof payload['message'] !== 'string' ||
    typeof payload['detail'] !== 'string' ||
    typeof payload['copyLabel'] !== 'string' ||
    typeof payload['openLogLabel'] !== 'string' ||
    typeof payload['supportZipLabel'] !== 'string' ||
    typeof payload['closeLabel'] !== 'string'
  ) {
    return null
  }
  return {
    kind: payload['kind'],
    title: payload['title'],
    message: payload['message'],
    detail: payload['detail'],
    copyLabel: payload['copyLabel'],
    openLogLabel: payload['openLogLabel'],
    supportZipLabel: payload['supportZipLabel'],
    closeLabel: payload['closeLabel']
  }
}
