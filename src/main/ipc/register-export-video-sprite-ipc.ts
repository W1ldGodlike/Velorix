import { existsSync } from 'fs'
import { basename, normalize, resolve } from 'path'

import { BrowserWindow, dialog, ipcMain } from 'electron'

import { parseAppUiLocale } from '../../shared/app-ui-locale'
import { buildFfmpegVideoSpriteArgv } from '../../shared/ffmpeg-video-sprite-argv'
import type { FfmpegVideoSpriteResult } from '../../shared/ffmpeg-video-sprite-contract'
import { parseFfmpegVideoSpriteRequest } from '../../shared/ffmpeg-video-sprite-request-parse'
import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import { getMainApplicationStrings } from '../../shared/main-application-locale'
import { resolveAppPaths } from '../core/app-paths'
import { resolveEngineExecutablePath } from '../services/engines/engine-service'
import { ensureFfmpegSnapshotExtension } from '../services/ffmpeg/ffmpeg-frame-snapshot-service'
import { resolveFfmpegFramesExtractDurationSec } from '../services/ffmpeg/ffmpeg-frames-extract-resolve-duration'
import { runFfmpegVideoSprite } from '../services/ffmpeg/ffmpeg-video-sprite-runner'
import { probeMediaFile } from '../services/ffprobe/ffprobe-service'
import { isFfmpegExportBatchActive } from '../services/ffmpeg/ffmpeg-export-batch-runner'
import { isGrantedMediaPath } from '../core/media-protocol'
import { appendProcessingHistoryEntry } from '../services/history/processing-history'
import type { ExportBatchIpcContext } from './export-batch-ipc-context'

export function registerExportVideoSpriteIpc(ctx: ExportBatchIpcContext): void {
  const { host } = ctx
  ipcMain.handle(
    mw.generateVideoSprite,
    async (event, raw: unknown): Promise<FfmpegVideoSpriteResult> => {
      const base = host.mainAppStr()
      if (host.getActiveExportAbort() !== null || isFfmpegExportBatchActive()) {
        return { ok: false, error: base.exportAlreadyRunning }
      }
      const exportUiLocale =
        parseAppUiLocale((raw as { uiLocale?: unknown })?.uiLocale) ?? host.mainDownloadsUiLocale()
      const M = getMainApplicationStrings(exportUiLocale)
      const parsedReq = parseFfmpegVideoSpriteRequest(raw)
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
      const format = parsedReq.payload.format
      const stem = basename(abs).replace(/\.[^.]+$/, '')
      const pick = await dialog.showSaveDialog(win, {
        title: M.videoSpriteSaveDialogTitle,
        defaultPath: host.rememberedSnapshotDefaultPath(
          `${stem}-sprite.${format === 'jpg' ? 'jpg' : format}`
        ),
        filters: [
          { name: 'PNG', extensions: ['png'] },
          { name: 'JPEG', extensions: ['jpg', 'jpeg'] },
          { name: 'WebP', extensions: ['webp'] }
        ]
      })
      if (pick.canceled || !pick.filePath || pick.filePath.trim().length === 0) {
        return { ok: false, cancelled: true }
      }
      const outPath = ensureFfmpegSnapshotExtension(pick.filePath, format)
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
      const mapScheduleError = (code: string): string => {
        switch (code) {
          case 'too_many_cells':
            return M.videoSpriteTooManyCells
          case 'invalid_grid':
            return M.videoSpriteInvalidGrid
          case 'duration_too_short':
            return M.videoSpriteDurationTooShort
          default:
            return M.ipcInvalidRequest
        }
      }
      const startedAt = Date.now()
      try {
        const durationResolved = await resolveFfmpegFramesExtractDurationSec({
          durationSecFromClient: parsedReq.payload.durationSec,
          probeMedia: () =>
            probeMediaFile(paths, abs, host.getSettings().engineExecutablePaths, exportUiLocale)
        })
        if (!durationResolved.ok) {
          if (durationResolved.error === 'duration_too_short') {
            return { ok: false, error: M.videoSpriteDurationTooShort }
          }
          return { ok: false, error: durationResolved.error }
        }
        const argvBuilt = buildFfmpegVideoSpriteArgv({
          inputPath: abs,
          outputPath: outPath,
          request: {
            ...parsedReq.payload,
            durationSec: durationResolved.durationSec
          }
        })
        if (!argvBuilt.ok) {
          return { ok: false, error: mapScheduleError(argvBuilt.error) }
        }
        const result = await runFfmpegVideoSprite({
          ffmpegPath: ffmpeg,
          argv: argvBuilt.argv,
          signal: ac.signal
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
            status: M.videoSpriteHistorySuccessTemplate,
            errorHint: null
          })
          return { ok: true, outputPath: outPath }
        }
        if ('cancelled' in result && result.cancelled) {
          return { ok: false, cancelled: true }
        }
        return { ok: false, error: 'error' in result ? result.error : M.ipcInvalidRequest }
      } finally {
        host.setActiveExportAbort(null)
      }
    }
  )
}
