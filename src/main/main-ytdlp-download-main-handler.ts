import { basename } from 'path'

import { BrowserWindow } from 'electron'

import { mainWindowIpc as mw } from '../shared/ipc-channels'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import {
  autoExportProgressMessage,
  fluxLogAutoExportCancelled,
  fluxLogAutoExportFfmpegMissing,
  fluxLogAutoExportSkippedBusy,
  fluxLogAutoExportSkippedMainWindow,
  formatFluxLogAutoExportDone,
  formatFluxLogAutoExportFailed
} from '../shared/downloads-flux-log-locale'
import { FFMPEG_EXPORT_CANCELLED_ERROR } from '../shared/ffmpeg-export-contract'
import {
  processingHistoryAutoExportCancelled,
  processingHistoryAutoExportFailed,
  processingHistoryAutoExportSuccess
} from '../shared/processing-history-status-locale'
import { resolveAppPaths } from './app-paths'
import { emitDownloadsLog } from './downloads-log-ipc'
import type { FfmpegExportProgressPayload } from './ffmpeg-export-service'
import { runFfmpegExportJob } from './ffmpeg-export-service'
import {
  pickUniqueAutoExportOutputPath,
  resolveFfmpegExportJobOptionsFromAppSettings
} from './ffmpeg-export-resolve-from-settings'
import { resolveEngineExecutablePath } from './engine-service'
import type { EnginePathOverrides } from './engine-service'
import { grantMediaPath } from './media-protocol'
import { appendProcessingHistoryEntry } from './processing-history'
import { ensurePreviewPlayableMedia } from './preview-proxy-service'
import type { AppSettings } from './settings-store'

export type MainYtdlpDownloadMainHandlerAccess = {
  mainAppStr: () => {
    previewCannotOpenInPreview: string
    previewCannotOpenSourceInEditor: string
    previewMainWindowMissing: string
  }
  mainDownloadsUiLocale: () => DownloadsWindowUiLocale
  getSettings: () => AppSettings
  getEnginePathOverrides: () => EnginePathOverrides
  getMainWindowWebContentsId: () => number | null
  persistLastOpenedSource: (absolutePath: string | null) => void
  isExportBusy: () => boolean
  setActiveExportAbort: (ac: AbortController | null) => void
  rememberExportOutputPath: (filePath: string) => void
  rememberFfmpegExportDirectory: (outputPath: string) => void
}

let access: MainYtdlpDownloadMainHandlerAccess | null = null

export function configureMainYtdlpDownloadMainHandler(
  next: MainYtdlpDownloadMainHandlerAccess
): void {
  access = next
}

function requireAccess(): MainYtdlpDownloadMainHandlerAccess {
  if (!access) {
    throw new Error(
      'main-ytdlp-download-main-handler: configureMainYtdlpDownloadMainHandler not called'
    )
  }
  return access
}

function findMainBrowserWindow(): BrowserWindow | null {
  const host = requireAccess()
  const id = host.getMainWindowWebContentsId()
  if (id === null) {
    return null
  }
  return BrowserWindow.getAllWindows().find((w) => w.webContents.id === id) ?? null
}

