import type { ElectronAPI } from '@electron-toolkit/preload'

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
import type { FfmpegSnapshotFormatId } from '../shared/ffmpeg-snapshot-contract'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportProgressPayload,
  FfmpegExportSubtitleModeId,
  FfmpegExportUserPreset,
  FfmpegExportUserPresetSnapshot,
  FfmpegExportVideoCodecId,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDeinterlaceId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoVignetteId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoTransformId,
  MediaExportRequestPayload,
  MediaExportStartResult
} from '../shared/ffmpeg-export-contract'
import type {
  FfmpegExportBatchConcurrency,
  FfmpegExportBatchAddPathsResult,
  FfmpegExportBatchOpenInputResult,
  FfmpegExportBatchPickFilesResult,
  FfmpegExportBatchSnapshot,
  FfmpegExportBatchStartResult
} from '../shared/ffmpeg-export-batch-contract'
import type { AppUiLocale } from '../shared/app-ui-locale'
import type { AppAboutInfo } from '../shared/about-contract'
import type {
  EngineId,
  EnginePathOverridesPatch,
  EnginesStatusSnapshot
} from '../shared/engine-contract'
import type { MediaProbeResult } from '../shared/ffprobe-contract'
import type { PreviewDialogResult, RestoredSourceInfo } from '../shared/preview-dialog-contract'
import type {
  AppSettings,
  AppSettingsView,
  AppTheme,
  DownloadsWindowUiPanelState,
  MainWindowUiPanelState,
  ResolvedAppTheme
} from '../shared/settings-contract'
import type {
  SaveTextDialogPayload,
  SaveTextDialogResult
} from '../shared/save-text-dialog-contract'
import type {
  YtdlpDownloadOptionsPatch,
  YtdlpDownloadOptionsPayload,
  YtdlpGetCliOptionsParams
} from '../shared/ytdlp-download-contract'
import type {
  YtdlpDownloadHistoryEntry,
  YtdlpDownloadHistoryWeeklySummary
} from '../shared/ytdlp-history-contract'
import type {
  ProcessingHistoryEntry,
  ProcessingHistoryFilter,
  ProcessingHistoryWeeklySummary
} from '../shared/processing-history-contract'
import type { DownloadsLogPayload } from '../shared/downloads-log-contract'
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

/** Данные для привязки `<video>` к локальному файлу через allowlist-схему `fluxmedia://`. */
export type PreviewOpenedPayload = Extract<PreviewDialogResult, { ok: true }>

/**
 * Типизированный контракт preload -> renderer.
 *
 * Этот файл важен не только для автодополнения: он фиксирует публичную поверхность,
 * которую React-код имеет право использовать. Если метода нет здесь, renderer не должен
 * обращаться к нему через `ipcRenderer` напрямую.
 */
