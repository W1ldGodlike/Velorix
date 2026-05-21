import { existsSync } from 'fs'
import { basename, extname, normalize, resolve } from 'path'

import { BrowserWindow, dialog, ipcMain } from 'electron'

import {
  isMediaUtilitiesImageInputPath,
  mediaUtilitiesImageOutputExtension,
  parseMediaUtilitiesImageFormatId
} from '../../shared/ffmpeg-image-convert-parse'
import {
  parseMediaUtilitiesNoiseDurationSec,
  parseMediaUtilitiesNoiseKind
} from '../../shared/ffmpeg-noise-generate-parse'
import { parseAppUiLocale } from '../../shared/app-ui-locale'
import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import { getMainApplicationStrings } from '../../shared/main-application-locale'
import type {
  MediaUtilitiesConvertImageRequestPayload,
  MediaUtilitiesConvertImageResult,
  MediaUtilitiesFileHashRequestPayload,
  MediaUtilitiesFileHashResult,
  MediaUtilitiesGenerateNoiseRequestPayload,
  MediaUtilitiesGenerateNoiseResult,
  MediaUtilitiesIntegrityRequestPayload,
  MediaUtilitiesIntegrityResult,
  MediaUtilitiesRepairRequestPayload,
  MediaUtilitiesRepairResult
} from '../../shared/media-utilities-contract'
import { resolveAppPaths } from '../core/app-paths'
import { resolveEngineExecutablePath } from '../services/engines/engine-service'
import {
  runFfmpegConvertImage,
  runFfmpegGenerateNoise,
  runFfmpegIntegrityCheck,
  runFfmpegRepairRemux
} from '../services/ffmpeg/ffmpeg-media-utilities-runner'
import { logInfo } from '../core/logger-service'
import { computeMediaFileHashes } from '../services/media/media-file-hash-runner'
import { isGrantedMediaPath } from '../core/media-protocol'
import type { ExportBatchIpcHost } from './export-batch-ipc-host'

let ipcRegistered = false

function parseInputPath(raw: unknown): string | null {
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return null
  }
  return raw.trim()
}