export async function openDownloadedFileInMainHandler(
  absoluteFile: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const host = requireAccess()
  const H = host.mainAppStr()
  let previewFile: string
  try {
    previewFile = await ensurePreviewPlayableMedia(absoluteFile)
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
  const mediaUrl = grantMediaPath(previewFile)
  if (!mediaUrl) {
    return { ok: false, error: H.previewCannotOpenInPreview }
  }
  if (!grantMediaPath(absoluteFile)) {
    return { ok: false, error: H.previewCannotOpenSourceInEditor }
  }
  const target = findMainBrowserWindow()
  if (!target || target.isDestroyed()) {
    return { ok: false, error: H.previewMainWindowMissing }
  }
  host.persistLastOpenedSource(absoluteFile)
  target.show()
  target.focus()
  target.webContents.send(mw.previewOpened, {
    ok: true,
    path: absoluteFile,
    mediaUrl,
    name:
      previewFile === absoluteFile
        ? basename(absoluteFile)
        : `${basename(absoluteFile)} · preview WebM`
  })
  return { ok: true }
}

export function scheduleAutoExportAfterSuccessfulYtdlpOpen(
  absoluteInput: string,
  rowId: number
): void {
  void (async () => {
    const host = requireAccess()
    const loc = host.mainDownloadsUiLocale()
    const settings = host.getSettings()
    if (settings.ytdlpAutoExportAfterOpenInHandler !== true) {
      return
    }
    if (host.isExportBusy()) {
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: fluxLogAutoExportSkippedBusy(loc)
      })
      return
    }
    const paths = resolveAppPaths()
    const ffmpeg = resolveEngineExecutablePath(paths, 'ffmpeg', host.getEnginePathOverrides())
    if (!ffmpeg) {
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: fluxLogAutoExportFfmpegMissing(loc)
      })
      return
    }
    const exportOpts = resolveFfmpegExportJobOptionsFromAppSettings(settings, undefined)
    const outPath = pickUniqueAutoExportOutputPath(absoluteInput, exportOpts.container)
    const targetWin = findMainBrowserWindow()
    if (!targetWin || targetWin.isDestroyed()) {
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: fluxLogAutoExportSkippedMainWindow(loc)
      })
      return
    }
    const ac = new AbortController()
    host.setActiveExportAbort(ac)
    const startedAt = Date.now()
    const pushProgress = (p: FfmpegExportProgressPayload): void => {
      if (!targetWin.isDestroyed()) {
        targetWin.webContents.send(mw.exportProgress, p)
      }
    }
    try {
      pushProgress({ percent: -1, message: autoExportProgressMessage(loc) })
      const result = await runFfmpegExportJob({
        ffmpegPath: ffmpeg,
        inputPath: absoluteInput,
        outputPath: outPath,
        probeDurationSec: null,
        ...exportOpts,
        lutResourcesRoot: paths.resources,
        signal: ac.signal,
        onProgress: pushProgress,
        uiLocale: loc
      })
      if (result.ok) {
        host.rememberExportOutputPath(outPath)
        host.rememberFfmpegExportDirectory(outPath)
        appendProcessingHistoryEntry(paths.userData, {
          kind: 'autoExport',
          startedAt,
          finishedAt: Date.now(),
          inputPath: absoluteInput,
          outputPath: outPath,
          outcome: 'success',
          status: processingHistoryAutoExportSuccess(loc),
          errorHint: null,
          exportVideoCodecUsed: result.videoCodecUsed
        })
        emitDownloadsLog({
          kind: 'line',
          rowId,
          stream: 'stderr',
          text: formatFluxLogAutoExportDone(loc, outPath)
        })
        return
      }
      if (result.error === FFMPEG_EXPORT_CANCELLED_ERROR) {
        appendProcessingHistoryEntry(paths.userData, {
          kind: 'autoExport',
          startedAt,
          finishedAt: Date.now(),
          inputPath: absoluteInput,
          outputPath: outPath,
          outcome: 'cancelled',
          status: processingHistoryAutoExportCancelled(loc),
          errorHint: null,
          exportVideoCodecUsed: result.videoCodecUsed
        })
        emitDownloadsLog({
          kind: 'line',
          rowId,
          stream: 'stderr',
          text: fluxLogAutoExportCancelled(loc)
        })
        return
      }
      appendProcessingHistoryEntry(paths.userData, {
        kind: 'autoExport',
        startedAt,
        finishedAt: Date.now(),
        inputPath: absoluteInput,
        outputPath: outPath,
        outcome: 'error',
        status: processingHistoryAutoExportFailed(loc),
        errorHint: result.error,
        exportVideoCodecUsed: result.videoCodecUsed
      })
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: formatFluxLogAutoExportFailed(loc, result.error)
      })
    } finally {
      host.setActiveExportAbort(null)
    }
  })()
}
