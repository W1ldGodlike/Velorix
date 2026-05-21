import type { WebContents } from 'electron'

import type { FfmpegExportProgressPayload } from '../../shared/ffmpeg-export-contract'
import { mainWindowIpc as mw } from '../../shared/ipc-channels'

let miniPlayerExportProgress: FfmpegExportProgressPayload | null = null

export function getMiniPlayerExportProgress(): FfmpegExportProgressPayload | null {
  return miniPlayerExportProgress
}

export function clearMiniPlayerExportProgress(): void {
  miniPlayerExportProgress = null
}

/** Push `exportProgress` to renderer and cache последний payload для §4.3 Mini Player. */
export function sendExportProgress(
  webContents: WebContents,
  payload: FfmpegExportProgressPayload
): void {
  miniPlayerExportProgress = payload
  webContents.send(mw.exportProgress, payload)
}