export function registerMediaUtilitiesIpcHandlers(host: ExportBatchIpcHost): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  ipcMain.handle(
    mw.mediaUtilitiesRepairRemux,
    async (event, raw: unknown): Promise<MediaUtilitiesRepairResult> => {
      const uiLocale =
        parseAppUiLocale((raw as MediaUtilitiesRepairRequestPayload)?.uiLocale) ??
        host.mainDownloadsUiLocale()
      const M = getMainApplicationStrings(uiLocale)
      const inputPath = parseInputPath((raw as MediaUtilitiesRepairRequestPayload)?.inputPath)
      if (inputPath === null) {
        return { ok: false, error: M.ipcInvalidRequest }
      }
      const absIn = resolve(normalize(inputPath))
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
        title: M.mediaUtilitiesRepairSaveTitle,
        defaultPath: `${stem}_fixed${extname(absIn) || '.mp4'}`,
        filters: [
          { name: M.mediaUtilitiesRepairSaveFilter, extensions: ['mp4', 'mkv', 'mov', 'webm'] }
        ]
      })
      if (pick.canceled || !pick.filePath) {
        return { ok: false, cancelled: true }
      }
      const paths = resolveAppPaths()
      const ffmpeg = resolveEngineExecutablePath(
        paths,
        'ffmpeg',
        host.getSettings().engineExecutablePaths
      )
      if (!ffmpeg) {
        return { ok: false, error: M.exportFfmpegMissing }
      }
      return runFfmpegRepairRemux({
        ffmpegPath: ffmpeg,
        inputPath: absIn,
        outputPath: pick.filePath
      })
    }
  )

  ipcMain.handle(
    mw.mediaUtilitiesCheckIntegrity,
    async (_event, raw: unknown): Promise<MediaUtilitiesIntegrityResult> => {
      const uiLocale =
        parseAppUiLocale((raw as MediaUtilitiesIntegrityRequestPayload)?.uiLocale) ??
        host.mainDownloadsUiLocale()
      const M = getMainApplicationStrings(uiLocale)
      const inputPath = parseInputPath((raw as MediaUtilitiesIntegrityRequestPayload)?.inputPath)
      if (inputPath === null) {
        return { ok: false, error: M.ipcInvalidRequest }
      }
      const absIn = resolve(normalize(inputPath))
      if (!existsSync(absIn)) {
        return { ok: false, error: M.exportFileNotFound }
      }
      if (!isGrantedMediaPath(absIn)) {
        return { ok: false, error: M.exportNotGrantedPath }
      }
      const paths = resolveAppPaths()
      const ffmpeg = resolveEngineExecutablePath(
        paths,
        'ffmpeg',
        host.getSettings().engineExecutablePaths
      )
      if (!ffmpeg) {
        return { ok: false, error: M.exportFfmpegMissing }
      }
      return runFfmpegIntegrityCheck({ ffmpegPath: ffmpeg, inputPath: absIn })
    }
  )

  ipcMain.handle(
    mw.mediaUtilitiesGenerateNoise,
    async (event, raw: unknown): Promise<MediaUtilitiesGenerateNoiseResult> => {
      const payload = raw as MediaUtilitiesGenerateNoiseRequestPayload
      const uiLocale = parseAppUiLocale(payload?.uiLocale) ?? host.mainDownloadsUiLocale()
      const M = getMainApplicationStrings(uiLocale)
      const kind = parseMediaUtilitiesNoiseKind(payload?.kind)
      const durationSec = parseMediaUtilitiesNoiseDurationSec(payload?.durationSec)
      if (kind === null || durationSec === null) {
        return { ok: false, error: M.ipcInvalidRequest }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, error: M.exportNoActiveWindow }
      }
      const pick = await dialog.showSaveDialog(win, {
        title: M.mediaUtilitiesNoiseSaveTitle,
        defaultPath: `fluxalloy_${kind}_${durationSec}s.wav`,
        filters: [{ name: M.mediaUtilitiesNoiseSaveFilter, extensions: ['wav'] }]
      })
      if (pick.canceled || !pick.filePath) {
        return { ok: false, cancelled: true }
      }
      const paths = resolveAppPaths()
      const ffmpeg = resolveEngineExecutablePath(
        paths,
        'ffmpeg',
        host.getSettings().engineExecutablePaths
      )
      if (!ffmpeg) {
        return { ok: false, error: M.exportFfmpegMissing }
      }
      return runFfmpegGenerateNoise({
        ffmpegPath: ffmpeg,
        kind,
        durationSec,
        outputPath: pick.filePath
      })
    }
  )

  ipcMain.handle(
    mw.mediaUtilitiesComputeFileHash,
    async (_event, raw: unknown): Promise<MediaUtilitiesFileHashResult> => {
      const uiLocale =
        parseAppUiLocale((raw as MediaUtilitiesFileHashRequestPayload)?.uiLocale) ??
        host.mainDownloadsUiLocale()
      const M = getMainApplicationStrings(uiLocale)
      const inputPath = parseInputPath((raw as MediaUtilitiesFileHashRequestPayload)?.inputPath)
      if (inputPath === null) {
        return { ok: false, error: M.ipcInvalidRequest }
      }
      const absIn = resolve(normalize(inputPath))
      if (!existsSync(absIn)) {
        return { ok: false, error: M.exportFileNotFound }
      }
      if (!isGrantedMediaPath(absIn)) {
        return { ok: false, error: M.exportNotGrantedPath }
      }
      try {
        const { md5, sha256 } = await computeMediaFileHashes(absIn)
        const fileName = basename(absIn)
        logInfo('media-utilities', `file hash ${fileName}: md5=${md5} sha256=${sha256}`)
        return { ok: true, fileName, md5, sha256 }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        return { ok: false, error: message }
      }
    }
  )

  ipcMain.handle(
    mw.mediaUtilitiesConvertImage,
    async (event, raw: unknown): Promise<MediaUtilitiesConvertImageResult> => {
      const payload = raw as MediaUtilitiesConvertImageRequestPayload
      const uiLocale = parseAppUiLocale(payload?.uiLocale) ?? host.mainDownloadsUiLocale()
      const M = getMainApplicationStrings(uiLocale)
      const inputPath = parseInputPath(payload?.inputPath)
      const targetFormat = parseMediaUtilitiesImageFormatId(payload?.targetFormat)
      if (inputPath === null || targetFormat === null) {
        return { ok: false, error: M.ipcInvalidRequest }
      }
      const absIn = resolve(normalize(inputPath))
      if (!existsSync(absIn)) {
        return { ok: false, error: M.exportFileNotFound }
      }
      if (!isGrantedMediaPath(absIn)) {
        return { ok: false, error: M.exportNotGrantedPath }
      }
      if (!isMediaUtilitiesImageInputPath(absIn)) {
        return { ok: false, error: M.mediaUtilitiesImageNotImage }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, error: M.exportNoActiveWindow }
      }
      const outExt = mediaUtilitiesImageOutputExtension(targetFormat)
      const stem = basename(absIn, extname(absIn))
      const saveFilter =
        targetFormat === 'jpg'
          ? M.mediaUtilitiesImageSaveFilterJpeg
          : targetFormat === 'webp'
            ? M.mediaUtilitiesImageSaveFilterWebp
            : M.mediaUtilitiesImageSaveFilterPng
      const pick = await dialog.showSaveDialog(win, {
        title: M.mediaUtilitiesImageSaveTitle,
        defaultPath: `${stem}_converted${outExt}`,
        filters: [
          {
            name: saveFilter,
            extensions: [outExt.replace(/^\./, '')]
          }
        ]
      })
      if (pick.canceled || !pick.filePath) {
        return { ok: false, cancelled: true }
      }
      const paths = resolveAppPaths()
      const ffmpeg = resolveEngineExecutablePath(
        paths,
        'ffmpeg',
        host.getSettings().engineExecutablePaths
      )
      if (!ffmpeg) {
        return { ok: false, error: M.exportFfmpegMissing }
      }
      return runFfmpegConvertImage({
        ffmpegPath: ffmpeg,
        inputPath: absIn,
        outputPath: pick.filePath,
        targetFormat
      })
    }
  )
}
