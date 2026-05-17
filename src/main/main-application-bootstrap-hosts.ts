import { BrowserWindow, app, nativeTheme } from 'electron'
import { electronApp } from '@electron-toolkit/utils'

import { resolveAppPaths } from './app-paths'
import { createSettingsIpcPersist } from './settings-ipc-persist'
import { configureDownloadsQueueRunnerHooks } from './downloads-queue-runner'
import {
  broadcastDownloadsCliOptionsChanged,
  broadcastDownloadsOutputDirectorySnapshot,
  broadcastDownloadsWindowUiPanelsSnapshot,
  syncDownloadsPopoutHtmlToLocale
} from './downloads-window'
import { configureMainDownloadsWindowBoundsBootstrap } from './main-downloads-window-bounds-bootstrap'
import {
  configureMainBootstrapIpcHelpers,
  mainAppStr,
  mainDownloadsUiLocale
} from './main-bootstrap-ipc-helpers'
import {
  configureMainCachedSettingsRevealPanel,
  getCachedSettings,
  loadCachedSettingsFromDisk,
  mainSettingsAccess,
  patchCachedSettings,
  patchWindowBounds,
  persistLastOpenedSource,
  previewOpenDialogOptsFromSettings,
  refreshEnginePathOverridesSnapshot,
  resolveEffectiveTheme,
  revealMainWindowBatchExportPanel,
  saveCachedSettingsToDisk,
  setCachedSettings,
  technicalSpecPath
} from './main-cached-settings-host'
import { buildApplicationMenu, configureMainApplicationMenu } from './main-application-menu'
import {
  configureMainDiagnosticsService,
  createSupportBundleWithDialog,
  openMainLogFile,
  openSessionLogFile,
  pruneDiagnosticsOnStartup,
  showProcessErrorDialog
} from './main-diagnostics-service'
import { logStartupBanner, setProcessErrorReporter } from './logger-service'
import {
  attachFfmpegExportBatchQueuePersist,
  hydrateFfmpegExportBatchQueueFromDisk
} from './ffmpeg-export-batch-persist'
import {
  configureMainYtdlpDownloadMainHandler,
  openDownloadedFileInMainHandler,
  scheduleAutoExportAfterSuccessfulYtdlpOpen
} from './main-ytdlp-download-main-handler'
import {
  configureMainFfmpegExportBatchHost,
  scheduleEnqueueBatchAfterDownload
} from './main-ffmpeg-export-batch-host'
import { configureMainYtdlpSettingsPersist } from './main-ytdlp-settings-persist'
import {
  configureMainExportOutputPaths,
  rememberExportOutputPath,
  rememberFfmpegExportDirectory
} from './main-export-output-paths'
import { syncYtdlpDownloadDirectoryFromSettings } from './ytdlp-download-output'
import { refreshYtdlpRunOptionsSnapshot } from './ytdlp-run-options-sync'
import { mainWindowIpc as mw } from '../shared/ipc-channels'
import {
  activeExportAbort,
  broadcastFfmpegExportBatchSnapshot,
  mainWindowRef,
  mainWindowWebContentsId,
  setActiveExportAbort
} from './main-window-runtime-state'
import {
  getMainApplicationSettingsIpcPersist,
  persistMainApplicationThemePreference,
  setMainApplicationSettingsIpcPersist
} from './main-application-bootstrap-state'

