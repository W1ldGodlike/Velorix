import { resolveAppPaths } from './app-paths'
import { pickUniqueAutoExportOutputPath } from './ffmpeg-export-resolve-from-settings'
import { resolveFfmpegExportJobOptionsFromAppSettings } from './ffmpeg-export-resolve-from-settings'
import { runFfmpegExportJob } from './ffmpeg-export-service'
import { resolveEngineExecutablePath } from './engine-service'
import { logInfo } from './logger-service'
import { appendProcessingHistoryEntry } from './processing-history'
import { processingHistoryFfmpegExportSuccess } from '../shared/processing-history-status-locale'
import { grantMediaPath } from './media-protocol'
import { consumePendingWindowsExplorerShellLaunch } from './windows-explorer-shell-launch'
import type { AppUiLocale } from '../shared/app-ui-locale'
import type { AppSettings } from './settings-store'

export async function fulfillPendingWindowsExplorerShellLaunch(deps: {
  openInMainHandler: (absoluteFile: string) => Promise<{ ok: true } | { ok: false; error: string }>
  getSettings: () => AppSettings
  getEnginePathOverrides: () => import('../shared/engine-contract').EnginePathOverrides
  mainUiLocale: () => AppUiLocale
  isExportBusy: () => boolean
  setActiveExportAbort: (ac: AbortController | null) => void
  rememberExportOutputPath: (path: string) => void
  rememberFfmpegExportDirectory: (path: string) => void
}): Promise<void> {
  const pending = consumePendingWindowsExplorerShellLaunch()
  if (!pending) {
    return
  }
  if (!grantMediaPath(pending.filePath)) {
    logInfo('shell', `explorer launch denied path=${pending.filePath}`)
    return
  }
  if (pending.mode === 'open') {
    const res = await deps.openInMainHandler(pending.filePath)
    if (!res.ok) {
      logInfo('shell', `explorer open failed: ${res.error}`)
    }
    return
  }
  if (deps.isExportBusy()) {
    logInfo('shell', 'explorer quick-mp4 skipped export busy')
    return
  }
  const settings = deps.getSettings()
  const loc = deps.mainUiLocale()
  const paths = resolveAppPaths()
  const ffmpeg = resolveEngineExecutablePath(paths, 'ffmpeg', deps.getEnginePathOverrides())
  if (!ffmpeg) {
    logInfo('shell', 'explorer quick-mp4 ffmpeg missing')
    return
  }
  const exportOpts = resolveFfmpegExportJobOptionsFromAppSettings(settings, undefined)
  const outPath = pickUniqueAutoExportOutputPath(
    pending.filePath,
    'mp4',
    '_quick',
    undefined
  )
  const ac = new AbortController()
  deps.setActiveExportAbort(ac)
  const startedAt = Date.now()
  try {
    const result = await runFfmpegExportJob({
      ffmpegPath: ffmpeg,
      inputPath: pending.filePath,
      outputPath: outPath,
      probeDurationSec: null,
      ...exportOpts,
      container: 'mp4',
      lutResourcesRoot: paths.resources,
      signal: ac.signal,
      onProgress: () => {},
      uiLocale: loc
    })
    const finishedAt = Date.now()
    if (result.ok) {
      deps.rememberExportOutputPath(outPath)
      deps.rememberFfmpegExportDirectory(outPath)
      appendProcessingHistoryEntry(paths.userData, {
        kind: 'ffmpegExport',
        startedAt,
        finishedAt,
        inputPath: pending.filePath,
        outputPath: outPath,
        outcome: 'success',
        status: processingHistoryFfmpegExportSuccess(loc),
        errorHint: null,
        exportVideoCodecUsed: result.videoCodecUsed
      })
      logInfo('shell', `explorer quick-mp4 ok out=${outPath}`)
      return
    }
    logInfo('shell', `explorer quick-mp4 failed: ${result.error}`)
  } finally {
    deps.setActiveExportAbort(null)
  }
}
