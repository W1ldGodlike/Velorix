import { existsSync } from 'fs'
import { basename, extname, normalize, resolve } from 'path'

import { BrowserWindow, dialog, ipcMain } from 'electron'

import type { FfmpegCoverExtractResult } from '../shared/ffmpeg-cover-extract-contract'
import { downloadsIpc as d } from '../shared/ipc-channels'
import { getMainApplicationStrings } from '../shared/main-application-locale'
import { resolveAppPaths } from './app-paths'
import { getDownloadsQueueRowById } from './downloads-queue'
import {
  ipcStr,
  ipcUiLocale,
  isDownloadsOrMainSender
} from './downloads-window-runtime'
import { resolveEngineExecutablePath } from './engine-service'
import { runFfmpegCoverExtract } from './ffmpeg-cover-extract-runner'
import { getCachedSettings } from './main-cached-settings-host'
import { isGrantedMediaPath } from './media-protocol'

let ipcRegistered = false

export function registerDownloadsCoverIpcHandlers(): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  ipcMain.handle(
    d.extractQueueCover,
    async (event, raw: unknown): Promise<FfmpegCoverExtractResult> => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      const queueRowId =
        typeof raw === 'number'
          ? raw
          : typeof raw === 'object' &&
              raw !== null &&
              typeof (raw as { queueRowId?: unknown }).queueRowId === 'number'
            ? (raw as { queueRowId: number }).queueRowId
            : Number.NaN
      if (!Number.isFinite(queueRowId)) {
        return { ok: false, error: P.invalidRowId }
      }
      const uiLocale = ipcUiLocale(event.sender)
      const M = getMainApplicationStrings(uiLocale)
      const row = getDownloadsQueueRowById(queueRowId)
      if (!row?.outputPath) {
        return { ok: false, error: P.queueRowNoOutputPath }
      }
      const absIn = resolve(normalize(row.outputPath))
      if (!existsSync(absIn)) {
        return { ok: false, error: M.exportFileNotFound }
      }
      if (!isGrantedMediaPath(absIn)) {
        return { ok: false, error: M.exportNotGrantedPath }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, error: M.exportNoActiveWindow }
      }
      const stem = basename(absIn, extname(absIn))
      const pick = await dialog.showSaveDialog(win, {
        title: M.downloadsCoverSaveTitle,
        defaultPath: `${stem}_cover.jpg`,
        filters: [
          { name: M.downloadsCoverSaveFilterJpg, extensions: ['jpg', 'jpeg'] },
          { name: M.downloadsCoverSaveFilterPng, extensions: ['png'] }
        ]
      })
      if (pick.canceled || !pick.filePath) {
        return { ok: false, cancelled: true }
      }
      const paths = resolveAppPaths()
      const engineOverrides = getCachedSettings().engineExecutablePaths
      const ffmpeg = resolveEngineExecutablePath(paths, 'ffmpeg', engineOverrides)
      const ffprobe = resolveEngineExecutablePath(paths, 'ffprobe', engineOverrides)
      if (!ffmpeg || !ffprobe) {
        return { ok: false, error: M.exportFfmpegMissing }
      }
      return runFfmpegCoverExtract({
        ffprobePath: ffprobe,
        ffmpegPath: ffmpeg,
        inputPath: absIn,
        outputPath: pick.filePath
      })
    }
  )
}
