import { ipcRenderer, webUtils } from 'electron'

import type {
  DiagnosticsFolderEntry,
  DiagnosticsFolderId,
  DiagnosticsCleanMaintenanceRequest,
  DiagnosticsCleanMaintenanceResult,
  DiagnosticsMaintenanceSnapshot,
  DiagnosticsOpenMainLogResult,
  DiagnosticsSupportZipResult
} from '../shared/diagnostics-contract'
import type { EngineDownloadProgress } from '../shared/engine-download-contract'
import type { EnginesCheckUpdatesAndDownloadResult } from '../shared/engine-update-check-contract'
import type { AppUiLocale } from '../shared/app-ui-locale'
import {
  DEFAULT_APP_SETTINGS_DIALOG_SECTION,
  parseAppSettingsDialogSection,
  type AppSettingsDialogSection
} from '../shared/app-settings-dialog-section'
import { coerceUiLocaleBroadcastPayload } from '../shared/ui-locale-runtime'
import type { AppAboutInfo } from '../shared/about-contract'
import type { EnginesStatusSnapshot } from '../shared/engine-contract'
import type { MediaProbeResult } from '../shared/ffprobe-contract'
import type { PreviewDialogResult, RestoredSourceInfo } from '../shared/preview-dialog-contract'
import type { MainWindowUiPanelState } from '../shared/settings-contract'
import type {
  SaveTextDialogPayload,
  SaveTextDialogResult
} from '../shared/save-text-dialog-contract'
import { parseProcessErrorDialogPayload } from '../shared/process-error-dialog-contract'
import type {
  TerminalCommandHintEntry,
  TerminalRunRequest,
  TerminalRunResult
} from '../shared/terminal-contract'
import type {
  KnowledgeArticleListResult,
  KnowledgeArticleResult,
  KnowledgeListArticlesRequest,
  KnowledgeReadArticleRequest
} from '../shared/knowledge-contract'
import type { FfmpegHwEncodersProbeResult } from '../shared/ffmpeg-hw-encoder-probe'
import { mainWindowIpc as mw } from '../shared/ipc-channels'
import { parseQuitConfirmRequestPayload } from '../shared/quit-confirm-contract'

type PreviewOpenedPayload = Extract<PreviewDialogResult, { ok: true }>

import { subscribeVoidIpc } from './preload-ipc-subscribe-void'
import { velorixDownloads } from './preload-velorix-downloads'
import {
  velorixBatchExport,
  velorixExport,
  velorixProcessingHistory
} from './preload-velorix-export'
import { velorixSettings } from './preload-velorix-settings'
import { sanitizeMainWindowUiPanelState } from './preload-sanitize'

