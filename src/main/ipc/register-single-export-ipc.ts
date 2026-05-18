import { existsSync } from 'fs'
import { basename, normalize, resolve } from 'path'

import { BrowserWindow, dialog, ipcMain } from 'electron'

import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import {
  FFMPEG_EXPORT_CANCELLED_ERROR,
  type FfmpegExportProgressPayload,
  type MediaExportStartResult
} from '../../shared/ffmpeg-export-contract'
import {
  exportProgressLaunchingFfmpeg,
  processingHistoryFfmpegExportCancelled,
  processingHistoryFfmpegExportFailed,
  processingHistoryFfmpegExportSuccess,
  processingHistorySnapshotFailed,
  processingHistorySnapshotSuccess
} from '../../shared/processing-history-status-locale'
import { parseAppUiLocale } from '../../shared/app-ui-locale'
import { getMainApplicationStrings } from '../../shared/main-application-locale'
import { resolveAppPaths } from '../app-paths'
import {
  ensureFfmpegSnapshotExtension,
  parseFfmpegSnapshotFormat,
  runFfmpegSnapshotFrame
} from '../ffmpeg-frame-snapshot-service'
import { ensureFfmpegExportExtension } from '../ffmpeg-export-app-settings-merge'
import {
  parseFfmpegExportBenchmarkRequest,
  type FfmpegExportBenchmarkProgressPayload,
  type FfmpegExportBenchmarkResult
} from '../../shared/ffmpeg-export-benchmark-contract'
import { parseFfmpegFramesExtractRequest } from '../../shared/ffmpeg-frames-extract-request-parse'
import type {
  FfmpegFramesExtractProgressPayload,
  FfmpegFramesExtractResult
} from '../../shared/ffmpeg-frames-extract-contract'
import { runFfmpegFramesExtract } from '../ffmpeg-frames-extract-runner'
import { resolveFfmpegFramesExtractDurationSec } from '../ffmpeg-frames-extract-resolve-duration'
import { probeMediaFile } from '../ffprobe-service'
import {
  parseFfmpegExportTrim,
  parseFfmpegExportVideoLut3d,
  runFfmpegExportJob
} from '../ffmpeg-export-service'
import { runFfmpegExportBenchmark } from '../ffmpeg-export-benchmark-runner'
import { resolveFfmpegExportJobOptionsFromAppSettings } from '../ffmpeg-export-resolve-from-settings'
import { resolveFfmpegExportLutCubeAbsPath } from '../ffmpeg-export-lut-path'
import { resolveEngineExecutablePath } from '../engine-service'
import { isGrantedMediaPath } from '../media-protocol'
import { appendProcessingHistoryEntry } from '../processing-history'
import { focusOrCreateDownloadsWindow } from '../downloads-window'
import { isFfmpegExportBatchActive } from '../ffmpeg-export-batch-runner'
import type { ExportBatchIpcContext } from './export-batch-ipc-context'

