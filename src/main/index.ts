import { existsSync, statSync } from 'fs'
import { join, normalize, resolve } from 'path'
import { BrowserWindow, app, nativeTheme } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import { resolveAppPaths } from './app-paths'
import { buildKnowledgeHelpDirCandidates, resolveKnowledgeHelpDirectory } from './knowledge-service'
import { registerKnowledgeDiagnosticsIpcHandlers } from './ipc/register-knowledge-diagnostics-ipc'
import { registerSettingsIpcHandlers } from './ipc/register-settings-ipc'
import { registerEnginesPreviewIpcHandlers } from './ipc/register-engines-preview-ipc'
import { registerMainUtilitiesIpcHandlers } from './ipc/register-main-utilities-ipc'
import { registerExportBatchIpcHandlers } from './ipc/register-export-batch-ipc'
import { createSettingsIpcPersist, type SettingsIpcPersistApi } from './settings-ipc-persist'
import {
  cancelDownloadsRunner,
  configureDownloadsQueueRunnerHooks,
  isDownloadsRunnerBusy
} from './downloads-queue-runner'
import {
  broadcastDownloadsCliOptionsChanged,
  broadcastDownloadsOutputDirectorySnapshot,
  broadcastDownloadsWindowUiPanelsSnapshot,
  registerDownloadsWindowIpcHandlers,
  syncDownloadsPopoutHtmlToLocale
} from './downloads-window'
import { configureMainDownloadsWindowBoundsBootstrap } from './main-downloads-window-bounds-bootstrap'
import {
  clearRendererLogBucket,
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
  configureInspectorWindowHooks,
  registerInspectorWindowIpcHandlers
} from './inspector-window'
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
import {
  attachProcessErrorHandlers,
  logStartupBanner,
  setProcessErrorReporter
} from './logger-service'
import { resolveOpenMediaDialogDefaultPath } from '../shared/preview-open-dialog-default-path'
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
import { setEnginePathOverridesSnapshot } from './engine-path-sync'
import { registerFluxMediaPrivileges, registerFluxMediaProtocol } from './media-protocol'
import { registerFluxHelpPrivileges, registerFluxHelpProtocol } from './help-assets-protocol'
import type {
  AppSettings,
  AppSettingsView,
  AppTheme,
  ResolvedAppTheme,
  WindowBoundsConfig
} from './settings-store'
import { loadSettings, saveSettings } from './settings-store'
import { createMainWindow } from './main-window'
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
import { boundsFromBrowserWindow } from './window-bounds'
import { syncYtdlpDownloadDirectoryFromSettings } from './ytdlp-download-output'
import { refreshYtdlpRunOptionsSnapshot } from './ytdlp-run-options-sync'
import { mainWindowIpc as mw } from '../shared/ipc-channels'
/**
 * Путь настроек в userData.
 *
 * userData выбирает сам Electron под каждую ОС, поэтому настройки не зависят от папки
 * установки и переживают обновления приложения. Сейчас здесь только тема, но файл
 * задуман как точка расширения для языка, путей движков, hotkeys и session-политик.
 */
function settingsPath(): string {
  return join(app.getPath('userData'), 'settings.json')
}

/**
 * Путь к ТЗ для пункта меню «Справка».
 *
 * В dev читаем файл из корня репозитория, чтобы агент/разработчик видел актуальный документ.
 * В production читаем копию из `extraResources`, потому что исходный корень уже не существует
 * как обычная папка рядом с exe.
 */
function technicalSpecPath(): string {
  const packaged = join(process.resourcesPath, 'FLUXALLOY_TZ.md')
  if (!is.dev && existsSync(packaged)) {
    return packaged
  }
  return join(app.getAppPath(), 'FLUXALLOY_TZ.md')
}

// Main process хранит актуальные настройки в памяти, чтобы меню и IPC отвечали одинаково.
let cachedSettings: AppSettings = { theme: 'dark' }