/** Единственная публичная поверхность приложения в renderer (§ preload). */
export const velorix = {
  settings: velorixSettings,
  preview: {
    openFileDialog: (uiLocale?: AppUiLocale): Promise<PreviewDialogResult> =>
      ipcRenderer.invoke(mw.openVideoDialog, uiLocale),
    openVideoFolderDialog: (uiLocale?: AppUiLocale): Promise<PreviewDialogResult> =>
      ipcRenderer.invoke(mw.openVideoFolderDialog, uiLocale),
    grantPath: (
      absolutePath: string
    ): Promise<
      { ok: true; path: string; mediaUrl: string; name: string } | { ok: false; error: string }
    > => ipcRenderer.invoke(mw.previewGrantPath, absolutePath),
    probe: (absolutePath: string): Promise<MediaProbeResult> =>
      ipcRenderer.invoke(mw.mediaProbe, absolutePath),
    snapshotFrame: (payload: {
      inputPath: string
      timeSec: number
    }): Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => ipcRenderer.invoke(mw.snapshotFrame, payload),
    /** Только узкий API на путь: renderer не имеет доступа к `File.path`. */
    getPathForFile: (file: File): string => webUtils.getPathForFile(file)
  },
  session: {
    persistLastSource: (path: string | null): Promise<void> =>
      ipcRenderer.invoke(mw.persistLastSource, path),
    restoreLastSource: (): Promise<RestoredSourceInfo | null> =>
      ipcRenderer.invoke(mw.restoreLastSource)
  },
  downloads: velorixDownloads,
  /** §9 — внешний вызов route-aware открытия вкладки `Инспектор` в main shell. */
  inspector: {
    openWindow: (absoluteMediaPath?: string | null): Promise<void> =>
      ipcRenderer.invoke(mw.openInspectorWindow, absoluteMediaPath ?? null)
  },
  clipboard: {
    readText: (): Promise<string> => ipcRenderer.invoke(mw.clipboardReadText),
    writeText: (text: string): Promise<{ ok: true } | { ok: false }> =>
      ipcRenderer.invoke(mw.clipboardWriteText, text)
  },
  terminal: {
    getHints: (): Promise<TerminalCommandHintEntry[]> => ipcRenderer.invoke(mw.terminalHints),
    run: (payload: TerminalRunRequest): Promise<TerminalRunResult> =>
      ipcRenderer.invoke(mw.terminalRun, payload)
  },
  knowledge: {
    listArticles: (req?: KnowledgeListArticlesRequest): Promise<KnowledgeArticleListResult> =>
      ipcRenderer.invoke(mw.knowledgeListArticles, req ?? null),
    readArticle: (req: KnowledgeReadArticleRequest): Promise<KnowledgeArticleResult> =>
      ipcRenderer.invoke(mw.knowledgeReadArticle, req)
  },
  /** §9 — диалог «Сохранить как» в main (JSON ffprobe и др. текст без Node в renderer). */
  saveTextWithDialog: (payload: SaveTextDialogPayload): Promise<SaveTextDialogResult> =>
    ipcRenderer.invoke(mw.saveTextWithDialog, payload),
  about: {
    getInfo: (): Promise<AppAboutInfo> => ipcRenderer.invoke(mw.appAboutInfo)
  },
  externalFilterScript: {
    pickFile: (payload: {
      kind: import('../shared/external-filter-script-contract').ExternalFilterScriptKind
      uiLocale?: import('../shared/app-ui-locale').AppUiLocale
    }): Promise<
      import('../shared/external-filter-script-contract').ExternalFilterScriptPickResult
    > => ipcRenderer.invoke(mw.externalFilterScriptPickFile, payload),
    apply: (
      payload: import('../shared/external-filter-script-contract').ExternalFilterScriptApplyPayload & {
        uiLocale?: import('../shared/app-ui-locale').AppUiLocale
      }
    ): Promise<
      import('../shared/external-filter-script-contract').ExternalFilterScriptApplyResult
    > => ipcRenderer.invoke(mw.externalFilterScriptApply, payload)
  },
  workflows: {
    listScenarios: (): Promise<
      | {
          ok: true
          items: import('../shared/workflow-scenario-contract').WorkflowScenarioListItem[]
        }
      | { ok: false; error: string }
    > => ipcRenderer.invoke(mw.workflowScenariosList),
    getScenario: (
      id: string
    ): Promise<
      | {
          ok: true
          scenario: import('../shared/workflow-scenario-contract').WorkflowScenarioDocument
        }
      | { ok: false; error: string }
    > => ipcRenderer.invoke(mw.workflowScenariosGet, id),
    saveScenario: (
      doc: import('../shared/workflow-scenario-contract').WorkflowScenarioDocument
    ): Promise<
      | {
          ok: true
          scenario: import('../shared/workflow-scenario-contract').WorkflowScenarioDocument
        }
      | { ok: false; error: string }
    > => ipcRenderer.invoke(mw.workflowScenariosSave, doc),
    deleteScenario: (id: string): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(mw.workflowScenariosDelete, id),
    capabilities: (): Promise<
      | {
          ok: true
          windowsTaskScheduler: boolean
          macosLaunchd: boolean
          linuxSystemdUserTimer: boolean
        }
      | { ok: false; error: string }
    > => ipcRenderer.invoke(mw.workflowCapabilities),
    listScheduledTasks: (): Promise<
      | { ok: true; items: import('../shared/scheduled-task-contract').ScheduledTaskListItem[] }
      | { ok: false; error: string }
    > => ipcRenderer.invoke(mw.scheduledTasksList),
    saveScheduledTask: (
      doc: import('../shared/scheduled-task-contract').ScheduledTaskDocument
    ): Promise<
      | {
          ok: true
          task: import('../shared/scheduled-task-contract').ScheduledTaskDocument
          osSchedulerWarning?: string
        }
      | { ok: false; error: string }
    > => ipcRenderer.invoke(mw.scheduledTasksSave, doc),
    deleteScheduledTask: (id: string): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(mw.scheduledTasksDelete, id),
    setScheduledTaskEnabled: (
      id: string,
      enabled: boolean
    ): Promise<{ ok: true; osSchedulerWarning?: string } | { ok: false; error: string }> =>
      ipcRenderer.invoke(mw.scheduledTasksSetEnabled, id, enabled),
    pickWatchFolder: (): Promise<{ ok: true; path: string } | { ok: false; error: string }> =>
      ipcRenderer.invoke(mw.workflowPickWatchFolder),
    runScenarioOnFile: (
      scenarioId: string,
      filePath: string,
      taskTitle: string
    ): Promise<
      | { ok: true }
      | {
          ok: false
          error: import('../shared/workflow-watch-folder-contract').WorkflowRunScenarioOnFileError
        }
    > => ipcRenderer.invoke(mw.workflowRunScenarioOnFile, scenarioId, filePath, taskTitle),
    runScenarioOnUrl: (
      scenarioId: string,
      taskTitle: string
    ): Promise<
      | { ok: true; rowId: number; started: boolean }
      | {
          ok: false
          error: import('../shared/workflow-watch-folder-contract').WorkflowRunScenarioOnUrlError
        }
    > => ipcRenderer.invoke(mw.workflowRunScenarioOnUrl, scenarioId, taskTitle),
    onWatchFolderDetected: (
      listener: (
        payload: import('../shared/workflow-watch-folder-contract').WorkflowWatchFolderDetectedPayload
      ) => void
    ): (() => void) => {
      const handler = (
        _event: Electron.IpcRendererEvent,
        payload: import('../shared/workflow-watch-folder-contract').WorkflowWatchFolderDetectedPayload
      ): void => {
        listener(payload)
      }
      ipcRenderer.on(mw.workflowWatchFolderDetected, handler)
      return () => {
        ipcRenderer.removeListener(mw.workflowWatchFolderDetected, handler)
      }
    },
    onWatchFolderRunFinished: (
      listener: (
        payload: import('../shared/workflow-watch-folder-contract').WorkflowWatchFolderRunFinishedPayload
      ) => void
    ): (() => void) => {
      const handler = (
        _event: Electron.IpcRendererEvent,
        payload: import('../shared/workflow-watch-folder-contract').WorkflowWatchFolderRunFinishedPayload
      ): void => {
        listener(payload)
      }
      ipcRenderer.on(mw.workflowWatchFolderRunFinished, handler)
      return () => {
        ipcRenderer.removeListener(mw.workflowWatchFolderRunFinished, handler)
      }
    }
  },
  utilities: {
    repairRemux: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesRepairRequestPayload
    ): Promise<import('../shared/media-utilities-contract').MediaUtilitiesRepairResult> =>
      ipcRenderer.invoke(mw.mediaUtilitiesRepairRemux, payload),
    checkIntegrity: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesIntegrityRequestPayload
    ): Promise<import('../shared/media-utilities-contract').MediaUtilitiesIntegrityResult> =>
      ipcRenderer.invoke(mw.mediaUtilitiesCheckIntegrity, payload),
    generateNoise: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesGenerateNoiseRequestPayload
    ): Promise<import('../shared/media-utilities-contract').MediaUtilitiesGenerateNoiseResult> =>
      ipcRenderer.invoke(mw.mediaUtilitiesGenerateNoise, payload),
    computeFileHash: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesFileHashRequestPayload
    ): Promise<import('../shared/media-utilities-contract').MediaUtilitiesFileHashResult> =>
      ipcRenderer.invoke(mw.mediaUtilitiesComputeFileHash, payload),
    convertImage: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesConvertImageRequestPayload
    ): Promise<import('../shared/media-utilities-contract').MediaUtilitiesConvertImageResult> =>
      ipcRenderer.invoke(mw.mediaUtilitiesConvertImage, payload),
    pickSlideshowImages: (): Promise<
      import('../shared/media-utilities-contract').MediaUtilitiesPickSlideshowImagesResult
    > => ipcRenderer.invoke(mw.mediaUtilitiesPickSlideshowImages),
    createImageSlideshow: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesCreateImageSlideshowRequestPayload
    ): Promise<
      import('../shared/media-utilities-contract').MediaUtilitiesCreateImageSlideshowResult
    > => ipcRenderer.invoke(mw.mediaUtilitiesCreateImageSlideshow, payload)
  },
  diagnostics: {
    listFolders: (): Promise<DiagnosticsFolderEntry[]> =>
      ipcRenderer.invoke(mw.diagnosticsListFolders),
    openFolder: (
      id: DiagnosticsFolderId
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> =>
      ipcRenderer.invoke(mw.diagnosticsOpenFolder, id),
    /** §4.5 — тот же файл, что «Инструменты → Открыть main.log». */
    openMainLog: (): Promise<DiagnosticsOpenMainLogResult> =>
      ipcRenderer.invoke(mw.diagnosticsOpenMainLog),
    /** §4.5 — диалог сохранения ZIP в main (как пункт меню «Собрать Support ZIP…»). */
    createSupportZip: (): Promise<DiagnosticsSupportZipResult> =>
      ipcRenderer.invoke(mw.diagnosticsCreateSupportZip),
    maintenanceSnapshot: (): Promise<DiagnosticsMaintenanceSnapshot> =>
      ipcRenderer.invoke(mw.diagnosticsMaintenanceSnapshot),
    cleanMaintenance: (
      request?: DiagnosticsCleanMaintenanceRequest
    ): Promise<DiagnosticsCleanMaintenanceResult> =>
      ipcRenderer.invoke(mw.diagnosticsCleanMaintenance, request ?? {})
  },
  log: {
    /**
     * §18 — отправить запись в `app-data/logs/main.log` через main-логгер.
     * Без ответа: это «fire and forget», промахнувшийся payload отбрасывается на стороне main.
     */
    send: (entry: { level: 'info' | 'warn' | 'error'; scope?: string; message: string }): void => {
      ipcRenderer.send(mw.logRenderer, entry)
    }
  },
  engines: {
    getStatus: (uiLocale?: AppUiLocale): Promise<EnginesStatusSnapshot> =>
      ipcRenderer.invoke(mw.enginesStatus, uiLocale),
    shouldOfferDownload: (): Promise<boolean> => ipcRenderer.invoke(mw.enginesShouldOfferDownload),
    download: (uiLocale?: AppUiLocale): Promise<{ ok: true } | { ok: false; error: string }> =>
      ipcRenderer.invoke(mw.enginesDownload, uiLocale),
    checkUpdatesAndDownload: (
      uiLocale?: AppUiLocale
    ): Promise<EnginesCheckUpdatesAndDownloadResult> =>
      ipcRenderer.invoke(mw.enginesCheckUpdatesAndDownload, uiLocale),
    clearUserBin: (): Promise<{ ok: true; removed: number } | { ok: false; error: string }> =>
      ipcRenderer.invoke(mw.enginesClearUserBin),
    probeHwEncoders: (): Promise<FfmpegHwEncodersProbeResult> =>
      ipcRenderer.invoke(mw.enginesProbeHwEncoders),
    onDownloadProgress: (listener: (progress: EngineDownloadProgress) => void): (() => void) => {
      const channel = mw.enginesProgress
      const handler = (_event: unknown, raw: unknown): void => {
        if (!raw || typeof raw !== 'object') {
          return
        }
        listener(raw as EngineDownloadProgress)
      }
      ipcRenderer.on(channel, handler)
      return (): void => {
        ipcRenderer.removeListener(channel, handler)
      }
    }
  },
  export: velorixExport,
  batchExport: velorixBatchExport,
  processingHistory: velorixProcessingHistory,
  onPreviewOpened: (listener: (payload: PreviewOpenedPayload) => void): (() => void) => {
    const channel = mw.previewOpened
    const handler = (_event: unknown, raw: unknown): void => {
      if (
        raw &&
        typeof raw === 'object' &&
        'mediaUrl' in raw &&
        typeof (raw as { mediaUrl?: unknown }).mediaUrl === 'string'
      ) {
        listener(raw as PreviewOpenedPayload)
      }
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },
  onUiLocaleChanged: (listener: (locale: AppUiLocale) => void): (() => void) => {
    const channel = mw.uiLocaleChanged
    const handler = (_: unknown, raw: unknown): void => {
      const loc = coerceUiLocaleBroadcastPayload(raw)
      if (loc !== undefined) {
        listener(loc)
      }
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },
  onProcessErrorReported: (
    listener: (
      payload: import('../shared/process-error-dialog-contract').ProcessErrorDialogPayload
    ) => void
  ): (() => void) => {
    const channel = mw.processErrorReported
    const handler = (_: unknown, raw: unknown): void => {
      const payload = parseProcessErrorDialogPayload(raw)
      if (payload) {
        listener(payload)
      }
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },
  onQuitConfirmRequested: (
    listener: (payload: import('../shared/quit-confirm-contract').QuitConfirmRequestPayload) => void
  ): (() => void) => {
    const channel = mw.quitConfirmRequested
    const handler = (_: unknown, raw: unknown): void => {
      const payload = parseQuitConfirmRequestPayload(raw)
      if (payload) {
        listener(payload)
      }
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },
  respondQuitConfirm: (requestId: number, confirmed: boolean): void => {
    ipcRenderer.send(mw.quitConfirmRespond, { requestId, confirmed })
  },
  onOpenEnginePaths: (listener: () => void): (() => void) =>
    subscribeVoidIpc(mw.openEnginePaths, listener),
  onOpenSettings: (listener: (section: AppSettingsDialogSection) => void): (() => void) => {
    const channel = mw.openSettings
    const handler = (_: unknown, raw: unknown): void => {
      listener(parseAppSettingsDialogSection(raw) ?? DEFAULT_APP_SETTINGS_DIALOG_SECTION)
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },
  onEnginePathsChanged: (listener: () => void): (() => void) =>
    subscribeVoidIpc(mw.enginePathsChanged, listener),
  onSettingsBackupImported: (listener: () => void): (() => void) =>
    subscribeVoidIpc(mw.settingsBackupImported, listener),
  onExportPresetsDiskChanged: (listener: () => void): (() => void) =>
    subscribeVoidIpc(mw.exportPresetsDiskChanged, listener),
  onProcessingHistoryChanged: (listener: () => void): (() => void) =>
    subscribeVoidIpc(mw.processingHistoryChanged, listener),
  onOpenAbout: (listener: () => void): (() => void) => subscribeVoidIpc(mw.openAbout, listener),
  onOpenDownloadsRoute: (listener: () => void): (() => void) =>
    subscribeVoidIpc(mw.openDownloadsRoute, listener),
  onOpenInspectorRoute: (listener: () => void): (() => void) =>
    subscribeVoidIpc(mw.openInspectorRoute, listener),
  onOpenMediaFileUtilities: (listener: () => void): (() => void) =>
    subscribeVoidIpc(mw.openMediaFileUtilities, listener),
  onOpenExternalFilterScript: (listener: () => void): (() => void) =>
    subscribeVoidIpc(mw.openExternalFilterScript, listener),
  onOpenWorkflowPlanner: (listener: () => void): (() => void) =>
    subscribeVoidIpc(mw.openWorkflowPlanner, listener),
  onOpenWorkflowScenarioBuilder: (listener: () => void): (() => void) =>
    subscribeVoidIpc(mw.openWorkflowScenarioBuilder, listener),
  onMainWindowUiPanelsChanged: (
    listener: (panels: MainWindowUiPanelState | undefined) => void
  ): (() => void) => {
    const channel = mw.mainWindowUiPanelsChanged
    const handler = (_: unknown, raw: unknown): void => {
      if (raw === undefined || raw === null) {
        listener(undefined)
        return
      }
      const panels = sanitizeMainWindowUiPanelState(raw)
      if (panels !== undefined) {
        listener(panels)
      }
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  }
}
