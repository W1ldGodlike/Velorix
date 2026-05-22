import { existsSync } from 'fs'
import { basename, extname, normalize, resolve } from 'path'

import { BrowserWindow, dialog, ipcMain } from 'electron'

import { grantMediaPath } from '../core/media-protocol'

import {
  isMediaUtilitiesImageInputPath,
  mediaUtilitiesImageOutputExtension,
  parseMediaUtilitiesImageFormatId
} from '../../shared/ffmpeg-image-convert-parse'
import {
  isMediaUtilitiesHeifInputPath,
  mediaUtilitiesSlideshowPickExtensions
} from '../../shared/ffmpeg-heif-decoder-probe'
import {
  parseMediaUtilitiesNoiseDurationSec,
  parseMediaUtilitiesNoiseKind
} from '../../shared/ffmpeg-noise-generate-parse'
import { parseAppUiLocale } from '../../shared/app-ui-locale'
import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import { getMainApplicationStrings } from '../../shared/main-application-locale'
import { parseImageSlideshowRequest } from '../../shared/ffmpeg-image-slideshow-parse'
import type {
  MediaUtilitiesConvertImageRequestPayload,
  MediaUtilitiesConvertImageResult,
  MediaUtilitiesCreateImageSlideshowRequestPayload,
  MediaUtilitiesCreateImageSlideshowResult,
  MediaUtilitiesFileHashRequestPayload,
  MediaUtilitiesFileHashResult,
  MediaUtilitiesGenerateNoiseRequestPayload,
  MediaUtilitiesGenerateNoiseResult,
  MediaUtilitiesImageFormatId,
  MediaUtilitiesIntegrityRequestPayload,
  MediaUtilitiesIntegrityResult,
  MediaUtilitiesPickSlideshowImagesResult,
  MediaUtilitiesRepairRequestPayload,
  MediaUtilitiesRepairResult
} from '../../shared/media-utilities-contract'
import { resolveAppPaths } from '../core/app-paths'
import { resolveEngineExecutablePath } from '../services/engines/engine-service'
import {
  runFfmpegConvertImage,
  runFfmpegGenerateNoise,
  runFfmpegImageSlideshow,
  runFfmpegIntegrityCheck,
  runFfmpegRepairRemux
} from '../services/ffmpeg/ffmpeg-media-utilities-runner'
import { probeFfmpegHeifDecoderAvailable } from '../services/ffmpeg/ffmpeg-heif-decoder-probe-main'
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

