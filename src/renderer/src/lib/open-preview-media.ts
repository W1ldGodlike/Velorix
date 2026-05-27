import type { PreviewDialogResult } from '../../../shared/preview-dialog-contract'

/** Renderer → IPC → main `openVideoWithDialog` (§4.B, velorixmedia allowlist). */
export async function openPreviewMediaDialog(): Promise<PreviewDialogResult> {
  const api = window.velorix?.preview?.openFileDialog
  if (api == null) {
    return { ok: false, error: 'velorix.preview.openFileDialog unavailable' }
  }
  return api()
}
