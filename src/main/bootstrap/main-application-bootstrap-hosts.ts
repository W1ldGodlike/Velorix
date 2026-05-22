import { BrowserWindow, app, nativeTheme } from 'electron'
import { electronApp } from '@electron-toolkit/utils'

import { resolveAppPaths } from '../core/app-paths'
import { createSettingsIpcPersist } from '../services/settings/settings-ipc-persist'
import { configureDownloadsQueueRunnerHooks } from '../services/downloads/downloads-queue-runner'
import {
  broadcastDownloadsCliOptionsChanged,
  broadcastDownloadsOutputDirectorySnapshot,
  broadcastDownloadsWindowUiPanelsSnapshot,
  syncDownloadsPopoutHtmlToLocale
} from '../windows/downloads-window'
import { configureMainDownloadsWindowBoundsBootstrap } from '../windows/main-downloads-window-bounds-bootstrap'
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
} from '../services/settings/main-cached-settings-host'
import { buildApplicationMenu, configureMainApplicationMenu } from '../menu/main-application-menu'
import {
  configureMainDiagnosticsService,
  createSupportBundleWithDialog,
  openMainLogFile,
  openSessionLogFile,
  pruneDiagnosticsOnStartup,
  showProcessErrorDialog
} from '../services/diagnostics/main-diagnostics-service'
import { logStartupBanner, setProcessErrorReporter } from '../core/logger-service'
import {
  attachFfmpegExportBatchQueuePersist,
  hydrateFfmpegExportBatchQueueFromDisk
} from '../services/ffmpeg/ffmpeg-export-batch-persist'
import {
  configureMainYtdlpDownloadMainHandler,
  openDownloadedFileInMainHandler,
  scheduleAutoExportAfterSuccessfulYtdlpOpen
} from '../services/ytdlp/main-ytdlp-download-main-handler'
import {
  configureMainFfmpegExportBatchHost,
  scheduleEnqueueBatchAfterDownload
} from '../services/ffmpeg/main-ffmpeg-export-batch-host'
import { configureMainYtdlpSettingsPersist } from '../services/settings/main-ytdlp-settings-persist'
import { configureWorkflowScenarioRunnerHost } from '../services/workflow/workflow-scenario-runner-host'
import { startWorkflowWatchFolderRunner } from '../services/workflow/workflow-watch-folder-runner'
import { listScheduledTaskDocuments } from '../services/workflow/workflow-registry-service'
import { resyncAllScheduledTaskOsSchedulers } from '../services/platform/scheduled-task-os-sync'
import { syncWindowsExplorerContextMenuEnabled } from '../services/platform/windows-explorer-context-menu-sync'
import { syncWindowsFileAssociationEnabled } from '../services/platform/windows-file-association-sync'
import { getMainApplicationStrings } from '../../shared/main-runtime-locale'
import {
  configureMainExportOutputPaths,
  rememberExportOutputPath,
  rememberFfmpegExportDirectory
} from '../core/main-export-output-paths'
import { syncYtdlpDownloadDirectoryFromSettings } from '../services/ytdlp/ytdlp-download-output'
import { refreshYtdlpRunOptionsSnapshot } from '../services/ytdlp/ytdlp-run-options-sync'
import {
  configurePresetsExportService,
  exportUserPresetsWithDialog,
  importUserPresetsWithDialog
} from '../services/presets/presets-export-service'
import {
  configureSettingsBackupService,
  exportSettingsBackupWithDialog,
  importSettingsBackupWithDialog
} from '../services/settings/settings-backup-service'
import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import {
  activeExportAbort,
  broadcastFfmpegExportBatchSnapshot,
  mainWindowRef,
  mainWindowWebContentsId,
  setActiveExportAbort
} from '../windows/main-window-runtime-state'
import {
  getMainApplicationSettingsIpcPersist,
  persistMainApplicationThemePreference,
  setMainApplicationSettingsIpcPersist
} from './main-application-bootstrap-state'