export function registerSingleExportIpcHandlers(ctx: ExportBatchIpcContext): void {
  const { host } = ctx
  ipcMain.handle(mw.openDownloadsWindow, (_, raw: unknown) => {
    const req = host.parseDownloadsOpenRequest(raw)
    focusOrCreateDownloadsWindow(req.mergeText, req.uiLocale)
  })
  ipcMain.handle(mw.exportResolveBundledLutCubePath, (_event, raw: unknown): string | null => {
    const id = parseFfmpegExportVideoLut3d(raw)
    const paths = resolveAppPaths()
    return resolveFfmpegExportLutCubeAbsPath(paths.resources, id)
  })
  ipcMain.handle(mw.exportStart, async (event, raw: unknown): Promise<MediaExportStartResult> => {
    const base = host.mainAppStr()
    if (host.getActiveExportAbort() !== null || isFfmpegExportBatchActive()) {
      return { ok: false, error: base.exportAlreadyRunning }
    }
    if (!raw || typeof raw !== 'object') {
      return { ok: false, error: base.exportInvalidRequest }
    }
    const exportUiLocale =
      parseAppUiLocale((raw as { uiLocale?: unknown }).uiLocale) ??
      host.mainDownloadsUiLocale()
    const M = getMainApplicationStrings(exportUiLocale)
    const inputRaw = (raw as { inputPath?: unknown }).inputPath
    if (typeof inputRaw !== 'string' || inputRaw.trim().length === 0) {
      return { ok: false, error: M.exportInputMissing }
    }
    const abs = resolve(normalize(inputRaw.trim()))
    if (!existsSync(abs)) {
      return { ok: false, error: M.exportFileNotFound }
    }
    if (!isGrantedMediaPath(abs)) {
      return {
        ok: false,
        error: M.exportNotGrantedPath
      }
    }
    const pd = (raw as { probeDurationSec?: unknown }).probeDurationSec
    const probeDurationSec = typeof pd === 'number' && Number.isFinite(pd) && pd > 0 ? pd : null
    const trim = parseFfmpegExportTrim((raw as { trim?: unknown }).trim)
    const exportOpts = resolveFfmpegExportJobOptionsFromAppSettings(host.getSettings(), raw)
    const exportContainer = exportOpts.container
    const paths = resolveAppPaths()
    const ffmpeg = resolveEngineExecutablePath(
      paths,
      'ffmpeg',
      host.getSettings().engineExecutablePaths
    )
    if (!ffmpeg) {
      return { ok: false, error: M.exportFfmpegMissing }
    }
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) {
      return { ok: false, error: M.exportNoActiveWindow }
    }
    const stem = basename(abs).replace(/\.[^.]+$/, '')
    const defaultExportName = `${stem}-export.${exportContainer}`
    const pick = await dialog.showSaveDialog(win, {
      title: M.exportVideoDialogTitle,
      defaultPath: host.rememberedExportDefaultPath(defaultExportName),
      filters: [
        { name: M.exportFilterMp4, extensions: ['mp4'] },
        { name: M.exportFilterMkv, extensions: ['mkv'] },
        { name: M.exportFilterMov, extensions: ['mov'] },
        { name: M.exportFilterAll, extensions: ['*'] }
      ]
    })
    if (pick.canceled || !pick.filePath || pick.filePath.trim().length === 0) {
      return { ok: false, cancelled: true }
    }
    const outPath = ensureFfmpegExportExtension(pick.filePath, exportContainer)
    const ac = new AbortController()
    host.setActiveExportAbort(ac)
    const startedAt = Date.now()
    const pushProgress = (p: FfmpegExportProgressPayload): void => {
      win.webContents.send(mw.exportProgress, p)
    }
    try {
      pushProgress({ percent: -1, message: exportProgressLaunchingFfmpeg(exportUiLocale) })
      const result = await runFfmpegExportJob({
        ffmpegPath: ffmpeg,
        inputPath: abs,
        outputPath: outPath,
        ...(trim !== undefined ? { trim } : {}),
        probeDurationSec,
        ...exportOpts,
        lutResourcesRoot: paths.resources,
        signal: ac.signal,
        onProgress: pushProgress,
        uiLocale: exportUiLocale
      })
      if (result.ok) {
        host.rememberExportOutputPath(outPath)
        host.rememberFfmpegExportDirectory(outPath)
        appendProcessingHistoryEntry(paths.userData, {
          kind: 'ffmpegExport',
          startedAt,
          finishedAt: Date.now(),
          inputPath: abs,
          outputPath: outPath,
          outcome: 'success',
          status: processingHistoryFfmpegExportSuccess(exportUiLocale),
          errorHint: null,
          exportVideoCodecUsed: result.videoCodecUsed
        })
        return { ok: true, path: outPath }
      }
      if (result.error === FFMPEG_EXPORT_CANCELLED_ERROR) {
        appendProcessingHistoryEntry(paths.userData, {
          kind: 'ffmpegExport',
          startedAt,
          finishedAt: Date.now(),
          inputPath: abs,
          outputPath: outPath,
          outcome: 'cancelled',
          status: processingHistoryFfmpegExportCancelled(exportUiLocale),
          errorHint: null,
          exportVideoCodecUsed: result.videoCodecUsed
        })
        return { ok: false, cancelled: true }
      }
      appendProcessingHistoryEntry(paths.userData, {
        kind: 'ffmpegExport',
        startedAt,
        finishedAt: Date.now(),
        inputPath: abs,
        outputPath: outPath,
        outcome: 'error',
        status: processingHistoryFfmpegExportFailed(exportUiLocale),
        errorHint: result.error,
        exportVideoCodecUsed: result.videoCodecUsed
      })
      return { ok: false, error: result.error }
    } finally {
      host.setActiveExportAbort(null)
    }
  })
  ipcMain.handle(
    mw.exportBenchmarkEncoders,
    async (event, raw: unknown): Promise<FfmpegExportBenchmarkResult> => {
      const base = host.mainAppStr()
      if (host.getActiveExportAbort() !== null || isFfmpegExportBatchActive()) {
        return { ok: false, error: base.exportAlreadyRunning }
      }
      const exportUiLocale =
        parseAppUiLocale((raw as { uiLocale?: unknown })?.uiLocale) ??
        host.mainDownloadsUiLocale()
      const parsedReq = parseFfmpegExportBenchmarkRequest(raw, exportUiLocale)
      if (!parsedReq.ok) {
        return { ok: false, error: parsedReq.error }
      }
      const abs = resolve(normalize(parsedReq.payload.inputPath))
      if (!existsSync(abs)) {
        return { ok: false, error: getMainApplicationStrings(exportUiLocale).exportFileNotFound }
      }
      if (!isGrantedMediaPath(abs)) {
        return {
          ok: false,
          error: getMainApplicationStrings(exportUiLocale).exportNotGrantedPath
        }
      }
      const paths = resolveAppPaths()
      const ffmpeg = resolveEngineExecutablePath(
        paths,
        'ffmpeg',
        host.getSettings().engineExecutablePaths
      )
      if (!ffmpeg) {
        return { ok: false, error: getMainApplicationStrings(exportUiLocale).exportFfmpegMissing }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, error: getMainApplicationStrings(exportUiLocale).exportNoActiveWindow }
      }
      const ac = new AbortController()
      host.setActiveExportAbort(ac)
      const pushBenchmarkProgress = (p: FfmpegExportBenchmarkProgressPayload): void => {
        win.webContents.send(mw.exportBenchmarkProgress, p)
      }
      try {
        return await runFfmpegExportBenchmark({
          ffmpegPath: ffmpeg,
          inputPath: abs,
          settings: host.getSettings(),
          request: parsedReq.payload,
          lutResourcesRoot: paths.resources,
          signal: ac.signal,
          onProgress: pushBenchmarkProgress
        })
      } finally {
        host.setActiveExportAbort(null)
      }
    }
  )
  ipcMain.handle(
    mw.extractFrames,
    async (event, raw: unknown): Promise<FfmpegFramesExtractResult> => {
      const base = host.mainAppStr()
      if (host.getActiveExportAbort() !== null || isFfmpegExportBatchActive()) {
        return { ok: false, error: base.exportAlreadyRunning }
      }
      const exportUiLocale =
        parseAppUiLocale((raw as { uiLocale?: unknown })?.uiLocale) ??
        host.mainDownloadsUiLocale()
      const M = getMainApplicationStrings(exportUiLocale)
      const parsedReq = parseFfmpegFramesExtractRequest(raw)
      if (!parsedReq.ok) {
        return { ok: false, error: M.ipcInvalidRequest }
      }
      const abs = resolve(normalize(parsedReq.payload.inputPath))
      if (!existsSync(abs)) {
        return { ok: false, error: M.exportFileNotFound }
      }
      if (!isGrantedMediaPath(abs)) {
        return { ok: false, error: M.exportNotGrantedPath }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, error: M.exportNoActiveWindow }
      }
      const pick = await dialog.showOpenDialog(win, {
        title: M.extractFramesPickFolderTitle,
        properties: ['openDirectory', 'createDirectory']
      })
      if (pick.canceled || !pick.filePaths[0]) {
        return { ok: false, cancelled: true }
      }
      const outputDir = pick.filePaths[0]
      const paths = resolveAppPaths()
      const ffmpeg = resolveEngineExecutablePath(
        paths,
        'ffmpeg',
        host.getSettings().engineExecutablePaths
      )
      if (!ffmpeg) {
        return { ok: false, error: M.exportFfmpegMissing }
      }
      const ac = new AbortController()
      host.setActiveExportAbort(ac)
      const pushProgress = (p: FfmpegFramesExtractProgressPayload): void => {
        win.webContents.send(mw.extractFramesProgress, p)
      }
      const startedAt = Date.now()
      const mapScheduleError = (code: string): string => {
        switch (code) {
          case 'too_many_frames':
            return M.extractFramesTooMany
          case 'duration_too_short':
            return M.extractFramesDurationTooShort
          case 'invalid_count':
            return M.extractFramesInvalidCount
          case 'invalid_manual':
            return M.extractFramesInvalidManual
          default:
            return M.ipcInvalidRequest
        }
      }
      try {
        const durationResolved = await resolveFfmpegFramesExtractDurationSec({
          durationSecFromClient: parsedReq.payload.durationSec,
          probeMedia: () =>
            probeMediaFile(paths, abs, host.getSettings().engineExecutablePaths, exportUiLocale)
        })
        if (!durationResolved.ok) {
          if (durationResolved.error === 'duration_too_short') {
            return { ok: false, error: M.extractFramesDurationTooShort }
          }
          return { ok: false, error: durationResolved.error }
        }
        const result = await runFfmpegFramesExtract({
          ffmpegPath: ffmpeg,
          outputDir,
          request: {
            ...parsedReq.payload,
            inputPath: abs,
            durationSec: durationResolved.durationSec
          },
          signal: ac.signal,
          onProgress: pushProgress,
          mapScheduleError
        })
        if (result.ok) {
          host.rememberFfmpegSnapshotDirectory(outputDir)
          const status = M.extractFramesHistorySuccessTemplate.replace(
            '{n}',
            String(result.saved)
          )
          appendProcessingHistoryEntry(paths.userData, {
            kind: 'ffmpegSnapshot',
            startedAt,
            finishedAt: Date.now(),
            inputPath: abs,
            outputPath: result.paths[0] ?? outputDir,
            outcome: 'success',
            status,
            errorHint: null
          })
          return result
        }
        if ('cancelled' in result && result.cancelled) {
          return result
        }
        if ('error' in result && result.error === 'all_frames_failed') {
          return { ok: false, error: M.extractFramesAllFailed }
        }
        return result
      } finally {
        host.setActiveExportAbort(null)
      }
    }
  )
  ipcMain.handle(
    mw.exportOpenOutput,
    async (
      _event,
      raw: unknown
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> => {
      if (!raw || typeof raw !== 'object') {
        return { ok: false, error: host.mainAppStr().exportOpenBadRequest }
      }
      const payload = raw as { path?: unknown; mode?: unknown }
      return host.openExportOutputPath(payload.path, payload.mode)
    }
  )
  ipcMain.handle(
    mw.snapshotFrame,
    async (
      event,
      raw: unknown
    ): Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, error: host.mainAppStr().ipcNoActiveWindow }
      }
      if (!raw || typeof raw !== 'object') {
        return { ok: false, error: host.mainAppStr().ipcInvalidRequest }
      }
      const snapUiLocale =
        parseAppUiLocale((raw as { uiLocale?: unknown }).uiLocale) ??
        host.mainDownloadsUiLocale()
      const M = getMainApplicationStrings(snapUiLocale)
      const inputRaw = (raw as { inputPath?: unknown }).inputPath
      const timeRaw = (raw as { timeSec?: unknown }).timeSec
      if (typeof inputRaw !== 'string' || inputRaw.trim().length === 0) {
        return { ok: false, error: M.exportInputMissing }
      }
      const abs = resolve(normalize(inputRaw.trim()))
      if (!existsSync(abs)) {
        return { ok: false, error: M.exportFileNotFound }
      }
      if (!isGrantedMediaPath(abs)) {
        return { ok: false, error: M.exportNotGrantedPath }
      }
      const timeSec =
        typeof timeRaw === 'number' && Number.isFinite(timeRaw) ? Math.max(0, timeRaw) : 0
      const paths = resolveAppPaths()
      const ffmpeg = resolveEngineExecutablePath(
        paths,
        'ffmpeg',
        host.getSettings().engineExecutablePaths
      )
      if (!ffmpeg) {
        return { ok: false, error: M.exportFfmpegMissing }
      }
      const stem = basename(abs).replace(/\.[^.]+$/, '')
      const snapshotFormat = parseFfmpegSnapshotFormat(host.getSettings().ffmpegSnapshotFormat)
      const pick = await dialog.showSaveDialog(win, {
        title: M.snapshotSaveDialogTitle,
        defaultPath: host.rememberedSnapshotDefaultPath(`${stem}-frame.${snapshotFormat}`),
        filters: [
          { name: M.snapshotFilterPng, extensions: ['png'] },
          { name: M.snapshotFilterJpeg, extensions: ['jpg', 'jpeg'] }
        ]
      })
      if (pick.canceled || !pick.filePath || pick.filePath.trim().length === 0) {
        return { ok: false, cancelled: true }
      }
      const outPath = ensureFfmpegSnapshotExtension(pick.filePath, snapshotFormat)
      const startedAt = Date.now()
      const result = await runFfmpegSnapshotFrame({
        ffmpegPath: ffmpeg,
        inputPath: abs,
        outputPath: outPath,
        timeSec
      })
      if (result.ok) {
        host.rememberExportOutputPath(outPath)
        host.rememberFfmpegSnapshotDirectory(outPath)
        appendProcessingHistoryEntry(paths.userData, {
          kind: 'ffmpegSnapshot',
          startedAt,
          finishedAt: Date.now(),
          inputPath: abs,
          outputPath: outPath,
          outcome: 'success',
          status: processingHistorySnapshotSuccess(snapUiLocale),
          errorHint: null
        })
        return { ok: true, path: outPath }
      }
      appendProcessingHistoryEntry(paths.userData, {
        kind: 'ffmpegSnapshot',
        startedAt,
        finishedAt: Date.now(),
        inputPath: abs,
        outputPath: outPath,
        outcome: 'error',
        status: processingHistorySnapshotFailed(snapUiLocale),
        errorHint: result.error
      })
      return result
    }
  )
}
