import { basename } from 'path'

import { BrowserWindow, dialog } from 'electron'

import { grantMediaPath } from './media-protocol'
import type { PreviewDialogResult } from '../shared/preview-dialog-contract'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { getMainApplicationStrings } from '../shared/main-application-locale'

export type { PreviewDialogResult } from '../shared/preview-dialog-contract'

/**
 * Системный диалог выбора локального видео (§4.B). Путь сразу регистрируется в allowlist
 * `fluxmedia://`, чтобы `<video>` мог безопасно стримить файл и в dev (Vite), и в prod.
 */
export async function openVideoWithDialog(
  browserWindow: BrowserWindow,
  locale: DownloadsWindowUiLocale = 'ru'
): Promise<PreviewDialogResult> {
  const S = getMainApplicationStrings(locale)
  const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, {
    title: S.openVideoDialogTitle,
    properties: ['openFile'],
    filters: [
      {
        name: S.openVideoDialogFilterVideo,
        extensions: ['mp4', 'mkv', 'webm', 'mov', 'avi', 'm4v', 'wmv', 'mpeg', 'mpg', 'ts']
      }
    ]
  })
  if (canceled || filePaths.length === 0) {
    return { ok: false, canceled: true }
  }
  const filePath = filePaths[0]
  if (typeof filePath !== 'string' || filePath.length === 0) {
    return { ok: false, canceled: true }
  }
  const mediaUrl = grantMediaPath(filePath)
  if (!mediaUrl) {
    return { ok: false, error: S.previewDialogGrantMediaFailed }
  }
  return { ok: true, path: filePath, mediaUrl, name: basename(filePath) }
}
