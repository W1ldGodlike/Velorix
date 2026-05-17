import { app } from 'electron'

import { buildKnowledgeHelpDirCandidates, resolveKnowledgeHelpDirectory } from './knowledge-service'
import { registerKnowledgeDiagnosticsIpcHandlers } from './ipc/register-knowledge-diagnostics-ipc'
import { registerSettingsIpcHandlers } from './ipc/register-settings-ipc'
import { registerEnginesPreviewIpcHandlers } from './ipc/register-engines-preview-ipc'
import { registerMainUtilitiesIpcHandlers } from './ipc/register-main-utilities-ipc'
import { registerExportBatchIpcHandlers } from './ipc/register-export-batch-ipc'
import { registerDownloadsWindowIpcHandlers } from './downloads-window'
import { configureMainInspectorWindowBootstrap } from './main-inspector-window-bootstrap'
import { registerInspectorWindowIpcHandlers } from './inspector-window'
import {
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
  getCachedSettings,
  persistLastOpenedSource,
  previewOpenDialogOptsFromSettings,
  resolveEffectiveTheme
} from './main-cached-settings-host'
import { buildApplicationMenu } from './main-application-menu'
import {
  createSupportBundleWithDialog,
  openMainLogForUser
} from './main-diagnostics-service'
import {
  configurePreviewProxyService,
  ensurePreviewPlayableMedia,
  resolveUserPathToPreviewSourceFile
} from './preview-proxy-service'
import { registerFluxMediaProtocol } from './media-protocol'
import { registerFluxHelpProtocol } from './help-assets-protocol'
import {
  isExportOutputOpenMode,
  openExportOutputPath,
  rememberExportOutputPath,
  rememberFfmpegExportDirectory,
  rememberFfmpegSnapshotDirectory,
  rememberedExportDefaultPath,
  rememberedSnapshotDefaultPath
} from './main-export-output-paths'
import { openDownloadedFileInMainHandler } from './main-ytdlp-download-main-handler'
import { launchFfmpegExportBatchRunner } from './main-ffmpeg-export-batch-host'
import {
  activeExportAbort,
  bindFfmpegExportBatchSnapshotBroadcast,
  setActiveExportAbort
} from './main-window-runtime-state'
import { getMainApplicationSettingsIpcPersist } from './main-application-bootstrap-state'

export function registerMainApplicationBootstrapIpc(): void {
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
    ...getMainApplicationSettingsIpcPersist()
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
}