const mainSettingsAccess = {
  get: (): AppSettings => cachedSettings,
  set: (next: AppSettings): void => {
    cachedSettings = next
  },
  save: (): void => {
    saveSettings(settingsPath(), cachedSettings)
  }
}

let settingsIpcPersist: SettingsIpcPersistApi

let activeExportAbort: AbortController | null = null
/** Обход диалога §4.2 после явного подтверждения «Закрыть и прервать». */
let allowMainWindowClose = false

let mainWindowWebContentsId: number | null = null

/** §7.4 — push `batchExportSnapshot` после enqueue из downloads-runner (до createWindow IPC). */
let broadcastFfmpegExportBatchSnapshot: ((win?: BrowserWindow | null) => void) | null = null

/** Кастомная схема для локального видеопревью; привилегии обязаны зарегистрироваться до `app.whenReady`. */
attachProcessErrorHandlers()
registerFluxMediaPrivileges()
registerFluxHelpPrivileges()

function resolveEffectiveTheme(pref: AppTheme): ResolvedAppTheme {
  if (pref === 'system') {
    return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
  }
  return pref
}

function refreshEnginePathOverridesSnapshot(): void {
  setEnginePathOverridesSnapshot(cachedSettings.engineExecutablePaths)
}

function patchWindowBounds(partial: Partial<WindowBoundsConfig>): void {
  cachedSettings = {
    ...cachedSettings,
    windowBounds: {
      ...cachedSettings.windowBounds,
      ...partial
    }
  }
  saveSettings(settingsPath(), cachedSettings)
}

function attachMainWindowBoundsPersistence(win: BrowserWindow): void {
  let mainWindowBoundsTimer: ReturnType<typeof setTimeout> | null = null

  const flush = (): void => {
    if (win.isDestroyed()) {
      return
    }
    patchWindowBounds({ main: boundsFromBrowserWindow(win) })
  }

  const schedule = (): void => {
    if (mainWindowBoundsTimer !== null) {
      clearTimeout(mainWindowBoundsTimer)
    }
    mainWindowBoundsTimer = setTimeout(() => {
      mainWindowBoundsTimer = null
      flush()
    }, 480)
  }

  win.on('resize', schedule)
  win.on('move', schedule)
  win.on('close', () => {
    if (mainWindowBoundsTimer !== null) {
      clearTimeout(mainWindowBoundsTimer)
      mainWindowBoundsTimer = null
    }
    flush()
  })
}

function persistLastOpenedSource(absolutePath: string | null): void {
  if (absolutePath === null || absolutePath.trim().length === 0) {
    const rest = { ...cachedSettings }
    delete rest.lastOpenedSourcePath
    cachedSettings = rest
  } else {
    cachedSettings = { ...cachedSettings, lastOpenedSourcePath: absolutePath.trim() }
  }
  saveSettings(settingsPath(), cachedSettings)
}

function previewOpenDialogOptsFromSettings(): { defaultPath: string } | undefined {
  const d = resolveOpenMediaDialogDefaultPath(cachedSettings.lastOpenedSourcePath)
  return d !== undefined ? { defaultPath: d } : undefined
}

function batchExportOutputFolderPickOptsFromSettings(): { defaultPath: string } | undefined {
  const raw = cachedSettings.ffmpegExportBatchOutputDirectory
  if (typeof raw === 'string' && raw.trim().length > 0) {
    const p = normalize(raw.trim())
    if (existsSync(p)) {
      try {
        if (statSync(p).isDirectory()) {
          return { defaultPath: p }
        }
      } catch {
        /* fall back to last preview path */
      }
    }
  }
  return previewOpenDialogOptsFromSettings()
}

/** §4.1 — persist раскрытия collapsible FFmpeg / быстрый yt-dlp в главном renderer. */
function revealMainWindowBatchExportPanel(): void {
  if (cachedSettings.mainWindowUiPanels?.batchExport === true) {
    return
  }
  settingsIpcPersist.persistMainWindowUiPanelsMerge({ batchExport: true })
}

