import { basename, normalize } from 'path'

import { BrowserWindow, dialog } from 'electron'

import { grantMediaPath } from './media-protocol'
import { scanFolderForFfmpegExportBatchVideos } from './ffmpeg-export-batch-folder-scan'
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
  locale: DownloadsWindowUiLocale = 'ru',
  opts?: { defaultPath?: string }
): Promise<PreviewDialogResult> {
  const S = getMainApplicationStrings(locale)
  const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, {
    title: S.openVideoDialogTitle,
    ...(opts?.defaultPath ? { defaultPath: opts.defaultPath } : {}),
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

/** §4.B — диалог папки: первое видео после того же рекурсивного scan, что и пакет/DnD. */
export async function openVideoFolderWithDialog(
  browserWindow: BrowserWindow,
  locale: DownloadsWindowUiLocale = 'ru',
  opts?: { defaultPath?: string }
): Promise<PreviewDialogResult> {
  const S = getMainApplicationStrings(locale)
  const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, {
    title: S.openVideoFolderDialogTitle,
    ...(opts?.defaultPath ? { defaultPath: opts.defaultPath } : {}),
    properties: ['openDirectory']
  })
  if (canceled || filePaths.length === 0) {
    return { ok: false, canceled: true }
  }
  const dirRaw = filePaths[0]
  if (typeof dirRaw !== 'string' || dirRaw.trim().length === 0) {
    return { ok: false, canceled: true }
  }
  const dir = normalize(dirRaw.trim())
  const scanned = scanFolderForFfmpegExportBatchVideos(dir)
  if (scanned.length === 0) {
    return { ok: false, error: S.batchExportFolderEmpty }
  }
  const filePath = scanned[0]!
  const mediaUrl = grantMediaPath(filePath)
  if (!mediaUrl) {
    return { ok: false, error: S.previewDialogGrantMediaFailed }
  }
  return { ok: true, path: filePath, mediaUrl, name: basename(filePath) }
}
