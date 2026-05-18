import { activeExportAbort, mainWindowRef, setActiveExportAbort } from './main-window-runtime-state'
import { getCachedSettings } from './main-cached-settings-host'
import { rememberExportOutputPath, rememberFfmpegExportDirectory } from './main-export-output-paths'
import { openDownloadedFileInMainHandler } from './main-ytdlp-download-main-handler'
import { peekPendingWindowsExplorerShellLaunch } from './windows-explorer-shell-launch'
import { fulfillPendingWindowsExplorerShellLaunch } from './windows-explorer-shell-fulfill'

/** Повторный запуск с shell argv — открыть/экспорт в уже работающем экземпляре. */
export async function tryFulfillPendingWindowsExplorerShellLaunch(): Promise<void> {
  if (!peekPendingWindowsExplorerShellLaunch()) {
    return
  }
  const win = mainWindowRef
  if (!win || win.isDestroyed()) {
    return
  }
  win.show()
  win.focus()
  await fulfillPendingWindowsExplorerShellLaunch({
    openInMainHandler: openDownloadedFileInMainHandler,
    getSettings: getCachedSettings,
    getEnginePathOverrides: () => getCachedSettings().engineExecutablePaths ?? {},
    mainUiLocale: () => getCachedSettings().uiLocale ?? 'ru',
    isExportBusy: () => activeExportAbort !== null,
    setActiveExportAbort,
    rememberExportOutputPath,
    rememberFfmpegExportDirectory
  })
}
