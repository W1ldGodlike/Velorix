import { existsSync, rmSync } from 'fs'
import { basename, join, normalize, resolve } from 'path'

import { BrowserWindow, dialog, ipcMain } from 'electron'

import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import type { FfmpegHwEncodersProbeResult } from '../../shared/ffmpeg-hw-encoder-probe'
import type { AppUiLocale } from '../../shared/app-ui-locale'
import { formatPickEngineExecutableTitle } from '../../shared/main-application-locale'
import { resolveAppPaths } from '../core/app-paths'
import type { EngineDownloadProgress } from '../../shared/engine-download-contract'
import { downloadEnginesWindows, isAnyEngineMissing } from '../services/engines/engine-download'
import { runEnginesCheckUpdatesAndDownload } from '../services/engines/engine-update-check'
import { loadTrustedHashes, resolveTrustedHashesPath } from '../core/trusted-hashes-store'
import {
  ENGINE_IDS,
  getEnginesStatus,
  resolveEngineExecutablePath,
  type EnginePathOverrides,
  type EnginesStatusSnapshot
} from '../services/engines/engine-service'
import { probeFfmpegHwEncoders } from '../services/ffmpeg/ffmpeg-hw-encoder-probe-main'
import { probeMediaFile } from '../services/ffprobe/ffprobe-service'
import { grantMediaPath, isGrantedMediaPath } from '../core/media-protocol'
import {
  nativeMainEngineExecutableSuffix,
  nativeMainEngineOpenDialogFilters
} from '../platform/index'
import type { EnginesCheckUpdatesAndDownloadResult } from '../../shared/engine-update-check-contract'
import { openVideoFolderWithDialog, openVideoWithDialog } from '../services/preview/preview-dialog'

let ipcRegistered = false

type PreviewPathResolveResult = { ok: true; path: string } | { ok: false; error: string }

export type EnginesPreviewIpcDeps = {
  mainAppStr: () => {
    filterExecutables: string
    exportFilterAll: string
    exportFfmpegMissing: string
    openVideoDialogNoWindow: string
    previewGrantEmptyPath: string
    previewGrantOpenFailed: string
    previewGrantSourceFailed: string
    mediaProbePathMissing: string
    mediaProbeNotGranted: string
  }
  mainDownloadsUiLocale: () => AppUiLocale
  ipcDownloadsUiLocale: (raw?: unknown) => AppUiLocale
  getEnginePathOverrides: () => EnginePathOverrides
  getLastOpenedSourcePath: () => string | undefined
  buildApplicationMenu: () => void
  previewOpenDialogOptsFromSettings: () => { defaultPath: string } | undefined
  persistLastOpenedSource: (absolutePath: string | null) => void
  resolveUserPathToPreviewSourceFile: (rawPath: string) => PreviewPathResolveResult
  ensurePreviewPlayableMedia: (absoluteFile: string) => Promise<string>
}

