import type { WebContents } from 'electron'

import type { FfmpegExportProgressPayload } from '../../shared/ffmpeg-export-contract'
import { mainWindowIpc as mw } from '../../shared/ipc-channels'

/** Push `exportProgress` to renderer. */
export function sendExportProgress(
  webContents: WebContents,
  payload: FfmpegExportProgressPayload
): void {
  webContents.send(mw.exportProgress, payload)
}