export interface FluxAlloyApi {
  // Имена IPC-каналов — `src/shared/ipc-channels.ts`; держать этот интерфейс синхронным с `src/preload/index.ts`.
  settings: {
    get: () => Promise<AppSettingsView>
    setUiLocale: (locale: AppUiLocale) => Promise<AppSettings>
    setTheme: (theme: AppTheme) => Promise<AppSettingsView>
    setEngineExecutablePaths: (patch: EnginePathOverridesPatch) => Promise<AppSettings>
    pickEngineExecutable: (engineId: EngineId) => Promise<string | null>
    setFfmpegExportEncodePreset: (preset: FfmpegExportEncodePresetId) => Promise<AppSettings>
    setFfmpegExportVideoCodec: (codec: FfmpegExportVideoCodecId) => Promise<AppSettings>
    setFfmpegExportContainer: (container: FfmpegExportContainerId) => Promise<AppSettings>
    setFfmpegExportCrf: (crf: number | null) => Promise<AppSettings>
    setFfmpegExportVideoBitrate: (bitrate: string | null) => Promise<AppSettings>
    setFfmpegExportTwoPass: (enabled: boolean) => Promise<AppSettings>
    setFfmpegExportEconomyMode: (enabled: boolean) => Promise<AppSettings>
    setFfmpegExportBenchmarkLoadThreshold: (percent: number) => Promise<AppSettings>
    setFfmpegExportHwDecode: (enabled: boolean) => Promise<AppSettings>
    setFfmpegExportExtraArgsLine: (line: string) => Promise<AppSettings>
    setFfmpegExportBatchOutputSuffix: (suffix: string) => Promise<AppSettings>
    setFfmpegExportBatchOutputDirectory: (dir: string | null) => Promise<AppSettings>
    setEditorUrlPasteBehavior: (
      behavior: 'downloads_window' | 'download_open_editor'
    ) => Promise<AppSettings>
    setFfmpegExportAudioMode: (mode: FfmpegExportAudioModeId) => Promise<AppSettings>
    setFfmpegExportAudioBitrate: (bitrate: string | null) => Promise<AppSettings>
    setFfmpegExportFps: (fps: number | null) => Promise<AppSettings>
    setFfmpegExportScalePreset: (scale: FfmpegExportScalePresetId) => Promise<AppSettings>
    setFfmpegExportVideoTransform: (transform: FfmpegExportVideoTransformId) => Promise<AppSettings>
    setFfmpegExportCropPreset: (crop: FfmpegExportCropPresetId) => Promise<AppSettings>
    setFfmpegExportAudioGainDb: (gainDb: number | null) => Promise<AppSettings>
    setFfmpegExportStripMetadata: (enabled: boolean) => Promise<AppSettings>
    setFfmpegExportStripChapters: (enabled: boolean) => Promise<AppSettings>
    setFfmpegExportSubtitleMode: (mode: FfmpegExportSubtitleModeId) => Promise<AppSettings>
    setFfmpegExportVideoDenoise: (preset: FfmpegExportVideoDenoiseId) => Promise<AppSettings>
    setFfmpegExportVideoDeband: (preset: FfmpegExportVideoDebandId) => Promise<AppSettings>
    setFfmpegExportVideoHisteq: (preset: FfmpegExportVideoHisteqId) => Promise<AppSettings>
    setFfmpegExportVideoLut3d: (preset: FfmpegExportVideoLut3dId) => Promise<AppSettings>
    setFfmpegExportVideoSharpen: (preset: FfmpegExportVideoSharpenId) => Promise<AppSettings>
    setFfmpegExportVideoEqPreset: (preset: FfmpegExportVideoEqPresetId) => Promise<AppSettings>
    setFfmpegExportVideoHue: (preset: FfmpegExportVideoHueId) => Promise<AppSettings>
    setFfmpegExportVideoGrain: (preset: FfmpegExportVideoGrainId) => Promise<AppSettings>
    setFfmpegExportVideoVignette: (preset: FfmpegExportVideoVignetteId) => Promise<AppSettings>
    setFfmpegExportVideoBlur: (preset: FfmpegExportVideoBlurId) => Promise<AppSettings>
    setFfmpegExportVideoDeinterlace: (
      preset: FfmpegExportVideoDeinterlaceId
    ) => Promise<AppSettings>
    setFfmpegExportAudioNormalize: (preset: FfmpegExportAudioNormalizeId) => Promise<AppSettings>
    setFfmpegExportUserPresets: (presets: FfmpegExportUserPreset[]) => Promise<AppSettings>
    applyFfmpegExportSnapshot: (snapshot: FfmpegExportUserPresetSnapshot) => Promise<AppSettings>
    setFfmpegSnapshotFormat: (format: FfmpegSnapshotFormatId) => Promise<AppSettings>
    mergeMainWindowUiPanels: (patch: Partial<MainWindowUiPanelState>) => Promise<AppSettings>
    exportBackup: () => Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    >
    importBackup: () => Promise<
      { ok: true } | { ok: false; cancelled: true } | { ok: false; error: string }
    >
    resetToDefaults: () => Promise<AppSettings>
    windowsExplorerContextMenuStatus: () => Promise<{
      supported: boolean
      enabledInSettings: boolean
      registered: boolean
    }>
    setWindowsExplorerContextMenuEnabled: (
      enabled: boolean
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    registerWindowsExplorerContextMenuNow: () => Promise<{ ok: true } | { ok: false; error: string }>
    unregisterWindowsExplorerContextMenu: () => Promise<{ ok: true }>
  }
  preview: {
    openFileDialog: (uiLocale?: AppUiLocale) => Promise<PreviewDialogResult>
    openVideoFolderDialog: (uiLocale?: AppUiLocale) => Promise<PreviewDialogResult>
    grantPath: (
      absolutePath: string
    ) => Promise<
      { ok: true; path: string; mediaUrl: string; name: string } | { ok: false; error: string }
    >
    probe: (absolutePath: string) => Promise<MediaProbeResult>
    snapshotFrame: (payload: {
      inputPath: string
      timeSec: number
      uiLocale?: 'ru' | 'en'
    }) => Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    >
    getPathForFile: (file: File) => string
  }
  session: {
    persistLastSource: (path: string | null) => Promise<void>
    restoreLastSource: () => Promise<RestoredSourceInfo | null>
  }
  downloads: {
    openWindow: (
      initial?: string | { text?: string; uiLocale?: 'ru' | 'en' } | null
    ) => Promise<void>
    addLines: (text: string) => Promise<{ ok: true; added: number } | { ok: false; error: string }>
    downloadFirstUrlOpenInMainEditor: (
      text: string
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    getSnapshot: () => Promise<unknown[]>
    clearQueue: () => Promise<{ ok: true } | { ok: false; error: string }>
    clearFinished: () => Promise<{ ok: true; removed: number } | { ok: false; error: string }>
    removeRow: (id: number) => Promise<{ ok: true } | { ok: false; error: string }>
    moveRow: (id: number, direction: -1 | 1) => Promise<{ ok: true } | { ok: false; error: string }>
    getOutputDirectory: () => Promise<{ path: string; isDefault: boolean }>
    openOutputDirectory: () => Promise<{ ok: true } | { ok: false; error: string }>
    pickOutputDirectory: () => Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    >
    clearOutputDirectory: () => Promise<{ ok: true } | { ok: false; error: string }>
    pickCookiesFile: () => Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    >
    clearCookiesFile: () => Promise<{ ok: true } | { ok: false; error: string }>
    onSnapshot: (listener: (rows: unknown[]) => void) => () => void
    startQueue: () => Promise<{ ok: true } | { ok: false; error: string }>
    startRow: (id: number) => Promise<{ ok: true } | { ok: false; error: string }>
    retryRow: (id: number) => Promise<{ ok: true } | { ok: false; error: string }>
    cancelQueue: () => Promise<{ ok: true } | { ok: false; error: string }>
    getYtdlpPauseState: () => Promise<{
      supported: boolean
      active: boolean
      paused: boolean
    }>
    pauseYtdlp: () => Promise<{ ok: true } | { ok: false; error: string }>
    resumeYtdlp: () => Promise<{ ok: true } | { ok: false; error: string }>
    openQueueOutput: (
      id: number,
      mode: 'file' | 'folder'
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    openQueueOutputInHandler: (id: number) => Promise<{ ok: true } | { ok: false; error: string }>
    extractQueueCover: (
      id: number
    ) => Promise<import('../shared/ffmpeg-cover-extract-contract').FfmpegCoverExtractResult>
    getCliOptions: (
      params?: YtdlpGetCliOptionsParams
    ) => Promise<{ ok: true; payload: YtdlpDownloadOptionsPayload } | { ok: false; error: string }>
    setCliOptions: (
      patch: YtdlpDownloadOptionsPatch
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    getHistory: () => Promise<YtdlpDownloadHistoryEntry[]>
    getHistoryWeeklySummary: () => Promise<YtdlpDownloadHistoryWeeklySummary>
    clearHistory: () => Promise<{ ok: true } | { ok: false; error: string }>
    openHistoryOutput: (
      id: string,
      mode: 'file' | 'folder'
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    openHistoryOutputInHandler: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>
    saveVisibleLog: (
      text: string
    ) => Promise<{ ok: true; path: string } | { ok: false; error: string }>
    onLog: (listener: (payload: DownloadsLogPayload) => void) => () => void
    mergeUiPanels: (
      patch: Partial<DownloadsWindowUiPanelState>
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    onDownloadsWindowUiPanelsChanged: (
      listener: (panels: DownloadsWindowUiPanelState) => void
    ) => () => void
    onDownloadsOutputDirectoryChanged: (
      listener: (
        snap: import('../shared/downloads-output-directory-snapshot').DownloadsOutputDirectorySnapshot
      ) => void
    ) => () => void
    onDownloadsCliOptionsChanged: (listener: () => void) => () => void
    onDownloadsHistoryChanged: (listener: () => void) => () => void
    bridgeOpenInspector: (
      mediaPath?: string | null
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    bridgeFocusMainEditor: () => Promise<{ ok: true } | { ok: false; error: string }>
    bridgeOpenEnginePaths: () => Promise<{ ok: true } | { ok: false; error: string }>
    bridgeOpenAbout: () => Promise<{ ok: true } | { ok: false; error: string }>
  }
  inspector: {
    openWindow: (absoluteMediaPath?: string | null) => Promise<void>
    bootstrap: () => Promise<{ initialMediaPath: string | null }>
    onTargetMediaPath: (listener: (absolutePath: string) => void) => () => void
  }
  clipboard: {
    readText: () => Promise<string>
    writeText: (text: string) => Promise<{ ok: true } | { ok: false }>
  }
  terminal: {
    getHints: () => Promise<TerminalCommandHintEntry[]>
    run: (payload: TerminalRunRequest) => Promise<TerminalRunResult>
  }
  knowledge: {
    listArticles: (req?: KnowledgeListArticlesRequest) => Promise<KnowledgeArticleListResult>
    readArticle: (req: KnowledgeReadArticleRequest) => Promise<KnowledgeArticleResult>
  }
  saveTextWithDialog: (payload: SaveTextDialogPayload) => Promise<SaveTextDialogResult>
  about: {
    getInfo: () => Promise<AppAboutInfo>
  }
  externalFilterScript: {
    pickFile: (payload: {
      kind: import('../shared/external-filter-script-contract').ExternalFilterScriptKind
      uiLocale?: import('../shared/app-ui-locale').AppUiLocale
    }) => Promise<import('../shared/external-filter-script-contract').ExternalFilterScriptPickResult>
    apply: (
      payload: import('../shared/external-filter-script-contract').ExternalFilterScriptApplyPayload & {
        uiLocale?: import('../shared/app-ui-locale').AppUiLocale
      }
    ) => Promise<import('../shared/external-filter-script-contract').ExternalFilterScriptApplyResult>
  }
  workflows: {
    listScenarios: () => Promise<
      | { ok: true; items: import('../shared/workflow-scenario-contract').WorkflowScenarioListItem[] }
      | { ok: false; error: string }
    >
    getScenario: (
      id: string
    ) => Promise<
      | { ok: true; scenario: import('../shared/workflow-scenario-contract').WorkflowScenarioDocument }
      | { ok: false; error: string }
    >
    saveScenario: (
      doc: import('../shared/workflow-scenario-contract').WorkflowScenarioDocument
    ) => Promise<
      | { ok: true; scenario: import('../shared/workflow-scenario-contract').WorkflowScenarioDocument }
      | { ok: false; error: string }
    >
    deleteScenario: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>
    listScheduledTasks: () => Promise<
      | { ok: true; items: import('../shared/scheduled-task-contract').ScheduledTaskListItem[] }
      | { ok: false; error: string }
    >
    saveScheduledTask: (
      doc: import('../shared/scheduled-task-contract').ScheduledTaskDocument
    ) => Promise<
      | {
          ok: true
          task: import('../shared/scheduled-task-contract').ScheduledTaskDocument
          osSchedulerWarning?: string
        }
      | { ok: false; error: string }
    >
    deleteScheduledTask: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>
    setScheduledTaskEnabled: (
      id: string,
      enabled: boolean
    ) => Promise<{ ok: true; osSchedulerWarning?: string } | { ok: false; error: string }>
    capabilities: () => Promise<
      | {
          ok: true
          windowsTaskScheduler: boolean
          macosLaunchd: boolean
          linuxSystemdUserTimer: boolean
        }
      | { ok: false; error: string }
    >
    pickWatchFolder: () => Promise<{ ok: true; path: string } | { ok: false; error: string }>
    runScenarioOnFile: (
      scenarioId: string,
      filePath: string,
      taskTitle: string
    ) => Promise<
      | { ok: true }
      | { ok: false; error: import('../shared/workflow-watch-folder-contract').WorkflowRunScenarioOnFileError }
    >
    runScenarioOnUrl: (
      scenarioId: string,
      taskTitle: string
    ) => Promise<
      | { ok: true; rowId: number; started: boolean }
      | { ok: false; error: import('../shared/workflow-watch-folder-contract').WorkflowRunScenarioOnUrlError }
    >
    onWatchFolderDetected: (
      listener: (
        payload: import('../shared/workflow-watch-folder-contract').WorkflowWatchFolderDetectedPayload
      ) => void
    ) => () => void
    onWatchFolderRunFinished: (
      listener: (
        payload: import('../shared/workflow-watch-folder-contract').WorkflowWatchFolderRunFinishedPayload
      ) => void
    ) => () => void
  }
  utilities: {
    repairRemux: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesRepairRequestPayload
    ) => Promise<import('../shared/media-utilities-contract').MediaUtilitiesRepairResult>
    checkIntegrity: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesIntegrityRequestPayload
    ) => Promise<import('../shared/media-utilities-contract').MediaUtilitiesIntegrityResult>
    generateNoise: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesGenerateNoiseRequestPayload
    ) => Promise<import('../shared/media-utilities-contract').MediaUtilitiesGenerateNoiseResult>
    computeFileHash: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesFileHashRequestPayload
    ) => Promise<import('../shared/media-utilities-contract').MediaUtilitiesFileHashResult>
    convertImage: (
      payload: import('../shared/media-utilities-contract').MediaUtilitiesConvertImageRequestPayload
    ) => Promise<import('../shared/media-utilities-contract').MediaUtilitiesConvertImageResult>
  }
  diagnostics: {
    listFolders: () => Promise<DiagnosticsFolderEntry[]>
    openFolder: (
      id: DiagnosticsFolderId
    ) => Promise<{ ok: true; path: string } | { ok: false; error: string }>
    openMainLog: () => Promise<DiagnosticsOpenMainLogResult>
    createSupportZip: () => Promise<DiagnosticsSupportZipResult>
    maintenanceSnapshot: () => Promise<DiagnosticsMaintenanceSnapshot>
    cleanMaintenance: (
      request?: DiagnosticsCleanMaintenanceRequest
    ) => Promise<DiagnosticsCleanMaintenanceResult>
  }
  log: {
    send: (entry: { level: 'info' | 'warn' | 'error'; scope?: string; message: string }) => void
  }
  engines: {
    getStatus: (uiLocale?: AppUiLocale) => Promise<EnginesStatusSnapshot>
    shouldOfferDownload: () => Promise<boolean>
    download: (
      uiLocale?: AppUiLocale
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    checkUpdatesAndDownload: (
      uiLocale?: AppUiLocale
    ) => Promise<
      import('../shared/engine-update-check-contract').EnginesCheckUpdatesAndDownloadResult
    >
    clearUserBin: () => Promise<{ ok: true; removed: number } | { ok: false; error: string }>
    probeHwEncoders: () => Promise<FfmpegHwEncodersProbeResult>
    onDownloadProgress: (listener: (progress: EngineDownloadProgress) => void) => () => void
  }
  export: {
    start: (payload: MediaExportRequestPayload) => Promise<MediaExportStartResult>
    runBenchmark: (
      payload: import('../shared/ffmpeg-export-benchmark-contract').FfmpegExportBenchmarkRequestPayload
    ) => Promise<
      import('../shared/ffmpeg-export-benchmark-contract').FfmpegExportBenchmarkResult
    >
    resolveBundledLutCubePath: (preset: FfmpegExportVideoLut3dId) => Promise<string | null>
    cancel: () => Promise<{ ok: true } | { ok: false; error: string }>
    openOutput: (
      path: string,
      mode: 'file' | 'folder' | 'preview'
    ) => Promise<{ ok: true; path: string } | { ok: false; error: string }>
    onProgress: (listener: (progress: FfmpegExportProgressPayload) => void) => () => void
    onBenchmarkProgress: (
      listener: (
        progress: import('../shared/ffmpeg-export-benchmark-contract').FfmpegExportBenchmarkProgressPayload
      ) => void
    ) => () => void
    extractFrames: (
      payload: import('../shared/ffmpeg-frames-extract-contract').FfmpegFramesExtractRequestPayload
    ) => Promise<import('../shared/ffmpeg-frames-extract-contract').FfmpegFramesExtractResult>
    onExtractFramesProgress: (
      listener: (
        progress: import('../shared/ffmpeg-frames-extract-contract').FfmpegFramesExtractProgressPayload
      ) => void
    ) => () => void
  }
  batchExport: {
    getSnapshot: () => Promise<FfmpegExportBatchSnapshot>
    listInputPaths: () => Promise<{ ok: true; paths: string[] }>
    listOutputPaths: () => Promise<{ ok: true; paths: string[] }>
    removeWaiting: () => Promise<{ ok: true; removed: number } | { ok: false; error: string }>
    pickFiles: () => Promise<FfmpegExportBatchPickFilesResult>
    pickFolder: () => Promise<FfmpegExportBatchPickFilesResult>
    pickOutputFolder: () => Promise<{ ok: true; path: string } | { ok: false; cancelled: true }>
    revealSharedOutputFolder: () => Promise<{ ok: true } | { ok: false; error: string }>
    addPaths: (paths: string[]) => Promise<FfmpegExportBatchAddPathsResult>
    openInput: (
      path: string,
      mode: 'file' | 'folder' | 'preview'
    ) => Promise<FfmpegExportBatchOpenInputResult>
    removeRows: (ids: number[]) => Promise<{ ok: true; removed: number }>
    clear: () => Promise<{ ok: true }>
    moveRow: (
      id: number,
      direction: 'up' | 'down'
    ) => Promise<{ ok: true; moved: boolean } | { ok: false; error: string }>
    reorderRow: (
      id: number,
      toIndex: number
    ) => Promise<{ ok: true; moved: boolean } | { ok: false; error: string }>
    setConcurrency: (value: FfmpegExportBatchConcurrency) => Promise<{ ok: true }>
    start: (rawExportOverrides?: unknown) => Promise<FfmpegExportBatchStartResult>
    cancel: () => Promise<{ ok: true }>
    retryFailed: () => Promise<{ ok: true; reset: number } | { ok: false; error: string }>
    retryRows: (
      ids: number[]
    ) => Promise<{ ok: true; reset: number } | { ok: false; error: string }>
    clearCompleted: () => Promise<{ ok: true; removed: number } | { ok: false; error: string }>
    addFromDownloadsDone: (ids?: number[]) => Promise<FfmpegExportBatchAddPathsResult>
    addFromHistoryInputs: (ids: string[]) => Promise<FfmpegExportBatchAddPathsResult>
    retryFailedAndStart: (rawExportOverrides?: unknown) => Promise<FfmpegExportBatchStartResult>
    onSnapshot: (listener: (snapshot: FfmpegExportBatchSnapshot) => void) => () => void
  }
  processingHistory: {
    get: (
      filter?: ProcessingHistoryFilter & { limit?: number }
    ) => Promise<ProcessingHistoryEntry[]>
    weeklySummary: () => Promise<ProcessingHistoryWeeklySummary>
    clear: () => Promise<{ ok: true } | { ok: false; error: string }>
    openOutput: (
      id: string,
      mode: 'file' | 'folder' | 'preview'
    ) => Promise<{ ok: true; path: string } | { ok: false; error: string }>
    openInputInHandler: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>
    repeatWorkflowScenario: (
      id: string
    ) => Promise<
      | { ok: true }
      | { ok: false; error: string }
      | {
          ok: false
          errorCode:
            | import('../shared/workflow-watch-folder-contract').WorkflowRunScenarioOnFileError
            | import('../shared/workflow-watch-folder-contract').WorkflowRunScenarioOnUrlError
        }
    >
  }
  onPreviewOpened: (listener: (payload: PreviewOpenedPayload) => void) => () => void
  onThemeChanged: (listener: (theme: ResolvedAppTheme) => void) => () => void
  onUiLocaleChanged: (listener: (locale: AppUiLocale) => void) => () => void
  onOpenEnginePaths: (listener: () => void) => () => void
  onOpenSettings: (
    listener: (section: import('../shared/app-settings-dialog-section').AppSettingsDialogSection) => void
  ) => () => void
  onEnginePathsChanged: (listener: () => void) => () => void
  onSettingsBackupImported: (listener: () => void) => () => void
  onProcessingHistoryChanged: (listener: () => void) => () => void
  onOpenAbout: (listener: () => void) => () => void
  onOpenExternalFilterScript: (listener: () => void) => () => void
  onOpenWorkflowPlanner: (listener: () => void) => () => void
  onOpenWorkflowScenarioBuilder: (listener: () => void) => () => void
  onMainWindowUiPanelsChanged: (
    listener: (panels: MainWindowUiPanelState | undefined) => void
  ) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    fluxalloy: FluxAlloyApi
  }
}