export function registerEnginesPreviewIpcHandlers(deps: EnginesPreviewIpcDeps): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  ipcMain.handle(
    mw.pickEngineExecutable,
    async (event, engineId: unknown): Promise<string | null> => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return null
      }
      const I = deps.mainAppStr()
      const id =
        engineId === 'ffmpeg' || engineId === 'ffprobe' || engineId === 'yt-dlp' ? engineId : null
      if (!id) {
        return null
      }
      const result = await dialog.showOpenDialog(win, {
        title: formatPickEngineExecutableTitle(deps.mainDownloadsUiLocale(), id),
        properties: ['openFile'],
        filters: nativeMainEngineOpenDialogFilters({
          executables: I.filterExecutables,
          all: I.exportFilterAll
        })
      })
      if (result.canceled || result.filePaths.length === 0) {
        return null
      }
      return result.filePaths[0] ?? null
    }
  )

  ipcMain.handle(
    mw.enginesStatus,
    async (_event, raw?: unknown): Promise<EnginesStatusSnapshot> => {
      return getEnginesStatus(
        resolveAppPaths(),
        deps.getEnginePathOverrides(),
        deps.ipcDownloadsUiLocale(raw)
      )
    }
  )

  ipcMain.handle(mw.enginesShouldOfferDownload, (): boolean => {
    return isAnyEngineMissing(resolveAppPaths(), deps.getEnginePathOverrides())
  })

  ipcMain.handle(
    mw.enginesDownload,
    async (event, raw?: unknown): Promise<{ ok: true } | { ok: false; error: string }> => {
      const win = BrowserWindow.fromWebContents(event.sender)
      const paths = resolveAppPaths()
      const trusted = loadTrustedHashes(resolveTrustedHashesPath())
      const loc = deps.ipcDownloadsUiLocale(raw)
      try {
        await downloadEnginesWindows(
          paths,
          trusted,
          (p: EngineDownloadProgress) => {
            win?.webContents.send(mw.enginesProgress, p)
          },
          loc
        )
        deps.buildApplicationMenu()
        return { ok: true }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        return { ok: false, error: msg }
      }
    }
  )

  ipcMain.handle(
    mw.enginesCheckUpdatesAndDownload,
    async (event, raw?: unknown): Promise<EnginesCheckUpdatesAndDownloadResult> => {
      const win = BrowserWindow.fromWebContents(event.sender)
      const paths = resolveAppPaths()
      const trusted = loadTrustedHashes(resolveTrustedHashesPath())
      const loc = deps.ipcDownloadsUiLocale(raw)
      return runEnginesCheckUpdatesAndDownload(
        paths,
        trusted,
        deps.getEnginePathOverrides(),
        (p: EngineDownloadProgress) => {
          win?.webContents.send(mw.enginesProgress, p)
        },
        loc
      )
    }
  )

  ipcMain.handle(
    mw.enginesClearUserBin,
    async (): Promise<{ ok: true; removed: number } | { ok: false; error: string }> => {
      const paths = resolveAppPaths()
      const suffix = nativeMainEngineExecutableSuffix()
      let removed = 0
      try {
        for (const id of ENGINE_IDS) {
          const target = join(paths.userBin, `${id}${suffix}`)
          if (existsSync(target)) {
            rmSync(target, { force: true })
            removed += 1
          }
        }
        rmSync(join(paths.userBin, '.cache'), { recursive: true, force: true })
        deps.buildApplicationMenu()
        return { ok: true, removed }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        return { ok: false, error: msg }
      }
    }
  )

  ipcMain.handle(mw.enginesProbeHwEncoders, async (): Promise<FfmpegHwEncodersProbeResult> => {
    const paths = resolveAppPaths()
    const ffmpeg = resolveEngineExecutablePath(paths, 'ffmpeg', deps.getEnginePathOverrides())
    if (!ffmpeg) {
      return { ok: false, error: deps.mainAppStr().exportFfmpegMissing }
    }
    return probeFfmpegHwEncoders(ffmpeg)
  })

  ipcMain.handle(mw.openVideoDialog, async (event, raw?: unknown) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) {
      return { ok: false, error: deps.mainAppStr().openVideoDialogNoWindow }
    }
    const def = deps.previewOpenDialogOptsFromSettings()
    const result = await openVideoWithDialog(win, deps.ipcDownloadsUiLocale(raw), def)
    if (result.ok) {
      deps.persistLastOpenedSource(result.path)
    }
    return result
  })

  ipcMain.handle(mw.openVideoFolderDialog, async (event, raw?: unknown) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) {
      return { ok: false, error: deps.mainAppStr().openVideoDialogNoWindow }
    }
    const def = deps.previewOpenDialogOptsFromSettings()
    const result = await openVideoFolderWithDialog(win, deps.ipcDownloadsUiLocale(raw), def)
    if (result.ok) {
      deps.persistLastOpenedSource(result.path)
    }
    return result
  })

  ipcMain.handle(mw.previewGrantPath, async (_, rawPath: unknown) => {
    const P = deps.mainAppStr()
    if (typeof rawPath !== 'string' || rawPath.length === 0) {
      return { ok: false, error: P.previewGrantEmptyPath }
    }
    const resolved = deps.resolveUserPathToPreviewSourceFile(rawPath)
    if (!resolved.ok) {
      return { ok: false, error: resolved.error }
    }
    const sourceMediaPath = resolved.path
    let previewFile: string
    try {
      previewFile = await deps.ensurePreviewPlayableMedia(sourceMediaPath)
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) }
    }
    const mediaUrl = grantMediaPath(previewFile)
    if (!mediaUrl) {
      return { ok: false, error: P.previewGrantOpenFailed }
    }
    if (!grantMediaPath(sourceMediaPath)) {
      return { ok: false, error: P.previewGrantSourceFailed }
    }
    deps.persistLastOpenedSource(sourceMediaPath)
    return {
      ok: true,
      path: sourceMediaPath,
      mediaUrl,
      name: basename(sourceMediaPath)
    }
  })

  ipcMain.handle(mw.persistLastSource, (_, raw: unknown) => {
    if (raw === null || raw === undefined || raw === '') {
      deps.persistLastOpenedSource(null)
      return
    }
    if (typeof raw === 'string') {
      deps.persistLastOpenedSource(raw)
    }
  })

  ipcMain.handle(mw.restoreLastSource, async () => {
    const saved = deps.getLastOpenedSourcePath()
    if (typeof saved !== 'string' || saved.trim().length === 0 || !existsSync(saved)) {
      return null
    }
    const sourcePath = saved.trim()
    const resolved = deps.resolveUserPathToPreviewSourceFile(sourcePath)
    if (!resolved.ok) {
      deps.persistLastOpenedSource(null)
      return null
    }
    const sourceMediaPath = resolved.path
    let previewFile: string
    try {
      previewFile = await deps.ensurePreviewPlayableMedia(sourceMediaPath)
    } catch {
      deps.persistLastOpenedSource(null)
      return null
    }
    const mediaUrl = grantMediaPath(previewFile)
    if (!mediaUrl) {
      deps.persistLastOpenedSource(null)
      return null
    }
    if (!grantMediaPath(sourceMediaPath)) {
      deps.persistLastOpenedSource(null)
      return null
    }
    return {
      path: sourceMediaPath,
      mediaUrl,
      name:
        previewFile === sourceMediaPath
          ? basename(sourceMediaPath)
          : `${basename(sourceMediaPath)} · preview WebM`
    }
  })

  ipcMain.handle(mw.mediaProbe, async (_, rawPath: unknown) => {
    const P = deps.mainAppStr()
    if (typeof rawPath !== 'string' || rawPath.trim().length === 0) {
      return { ok: false as const, error: P.mediaProbePathMissing }
    }
    const abs = resolve(normalize(rawPath.trim()))
    if (!isGrantedMediaPath(abs)) {
      return {
        ok: false as const,
        error: P.mediaProbeNotGranted
      }
    }
    return probeMediaFile(
      resolveAppPaths(),
      abs,
      deps.getEnginePathOverrides(),
      deps.mainDownloadsUiLocale()
    )
  })
}
