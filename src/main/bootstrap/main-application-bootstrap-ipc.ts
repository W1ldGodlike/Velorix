import { app } from 'electron'

import {
  buildKnowledgeHelpDirCandidates,
  resolveKnowledgeHelpDirectory
} from '../services/knowledge/knowledge-service'
import { registerKnowledgeDiagnosticsIpcHandlers } from '../ipc/register-knowledge-diagnostics-ipc'
import { registerSettingsIpcHandlers } from '../ipc/register-settings-ipc'
import { registerWindowsShellContextMenuIpc } from '../ipc/register-windows-shell-context-menu-ipc'
import { registerEnginesPreviewIpcHandlers } from '../ipc/register-engines-preview-ipc'
import { registerMainUtilitiesIpcHandlers } from '../ipc/register-main-utilities-ipc'
import { registerWorkflowIpcHandlers } from '../ipc/register-workflow-ipc'
import { registerExportBatchIpcHandlers } from '../ipc/register-export-batch-ipc'
import { registerDownloadsWindowIpcHandlers } from '../windows/downloads-window'
import { registerExternalFilterScriptIpcHandlers } from '../ipc/register-external-filter-script-ipc'
import { configureMainInspectorWindowBootstrap } from '../windows/main-inspector-window-bootstrap'
import { registerInspectorWindowIpcHandlers } from '../windows/inspector-window'
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
  patchCachedSettings,
  persistLastOpenedSource,
  previewOpenDialogOptsFromSettings,
  resolveEffectiveTheme,
  saveCachedSettingsToDisk
} from '../services/settings/main-cached-settings-host'
import { buildApplicationMenu } from '../menu/main-application-menu'
import {
  createSupportBundleWithDialog,
  openMainLogForUser
} from '../services/diagnostics/main-diagnostics-service'
import {
  configurePreviewProxyService,
  ensurePreviewPlayableMedia,
  resolveUserPathToPreviewSourceFile
} from '../services/preview/preview-proxy-service'
import { registervelorixmediaProtocol } from '../core/media-protocol'
import { registerFluxHelpProtocol } from '../core/help-assets-protocol'
import {
  isExportOutputOpenMode,
  openExportOutputPath,
  rememberExportOutputPath,
  rememberFfmpegExportDirectory,
  rememberFfmpegSnapshotDirectory,
  rememberedExportDefaultPath,
  rememberedSnapshotDefaultPath
} from '../core/main-export-output-paths'
import { openDownloadedFileInMainHandler } from '../services/ytdlp/main-ytdlp-download-main-handler'
import { launchFfmpegExportBatchRunner } from '../services/ffmpeg/main-ffmpeg-export-batch-host'
import {
  activeExportAbort,
  bindFfmpegExportBatchSnapshotBroadcast,
  setActiveExportAbort
} from '../windows/main-window-runtime-state'
import { getMainApplicationSettingsIpcPersist } from './main-application-bootstrap-state'

export function registerMainApplicationBootstrapIpc(): void {
  configureMainInspectorWindowBootstrap()
  registervelorixmediaProtocol()
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
  registerExternalFilterScriptIpcHandlers()
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
  registerWindowsShellContextMenuIpc({
    getSettings: getCachedSettings,
    mutateSettings: (mutate) => {
      patchCachedSettings(mutate)
      saveCachedSettingsToDisk()
      return getCachedSettings()
    },
    mainUiLocale: () => getCachedSettings().uiLocale ?? 'ru'
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
  registerWorkflowIpcHandlers()
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
