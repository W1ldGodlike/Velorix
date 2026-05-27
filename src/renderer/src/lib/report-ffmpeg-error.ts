import { useAppShellStore } from '../stores/app-shell-store'

/** ref.22 — показать диалог ошибки FFmpeg с текстом из IPC. */
export function reportFfmpegError(message: string): void {
  const store = useAppShellStore.getState()
  store.setFfmpegErrorMessage(message)
  store.openModal('ffmpeg-error')
}

export function reportFfmpegErrorFromResult(
  result: { ok: false; error: string } | { ok: false; cancelled: true }
): void {
  if ('error' in result) {
    reportFfmpegError(result.error)
  }
}