export function bootstrapMainApplicationHosts(): void {
  electronApp.setAppUserModelId('com.fluxalloy')
  setProcessErrorReporter((kind, reason) => {
    void showProcessErrorDialog(kind, reason)
  })
  logStartupBanner()
  pruneDiagnosticsOnStartup()
  loadCachedSettingsFromDisk()
  configureMainBootstrapIpcHelpers({
    getMainWindowWebContentsId: () => mainWindowWebContentsId,
    getUiLocaleFromSettings: () => getCachedSettings().uiLocale
  })
  configureMainDiagnosticsService({
    mainDownloadsUiLocale,
    mainAppStr
  })
  configureMainApplicationMenu({
    getThemePref: () => getCachedSettings().theme,
    getMainWindowRef: () => mainWindowRef,
    mainDownloadsUiLocale,
    mainAppStr,
    previewOpenDialogOptsFromSettings,
    persistLastOpenedSource,
    setTheme: (pref) => {
      void persistMainApplicationThemePreference(pref)
    },
    persistUiLocale: (locale) => {
      void getMainApplicationSettingsIpcPersist().persistUiLocale(locale)
    },
    technicalSpecPath,
    openMainLogFile,
    openSessionLogFile,
    createSupportBundleWithDialog: (win) => {
      void createSupportBundleWithDialog(win)
    }
  })
  setMainApplicationSettingsIpcPersist(
    createSettingsIpcPersist(mainSettingsAccess, {
      resolveEffectiveTheme,
      buildApplicationMenu,
      syncDownloadsPopoutHtmlToLocale,
      refreshEnginePathOverridesSnapshot
    })
  )
  configureMainCachedSettingsRevealPanel({
    getSettingsIpcPersist: getMainApplicationSettingsIpcPersist
  })
  configureMainExportOutputPaths({
    mainAppStr,
    getFfmpegExportDirectory: () => getCachedSettings().ffmpegExportDirectory,
    getFfmpegSnapshotDirectory: () => getCachedSettings().ffmpegSnapshotDirectory,
    persistFfmpegExportDirectory: (dir) => {
      patchCachedSettings((prev) => ({ ...prev, ffmpegExportDirectory: dir }))
    },
    persistFfmpegSnapshotDirectory: (dir) => {
      patchCachedSettings((prev) => ({ ...prev, ffmpegSnapshotDirectory: dir }))
    },
    openDownloadedFileInMainHandler
  })
  configureMainYtdlpSettingsPersist({
    getSettings: getCachedSettings,
    replaceSettings: setCachedSettings,
    persistSettings: saveCachedSettingsToDisk,
    mainDownloadsUiLocale,
    onDownloadDirectoryChanged: (directory) => {
      syncYtdlpDownloadDirectoryFromSettings(directory)
      buildApplicationMenu()
      broadcastDownloadsOutputDirectorySnapshot()
    },
    onCliOptionsChanged: () => {
      refreshYtdlpRunOptionsSnapshot(getCachedSettings(), mainDownloadsUiLocale())
      broadcastDownloadsCliOptionsChanged()
    }
  })
  configureMainFfmpegExportBatchHost({
    isExportBusy: () => activeExportAbort !== null,
    getSettings: getCachedSettings,
    getEnginePathOverrides: () => getCachedSettings().engineExecutablePaths ?? {},
    mainDownloadsUiLocale,
    rememberExportOutputPath,
    rememberFfmpegExportDirectory,
    broadcastBatchSnapshot: (win) => {
      broadcastFfmpegExportBatchSnapshot?.(win)
    },
    revealMainWindowBatchExportPanel
  })
  configureMainYtdlpDownloadMainHandler({
    mainAppStr,
    mainDownloadsUiLocale,
    getSettings: getCachedSettings,
    getEnginePathOverrides: () => getCachedSettings().engineExecutablePaths ?? {},
    getMainWindowWebContentsId: () => mainWindowWebContentsId,
    persistLastOpenedSource,
    isExportBusy: () => activeExportAbort !== null,
    setActiveExportAbort,
    rememberExportOutputPath,
    rememberFfmpegExportDirectory
  })
  refreshEnginePathOverridesSnapshot()
  syncYtdlpDownloadDirectoryFromSettings(getCachedSettings().ytdlpDownloadDirectory)
  refreshYtdlpRunOptionsSnapshot(getCachedSettings(), mainDownloadsUiLocale())
  attachFfmpegExportBatchQueuePersist(app)
  hydrateFfmpegExportBatchQueueFromDisk(resolveAppPaths().userData)
  nativeTheme.on('updated', () => {
    if (getCachedSettings().theme !== 'system') {
      return
    }
    const eff = resolveEffectiveTheme('system')
    for (const w of BrowserWindow.getAllWindows()) {
      if (!w.isDestroyed()) {
        w.webContents.send(mw.themeChanged, eff)
      }
    }
    buildApplicationMenu()
  })
  configureMainDownloadsWindowBoundsBootstrap({
    getMainWindowWebContentsId: () => mainWindowWebContentsId,
    getSavedDownloadsBounds: () => getCachedSettings().windowBounds?.downloads,
    persistDownloadsBounds: (r) => {
      patchWindowBounds({ downloads: r })
    },
    mainDownloadsUiLocale,
    getSettings: getCachedSettings,
    mergeDownloadsWindowUiPanelsPatch: (patch) => {
      patchCachedSettings((prev) => {
        const prevPanels = prev.downloadsWindowUiPanels ?? {}
        return {
          ...prev,
          downloadsWindowUiPanels: { ...prevPanels, ...patch }
        }
      })
      broadcastDownloadsWindowUiPanelsSnapshot(getCachedSettings().downloadsWindowUiPanels ?? {})
    },
    resolveEffectiveTheme,
    openDownloadedFileInMainHandler
  })
  configureDownloadsQueueRunnerHooks({
    openDownloadedFileInHandler: (absoluteFile) => openDownloadedFileInMainHandler(absoluteFile),
    afterDownloadOpenedInMainHandler: scheduleAutoExportAfterSuccessfulYtdlpOpen,
    afterDownloadEnqueueBatch: scheduleEnqueueBatchAfterDownload
  })
}