export function bootstrapMainApplicationHosts(): void {
  electronApp.setAppUserModelId('com.VELORIX')
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
  configurePresetsExportService({
    getSettings: getCachedSettings,
    replaceSettings: setCachedSettings,
    saveSettings: saveCachedSettingsToDisk,
    mainAppStr: () => {
      const M = mainAppStr()
      return {
        presetsExportTitle: M.presetsExportTitle,
        presetsExportFilter: M.presetsExportFilter,
        presetsImportTitle: M.presetsImportTitle,
        presetsImportFilter: M.presetsImportFilter,
        presetsExportOkTitle: M.presetsExportOkTitle,
        presetsExportOkMessage: M.presetsExportOkMessage,
        presetsImportOkTitle: M.presetsImportOkTitle,
        presetsImportOkMessage: M.presetsImportOkMessage,
        presetsParseErrorTitle: M.presetsParseErrorTitle,
        presetsParseErrorMessage: M.presetsParseErrorMessage,
        presetsImportConfirmTitle: M.presetsImportConfirmTitle,
        presetsImportConfirmMessage: M.presetsImportConfirmMessage,
        presetsImportConfirm: M.presetsImportConfirm,
        presetsImportCancel: M.presetsImportCancel,
        presetsCloneBuiltinCopySuffix: M.presetsCloneBuiltinCopySuffix,
        exportNoActiveWindow: M.exportNoActiveWindow,
        ipcInvalidRequest: M.ipcInvalidRequest,
        presetsExportUserMax: M.presetsExportUserMax
      }
    }
  })
  configureSettingsBackupService({
    getSettings: getCachedSettings,
    replaceSettings: setCachedSettings,
    saveSettings: saveCachedSettingsToDisk,
    resolveEffectiveTheme,
    buildApplicationMenu,
    refreshEnginePathOverridesSnapshot,
    refreshYtdlpFromSettings: () => {
      const settings = getCachedSettings()
      refreshYtdlpRunOptionsSnapshot(settings, mainDownloadsUiLocale())
      broadcastDownloadsCliOptionsChanged()
      syncYtdlpDownloadDirectoryFromSettings(settings.ytdlpDownloadDirectory)
      broadcastDownloadsOutputDirectorySnapshot()
    },
    syncDownloadsPopoutHtmlToLocale,
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
    },
    exportSettingsBackup: (win) => {
      void exportSettingsBackupWithDialog(win)
    },
    importSettingsBackup: (win) => {
      void importSettingsBackupWithDialog(win)
    },
    exportPresetsBackup: (win) => {
      void exportUserPresetsWithDialog(win)
    },
    importPresetsBackup: (win) => {
      void importUserPresetsWithDialog(win)
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
  configureWorkflowScenarioRunnerHost({
    isExportBusy: () => activeExportAbort !== null,
    getSettings: getCachedSettings,
    getEnginePathOverrides: () => getCachedSettings().engineExecutablePaths ?? {},
    mainUiLocale: () => getCachedSettings().uiLocale ?? 'ru',
    rememberExportOutputPath,
    rememberFfmpegExportDirectory
  })
  startWorkflowWatchFolderRunner()
  void resyncAllScheduledTaskOsSchedulers(listScheduledTaskDocuments())
  const shellLoc = getCachedSettings().uiLocale ?? 'ru'
  const shellM = getMainApplicationStrings(shellLoc)
  void syncWindowsExplorerContextMenuEnabled(
    getCachedSettings().windowsExplorerContextMenu === true,
    {
      open: shellM.windowsExplorerContextMenuOpen,
      quickMp4: shellM.windowsExplorerContextMenuQuickMp4
    }
  )
  void syncWindowsFileAssociationEnabled(
    getCachedSettings().windowsOpenWithVelorix === true,
    shellM.windowsFileAssociationTypeName
  )
}
