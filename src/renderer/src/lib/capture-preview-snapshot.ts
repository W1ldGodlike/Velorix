import type { SystemModalId } from '../app/system-modal'

export type CapturePreviewSnapshotResult =
  | { ok: true; path: string }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }
  | null

/** Сохранить кадр в позиции playhead через `preview.snapshotFrame`. */
export async function capturePreviewSnapshot(args: {
  inputPath: string
  timeSec: number
  openModal: (id: SystemModalId) => void
}): Promise<CapturePreviewSnapshotResult> {
  const snap = window.velorix?.preview?.snapshotFrame
  if (snap == null) {
    return null
  }
  const result = await snap({
    inputPath: args.inputPath,
    timeSec: args.timeSec,
    uiLocale: 'ru'
  })
  if (!result.ok && !('cancelled' in result && result.cancelled)) {
    args.openModal('ffmpeg-error')
  }
  return result
}
