import { basename, normalize } from 'node:path'

import { BrowserWindow, dialog } from 'electron'

import { grantMediaPath } from './media-protocol'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { getMainApplicationStrings } from '../shared/main-application-locale'

const BATCH_VIDEO_EXTENSIONS = [
  'mp4',
  'mkv',
  'webm',
  'mov',
  'avi',
  'm4v',
  'wmv',
  'mpeg',
  'mpg',
  'ts'
] as const

export async function pickFfmpegExportBatchInputFiles(
  browserWindow: BrowserWindow,
  locale: DownloadsWindowUiLocale = 'ru'
): Promise<{ ok: true; paths: string[] } | { ok: false; cancelled: true } | { ok: false; error: string }> {
  const S = getMainApplicationStrings(locale)
  const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, {
    title: S.batchExportPickFilesTitle,
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: S.openVideoDialogFilterVideo,
        extensions: [...BATCH_VIDEO_EXTENSIONS]
      }
    ]
  })
  if (canceled || filePaths.length === 0) {
    return { ok: false, cancelled: true }
  }
  const granted: string[] = []
  for (const raw of filePaths) {
    if (typeof raw !== 'string' || raw.trim().length === 0) {
      continue
    }
    const abs = normalize(raw.trim())
    const mediaUrl = grantMediaPath(abs)
    if (!mediaUrl) {
      return {
        ok: false,
        error: `${S.previewDialogGrantMediaFailed}: ${basename(abs)}`
      }
    }
    granted.push(abs)
  }
  if (granted.length === 0) {
    return { ok: false, cancelled: true }
  }
  return { ok: true, paths: granted }
}
