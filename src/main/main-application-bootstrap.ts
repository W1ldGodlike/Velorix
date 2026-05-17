import { BrowserWindow, app, nativeTheme } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'

import { resolveAppPaths } from './app-paths'
import { buildKnowledgeHelpDirCandidates, resolveKnowledgeHelpDirectory } from './knowledge-service'
import { registerKnowledgeDiagnosticsIpcHandlers } from './ipc/register-knowledge-diagnostics-ipc'
import { registerSettingsIpcHandlers } from './ipc/register-settings-ipc'
import { registerEnginesPreviewIpcHandlers } from './ipc/register-engines-preview-ipc'
import { registerMainUtilitiesIpcHandlers } from './ipc/register-main-utilities-ipc'
import { registerExportBatchIpcHandlers } from './ipc/register-export-batch-ipc'
import { createSettingsIpcPersist, type SettingsIpcPersistApi } from './settings-ipc-persist'
import { configureDownloadsQueueRunnerHooks } from './downloads-queue-runner'
import {
  broadcastDownloadsCliOptionsChanged,
  broadcastDownloadsOutputDirectorySnapshot,
  broadcastDownloadsWindowUiPanelsSnapshot,
  registerDownloadsWindowIpcHandlers,
  syncDownloadsPopoutHtmlToLocale
} from './downloads-window'
import { configureMainDownloadsWindowBoundsBootstrap } from './main-downloads-window-bounds-bootstrap'
import {
  configureMainBootstrapIpcHelpers,
  ipcDownloadsUiLocale,
  isMainWindowUiPanelSender,
  mainAppStr,
  mainDownloadsUiLocale,
  parseDownloadsOpenRequest,
  parseSaveTextDialogPayload,
  registerMainRendererLogIpcHandler
} from './main-bootstrap-ipc-helpers'
import {
  batchExportOutputFolderPickOptsFromSettings,
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
import { configureMainInspectorWindowBootstrap } from './main-inspector-window-bootstrap'
import { registerInspectorWindowIpcHandlers } from './inspector-window'
import { buildApplicationMenu, configureMainApplicationMenu } from './main-application-menu'
import {
  configureMainDiagnosticsService,
  createSupportBundleWithDialog,
  openMainLogFile,
  openMainLogForUser,
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
  configurePreviewProxyService,
  ensurePreviewPlayableMedia,
  resolveUserPathToPreviewSourceFile
} from './preview-proxy-service'
import {
  configureMainYtdlpDownloadMainHandler,
  openDownloadedFileInMainHandler,
  scheduleAutoExportAfterSuccessfulYtdlpOpen
} from './main-ytdlp-download-main-handler'
import {
  configureMainFfmpegExportBatchHost,
  launchFfmpegExportBatchRunner,
  scheduleEnqueueBatchAfterDownload
} from './main-ffmpeg-export-batch-host'
import { configureMainYtdlpSettingsPersist } from './main-ytdlp-settings-persist'
import { registerFluxMediaProtocol } from './media-protocol'
import { registerFluxHelpProtocol } from './help-assets-protocol'
import type { AppSettingsView, AppTheme } from './settings-store'
import {
  configureMainExportOutputPaths,
  isExportOutputOpenMode,
  openExportOutputPath,
  rememberExportOutputPath,
  rememberFfmpegExportDirectory,
  rememberFfmpegSnapshotDirectory,
  rememberedExportDefaultPath,
  rememberedSnapshotDefaultPath
} from './main-export-output-paths'
import { syncYtdlpDownloadDirectoryFromSettings } from './ytdlp-download-output'
import { refreshYtdlpRunOptionsSnapshot } from './ytdlp-run-options-sync'
import { mainWindowIpc as mw } from '../shared/ipc-channels'
import {
  activeExportAbort,
  bindFfmpegExportBatchSnapshotBroadcast,
  broadcastFfmpegExportBatchSnapshot,
  createMainApplicationWindow,
  mainWindowRef,
  mainWindowWebContentsId,
  setActiveExportAbort
} from './main-window-runtime-state'

let settingsIpcPersist: SettingsIpcPersistApi

function setTheme(pref: AppTheme): AppSettingsView {
  return settingsIpcPersist.persistThemePreference(pref)
}

export function runMainApplicationBootstrap(): void {
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
      void setTheme(pref)
    },
    persistUiLocale: (locale) => {
      void settingsIpcPersist.persistUiLocale(locale)
    },
    technicalSpecPath,
    openMainLogFile,
    openSessionLogFile,
    createSupportBundleWithDialog: (win) => {
      void createSupportBundleWithDialog(win)
    }
  })
  settingsIpcPersist = createSettingsIpcPersist(mainSettingsAccess, {
    resolveEffectiveTheme,
    buildApplicationMenu,
    syncDownloadsPopoutHtmlToLocale,
    refreshEnginePathOverridesSnapshot
  })
  configureMainCachedSettingsRevealPanel({
    getSettingsIpcPersist: () => settingsIpcPersist
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
  configureMainInspectorWindowBootstrap()
  registerFluxMediaProtocol()
  registerFluxHelpProtocol(() =>
    resolveKnowledgeHelpDirectory(
      buildKnowledgeHelpDirCandidates({
        cwd: process.cwd(),
        appPath: app.getAppPath(),
        resourcesPath: process.resourcesPath,
        isPackaged: app.isPackaged
      })
    )
  )
  registerDownloadsWindowIpcHandlers()
  registerInspectorWindowIpcHandlers()
  configurePreviewProxyService({
    getEnginePathOverrides: () => getCachedSettings().engineExecutablePaths ?? {},
    getUiLocale: mainDownloadsUiLocale,
    getMainAppStrings: mainAppStr
  })
  registerKnowledgeDiagnosticsIpcHandlers({
    mainDownloadsUiLocale,
    mainAppStr,
    openMainLogForUser,
    createSupportBundleWithDialog
  })
  registerSettingsIpcHandlers({
    getSettingsView: () => ({
      ...getCachedSettings(),
      effectiveTheme: resolveEffectiveTheme(getCachedSettings().theme)
    }),
    copyCachedSettings: () => ({ ...getCachedSettings() }),
    isMainWindowUiPanelSender,
    ...settingsIpcPersist
  })
  registerEnginesPreviewIpcHandlers({
    mainAppStr,
    mainDownloadsUiLocale,
    ipcDownloadsUiLocale,
    getEnginePathOverrides: () => getCachedSettings().engineExecutablePaths ?? {},
    getLastOpenedSourcePath: () => getCachedSettings().lastOpenedSourcePath,
    buildApplicationMenu,
    previewOpenDialogOptsFromSettings,
    persistLastOpenedSource,
    resolveUserPathToPreviewSourceFile,
    ensurePreviewPlayableMedia
  })
  registerMainUtilitiesIpcHandlers({
    mainAppStr,
    mainDownloadsUiLocale,
    getEnginePathOverrides: () => getCachedSettings().engineExecutablePaths ?? {},
    parseSaveTextDialogPayload,
    isExportOutputOpenMode,
    rememberExportOutputPath,
    openExportOutputPath,
    openDownloadedFileInMainHandler
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('browser-window-focus', () => {
    buildApplicationMenu()
  })

  registerExportBatchIpcHandlers({
    getActiveExportAbort: () => activeExportAbort,
    setActiveExportAbort,
    getSettings: getCachedSettings,
    bindBatchSnapshotBroadcast: bindFfmpegExportBatchSnapshotBroadcast,
    launchFfmpegExportBatchRunner,
    mainAppStr,
    mainDownloadsUiLocale,
    previewOpenDialogOptsFromSettings,
    batchExportOutputFolderPickOptsFromSettings,
    rememberedExportDefaultPath,
    rememberExportOutputPath,
    rememberFfmpegExportDirectory,
    rememberedSnapshotDefaultPath,
    rememberFfmpegSnapshotDirectory,
    openExportOutputPath,
    openDownloadedFileInMainHandler,
    parseDownloadsOpenRequest
  })

  registerMainRendererLogIpcHandler()

  buildApplicationMenu()
  createMainApplicationWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainApplicationWindow()
    }
  })
}