function setTheme(pref: AppTheme): AppSettingsView {
  return settingsIpcPersist.persistThemePreference(pref)
}

let mainWindowRef: BrowserWindow | null = null

function createWindow(): void {
  createMainWindow({
    mainDirname: __dirname,
    getSavedMainBounds: () => cachedSettings.windowBounds?.main,
    attachBoundsPersistence: attachMainWindowBoundsPersistence,
    onMainWindowCreated: (win, webContentsId) => {
      mainWindowRef = win
      allowMainWindowClose = false
      mainWindowWebContentsId = webContentsId
    },
    onMainWindowClosed: (win, webContentsId) => {
      if (mainWindowRef?.id === win.id) {
        mainWindowRef = null
      }
      if (mainWindowWebContentsId === webContentsId) {
        mainWindowWebContentsId = null
      }
      clearRendererLogBucket(webContentsId)
    },
    getAllowMainWindowClose: () => allowMainWindowClose,
    setAllowMainWindowClose: (value) => {
      allowMainWindowClose = value
    },
    isExportBusy: () => activeExportAbort !== null,
    isDownloadsBusy: () => isDownloadsRunnerBusy(),
    onQuitAbortConfirmed: () => {
      activeExportAbort?.abort()
      cancelDownloadsRunner()
    },
    mainAppStr,
    buildApplicationMenu
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.fluxalloy')
  setProcessErrorReporter((kind, reason) => {
    void showProcessErrorDialog(kind, reason)
  })
  logStartupBanner()
  pruneDiagnosticsOnStartup()
  cachedSettings = loadSettings(settingsPath())
  configureMainBootstrapIpcHelpers({
    getMainWindowWebContentsId: () => mainWindowWebContentsId,
    getUiLocaleFromSettings: () => cachedSettings.uiLocale
  })
  configureMainDiagnosticsService({
    mainDownloadsUiLocale,
    mainAppStr
  })
  configureMainApplicationMenu({
    getThemePref: () => cachedSettings.theme,
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
  configureMainExportOutputPaths({
    mainAppStr,
    getFfmpegExportDirectory: () => cachedSettings.ffmpegExportDirectory,
    getFfmpegSnapshotDirectory: () => cachedSettings.ffmpegSnapshotDirectory,
    persistFfmpegExportDirectory: (dir) => {
      cachedSettings = { ...cachedSettings, ffmpegExportDirectory: dir }
      saveSettings(settingsPath(), cachedSettings)
    },
    persistFfmpegSnapshotDirectory: (dir) => {
      cachedSettings = { ...cachedSettings, ffmpegSnapshotDirectory: dir }
      saveSettings(settingsPath(), cachedSettings)
    },
    openDownloadedFileInMainHandler
  })
  configureMainYtdlpSettingsPersist({
    getSettings: () => cachedSettings,
    replaceSettings: (settings) => {
      cachedSettings = settings
    },
    persistSettings: () => {
      saveSettings(settingsPath(), cachedSettings)
    },
    mainDownloadsUiLocale,
    onDownloadDirectoryChanged: (directory) => {
      syncYtdlpDownloadDirectoryFromSettings(directory)
      buildApplicationMenu()
      broadcastDownloadsOutputDirectorySnapshot()
    },
    onCliOptionsChanged: () => {
      refreshYtdlpRunOptionsSnapshot(cachedSettings, mainDownloadsUiLocale())
      broadcastDownloadsCliOptionsChanged()
    }
  })
  configureMainFfmpegExportBatchHost({
    isExportBusy: () => activeExportAbort !== null,
    getSettings: () => cachedSettings,
    getEnginePathOverrides: () => cachedSettings.engineExecutablePaths ?? {},
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
    getSettings: () => cachedSettings,
    getEnginePathOverrides: () => cachedSettings.engineExecutablePaths ?? {},
    getMainWindowWebContentsId: () => mainWindowWebContentsId,
    persistLastOpenedSource,
    isExportBusy: () => activeExportAbort !== null,
    setActiveExportAbort: (ac) => {
      activeExportAbort = ac
    },
    rememberExportOutputPath,
    rememberFfmpegExportDirectory
  })
  refreshEnginePathOverridesSnapshot()
  syncYtdlpDownloadDirectoryFromSettings(cachedSettings.ytdlpDownloadDirectory)
  refreshYtdlpRunOptionsSnapshot(cachedSettings, mainDownloadsUiLocale())
  attachFfmpegExportBatchQueuePersist(app)
  hydrateFfmpegExportBatchQueueFromDisk(resolveAppPaths().userData)
  nativeTheme.on('updated', () => {
    if (cachedSettings.theme !== 'system') {
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
    getSavedDownloadsBounds: () => cachedSettings.windowBounds?.downloads,
    persistDownloadsBounds: (r) => {
      patchWindowBounds({ downloads: r })
    },
    mainDownloadsUiLocale,
    getSettings: () => cachedSettings,
    mergeDownloadsWindowUiPanelsPatch: (patch) => {
      const prev = cachedSettings.downloadsWindowUiPanels ?? {}
      cachedSettings = {
        ...cachedSettings,
        downloadsWindowUiPanels: { ...prev, ...patch }
      }
      saveSettings(settingsPath(), cachedSettings)
      broadcastDownloadsWindowUiPanelsSnapshot(cachedSettings.downloadsWindowUiPanels ?? {})
    },
    resolveEffectiveTheme,
    openDownloadedFileInMainHandler
  })
  configureDownloadsQueueRunnerHooks({
    openDownloadedFileInHandler: (absoluteFile) => openDownloadedFileInMainHandler(absoluteFile),
    afterDownloadOpenedInMainHandler: scheduleAutoExportAfterSuccessfulYtdlpOpen,
    afterDownloadEnqueueBatch: scheduleEnqueueBatchAfterDownload
  })
  configureInspectorWindowHooks({
    getSavedInspectorBounds: () => cachedSettings.windowBounds?.inspector,
    persistInspectorBounds: (r) => patchWindowBounds({ inspector: r }),
    getDefaultInspectorMediaPath: (): string | undefined => {
      const saved = cachedSettings.lastOpenedSourcePath
      if (typeof saved !== 'string' || saved.trim().length === 0) {
        return undefined
      }
      const abs = resolve(normalize(saved.trim()))
      return existsSync(abs) ? abs : undefined
    }
  })
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
    getEnginePathOverrides: () => cachedSettings.engineExecutablePaths ?? {},
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
      ...cachedSettings,
      effectiveTheme: resolveEffectiveTheme(cachedSettings.theme)
    }),
    copyCachedSettings: () => ({ ...cachedSettings }),
    isMainWindowUiPanelSender,
    ...settingsIpcPersist
  })
  registerEnginesPreviewIpcHandlers({
    mainAppStr,
    mainDownloadsUiLocale,
    ipcDownloadsUiLocale,
    getEnginePathOverrides: () => cachedSettings.engineExecutablePaths ?? {},
    getLastOpenedSourcePath: () => cachedSettings.lastOpenedSourcePath,
    buildApplicationMenu,
    previewOpenDialogOptsFromSettings,
    persistLastOpenedSource,
    resolveUserPathToPreviewSourceFile,
    ensurePreviewPlayableMedia
  })
  registerMainUtilitiesIpcHandlers({
    mainAppStr,
    mainDownloadsUiLocale,
    getEnginePathOverrides: () => cachedSettings.engineExecutablePaths ?? {},
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
    setActiveExportAbort: (ac) => {
      activeExportAbort = ac
    },
    getSettings: () => cachedSettings,
    bindBatchSnapshotBroadcast: (fn) => {
      broadcastFfmpegExportBatchSnapshot = fn
    },
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
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
