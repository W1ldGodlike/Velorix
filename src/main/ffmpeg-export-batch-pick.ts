import { basename, normalize } from 'node:path'

import { BrowserWindow, dialog } from 'electron'

import { FFMPEG_EXPORT_BATCH_VIDEO_EXTENSIONS } from '../shared/ffmpeg-export-batch-video-ext'
import { grantMediaPath } from './media-protocol'
import { scanFolderForFfmpegExportBatchVideos } from './ffmpeg-export-batch-folder-scan'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { getMainApplicationStrings } from '../shared/main-application-locale'

function grantBatchVideoPaths(
  paths: string[],
  grantFailedLabel: string
): { ok: true; paths: string[] } | { ok: false; error: string } {
  const granted: string[] = []
  for (const abs of paths) {
    const mediaUrl = grantMediaPath(abs)
    if (!mediaUrl) {
      return {
        ok: false,
        error: `${grantFailedLabel}: ${basename(abs)}`
      }
    }
    granted.push(abs)
  }
  if (granted.length === 0) {
    return { ok: false, error: grantFailedLabel }
  }
  return { ok: true, paths: granted }
}

export async function pickFfmpegExportBatchInputFiles(
  browserWindow: BrowserWindow,
  locale: DownloadsWindowUiLocale = 'ru',
  opts?: { defaultPath?: string }
): Promise<
  { ok: true; paths: string[] } | { ok: false; cancelled: true } | { ok: false; error: string }
> {
  const S = getMainApplicationStrings(locale)
  const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, {
    title: S.batchExportPickFilesTitle,
    ...(opts?.defaultPath ? { defaultPath: opts.defaultPath } : {}),
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: S.openVideoDialogFilterVideo,
        extensions: [...FFMPEG_EXPORT_BATCH_VIDEO_EXTENSIONS]
      }
    ]
  })
  if (canceled || filePaths.length === 0) {
    return { ok: false, cancelled: true }
  }
  const normalized: string[] = []
  for (const raw of filePaths) {
    if (typeof raw === 'string' && raw.trim().length > 0) {
      normalized.push(normalize(raw.trim()))
    }
  }
  return grantBatchVideoPaths(normalized, S.previewDialogGrantMediaFailed)
}

export async function pickFfmpegExportBatchInputFolder(
  browserWindow: BrowserWindow,
  locale: DownloadsWindowUiLocale = 'ru',
  opts?: { defaultPath?: string }
): Promise<
  { ok: true; paths: string[] } | { ok: false; cancelled: true } | { ok: false; error: string }
> {
  const S = getMainApplicationStrings(locale)
  const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, {
    title: S.batchExportPickFolderTitle,
    ...(opts?.defaultPath ? { defaultPath: opts.defaultPath } : {}),
    properties: ['openDirectory']
  })
  if (canceled || filePaths.length === 0 || !filePaths[0]) {
    return { ok: false, cancelled: true }
  }
  const dir = normalize(filePaths[0])
  const scanned = scanFolderForFfmpegExportBatchVideos(dir)
  if (scanned.length === 0) {
    return { ok: false, error: S.batchExportFolderEmpty }
  }
  return grantBatchVideoPaths(scanned, S.previewDialogGrantMediaFailed)
}

/** §7.3 — папка сохранения результатов пакета (без сканирования файлов). */
export async function pickFfmpegExportBatchOutputFolder(
  browserWindow: BrowserWindow,
  locale: DownloadsWindowUiLocale = 'ru',
  opts?: { defaultPath?: string }
): Promise<{ ok: true; path: string } | { ok: false; cancelled: true }> {
  const S = getMainApplicationStrings(locale)
  const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, {
    title: S.batchExportPickOutputFolderTitle,
    ...(opts?.defaultPath ? { defaultPath: opts.defaultPath } : {}),
    properties: ['openDirectory', 'createDirectory']
  })
  if (canceled || filePaths.length === 0 || !filePaths[0]) {
    return { ok: false, cancelled: true }
  }
  return { ok: true, path: normalize(filePaths[0]) }
}