function resolveMediaUtilitiesImageSaveFilter(
  M: ReturnType<typeof getMainApplicationStrings>,
  format: MediaUtilitiesImageFormatId
): string {
  if (format === 'jpg') {
    return M.mediaUtilitiesImageSaveFilterJpeg
  }
  if (format === 'webp') {
    return M.mediaUtilitiesImageSaveFilterWebp
  }
  if (format === 'bmp') {
    return M.mediaUtilitiesImageSaveFilterBmp
  }
  if (format === 'tiff') {
    return M.mediaUtilitiesImageSaveFilterTiff
  }
  return M.mediaUtilitiesImageSaveFilterPng
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
      const paths = resolveAppPaths()
      const ffmpegConvert = resolveEngineExecutablePath(
        paths,
        'ffmpeg',
        host.getSettings().engineExecutablePaths
      )
      if (!ffmpegConvert) {
        return { ok: false, error: M.exportFfmpegMissing }
      }
      if (isMediaUtilitiesHeifInputPath(absIn)) {
        const heifOk = await probeFfmpegHeifDecoderAvailable(ffmpegConvert)
        if (!heifOk) {
          return { ok: false, error: M.mediaUtilitiesHeifUnsupported }
        }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, error: M.exportNoActiveWindow }
      }
      const outExt = mediaUtilitiesImageOutputExtension(targetFormat)
      const stem = basename(absIn, extname(absIn))
      const saveFilter = resolveMediaUtilitiesImageSaveFilter(M, targetFormat)
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
      return runFfmpegConvertImage({
        ffmpegPath: ffmpegConvert,
        inputPath: absIn,
        outputPath: pick.filePath,
        targetFormat
      })
    }
  )

  ipcMain.handle(
    mw.mediaUtilitiesPickSlideshowImages,
    async (event): Promise<MediaUtilitiesPickSlideshowImagesResult> => {
      const uiLocale = host.mainDownloadsUiLocale()
      const M = getMainApplicationStrings(uiLocale)
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, error: M.exportNoActiveWindow }
      }
      const pathsPick = resolveAppPaths()
      const ffmpegPick = resolveEngineExecutablePath(
        pathsPick,
        'ffmpeg',
        host.getSettings().engineExecutablePaths
      )
      const heifDecoder = ffmpegPick ? await probeFfmpegHeifDecoderAvailable(ffmpegPick) : false
      const { canceled, filePaths } = await dialog.showOpenDialog(win, {
        title: M.mediaUtilitiesSlideshowPickTitle,
        properties: ['openFile', 'multiSelections'],
        filters: [
          {
            name: M.mediaUtilitiesSlideshowPickFilter,
            extensions: [...mediaUtilitiesSlideshowPickExtensions(heifDecoder)]
          }
        ]
      })
      if (canceled || filePaths.length === 0) {
        return { ok: false, cancelled: true }
      }
      const paths: string[] = []
      for (const raw of filePaths) {
        if (typeof raw !== 'string' || raw.trim().length === 0) {
          continue
        }
        const abs = resolve(normalize(raw.trim()))
        if (!existsSync(abs) || !isMediaUtilitiesImageInputPath(abs)) {
          continue
        }
        grantMediaPath(abs)
        if (isGrantedMediaPath(abs)) {
          paths.push(abs)
        }
      }
      if (paths.length < 2) {
        return { ok: false, error: M.mediaUtilitiesSlideshowTooFewImages }
      }
      return { ok: true, paths }
    }
  )

  ipcMain.handle(
    mw.mediaUtilitiesCreateImageSlideshow,
    async (event, raw: unknown): Promise<MediaUtilitiesCreateImageSlideshowResult> => {
      const uiLocale =
        parseAppUiLocale((raw as MediaUtilitiesCreateImageSlideshowRequestPayload)?.uiLocale) ??
        host.mainDownloadsUiLocale()
      const M = getMainApplicationStrings(uiLocale)
      const parsed = parseImageSlideshowRequest(raw)
      if (!parsed.ok) {
        if (parsed.error === 'too_few_images') {
          return { ok: false, error: M.mediaUtilitiesSlideshowTooFewImages }
        }
        if (parsed.error === 'too_many_images') {
          return { ok: false, error: M.mediaUtilitiesSlideshowTooManyImages }
        }
        if (parsed.error === 'invalid_duration') {
          return { ok: false, error: M.mediaUtilitiesSlideshowInvalidDuration }
        }
        if (parsed.error === 'invalid_transition') {
          return { ok: false, error: M.mediaUtilitiesSlideshowInvalidTransition }
        }
        return { ok: false, error: M.ipcInvalidRequest }
      }
      const pathsCreate = resolveAppPaths()
      const ffmpegCreate = resolveEngineExecutablePath(
        pathsCreate,
        'ffmpeg',
        host.getSettings().engineExecutablePaths
      )
      if (!ffmpegCreate) {
        return { ok: false, error: M.exportFfmpegMissing }
      }
      const heifDecoderCreate = await probeFfmpegHeifDecoderAvailable(ffmpegCreate)
      const absPaths: string[] = []
      for (const p of parsed.payload.imagePaths) {
        const abs = resolve(normalize(p))
        if (!existsSync(abs) || !isGrantedMediaPath(abs) || !isMediaUtilitiesImageInputPath(abs)) {
          return { ok: false, error: M.exportNotGrantedPath }
        }
        if (isMediaUtilitiesHeifInputPath(abs) && !heifDecoderCreate) {
          return { ok: false, error: M.mediaUtilitiesHeifUnsupported }
        }
        absPaths.push(abs)
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, error: M.exportNoActiveWindow }
      }
      const pick = await dialog.showSaveDialog(win, {
        title: M.mediaUtilitiesSlideshowSaveTitle,
        defaultPath: 'slideshow.mp4',
        filters: [{ name: M.mediaUtilitiesSlideshowSaveFilter, extensions: ['mp4'] }]
      })
      if (pick.canceled || !pick.filePath) {
        return { ok: false, cancelled: true }
      }
      const { transition, slideDurationSec } = parsed.payload
      return runFfmpegImageSlideshow({
        ffmpegPath: ffmpegCreate,
        imagePaths: absPaths,
        outputPath: pick.filePath,
        slideDurationSec,
        ...(transition !== undefined ? { transition } : {})
      })
    }
  )
}
