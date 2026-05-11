import type { ElectronAPI } from '@electron-toolkit/preload'

import type {
  DiagnosticsFolderEntry,
  DiagnosticsFolderId,
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
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoTransformId,
  MediaExportRequestPayload,
  MediaExportStartResult
} from '../shared/ffmpeg-export-contract'
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
import type { YtdlpDownloadHistoryEntry } from '../shared/ytdlp-history-contract'
import type { DownloadsLogPayload } from '../shared/downloads-log-contract'

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
    setTheme: (theme: AppTheme) => Promise<AppSettingsView>
    setEngineExecutablePaths: (patch: EnginePathOverridesPatch) => Promise<AppSettings>
    pickEngineExecutable: (engineId: EngineId) => Promise<string | null>
    setFfmpegExportEncodePreset: (preset: FfmpegExportEncodePresetId) => Promise<AppSettings>
    setFfmpegExportContainer: (container: FfmpegExportContainerId) => Promise<AppSettings>
    setFfmpegExportCrf: (crf: number | null) => Promise<AppSettings>
    setFfmpegExportVideoBitrate: (bitrate: string | null) => Promise<AppSettings>
    setFfmpegExportTwoPass: (enabled: boolean) => Promise<AppSettings>
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
    setFfmpegExportVideoLut3d: (preset: FfmpegExportVideoLut3dId) => Promise<AppSettings>
    setFfmpegExportVideoSharpen: (preset: FfmpegExportVideoSharpenId) => Promise<AppSettings>
    setFfmpegExportVideoEqPreset: (preset: FfmpegExportVideoEqPresetId) => Promise<AppSettings>
    setFfmpegExportVideoGrain: (preset: FfmpegExportVideoGrainId) => Promise<AppSettings>
    setFfmpegExportAudioNormalize: (preset: FfmpegExportAudioNormalizeId) => Promise<AppSettings>
    setFfmpegExportUserPresets: (presets: FfmpegExportUserPreset[]) => Promise<AppSettings>
    applyFfmpegExportSnapshot: (snapshot: FfmpegExportUserPresetSnapshot) => Promise<AppSettings>
    setFfmpegSnapshotFormat: (format: FfmpegSnapshotFormatId) => Promise<AppSettings>
    mergeMainWindowUiPanels: (patch: Partial<MainWindowUiPanelState>) => Promise<AppSettings>
  }
  preview: {
    openFileDialog: () => Promise<PreviewDialogResult>
    grantPath: (
      absolutePath: string
    ) => Promise<
      { ok: true; path: string; mediaUrl: string; name: string } | { ok: false; error: string }
    >
    probe: (absolutePath: string) => Promise<MediaProbeResult>
    snapshotFrame: (payload: {
      inputPath: string
      timeSec: number
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
    openWindow: (initial?: string | { text?: string } | null) => Promise<void>
    addLines: (text: string) => Promise<{ ok: true; added: number } | { ok: false; error: string }>
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
    getCliOptions: (
      params?: YtdlpGetCliOptionsParams
    ) => Promise<{ ok: true; payload: YtdlpDownloadOptionsPayload } | { ok: false; error: string }>
    setCliOptions: (
      patch: YtdlpDownloadOptionsPatch
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    getHistory: () => Promise<YtdlpDownloadHistoryEntry[]>
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
  saveTextWithDialog: (payload: SaveTextDialogPayload) => Promise<SaveTextDialogResult>
  about: {
    getInfo: () => Promise<AppAboutInfo>
  }
  diagnostics: {
    listFolders: () => Promise<DiagnosticsFolderEntry[]>
    openFolder: (
      id: DiagnosticsFolderId
    ) => Promise<{ ok: true; path: string } | { ok: false; error: string }>
    openMainLog: () => Promise<DiagnosticsOpenMainLogResult>
    createSupportZip: () => Promise<DiagnosticsSupportZipResult>
  }
  log: {
    send: (entry: { level: 'info' | 'warn' | 'error'; scope?: string; message: string }) => void
  }
  engines: {
    getStatus: () => Promise<EnginesStatusSnapshot>
    shouldOfferDownload: () => Promise<boolean>
    download: () => Promise<{ ok: true } | { ok: false; error: string }>
    clearUserBin: () => Promise<{ ok: true; removed: number } | { ok: false; error: string }>
    onDownloadProgress: (listener: (progress: EngineDownloadProgress) => void) => () => void
  }
  export: {
    start: (payload: MediaExportRequestPayload) => Promise<MediaExportStartResult>
    resolveBundledLutCubePath: (preset: FfmpegExportVideoLut3dId) => Promise<string | null>
    cancel: () => Promise<{ ok: true } | { ok: false; error: string }>
    openOutput: (
      path: string,
      mode: 'file' | 'folder' | 'preview'
    ) => Promise<{ ok: true; path: string } | { ok: false; error: string }>
    onProgress: (listener: (progress: FfmpegExportProgressPayload) => void) => () => void
  }
  onPreviewOpened: (listener: (payload: PreviewOpenedPayload) => void) => () => void
  onThemeChanged: (listener: (theme: ResolvedAppTheme) => void) => () => void
  onOpenEnginePaths: (listener: () => void) => () => void
  onEnginePathsChanged: (listener: () => void) => () => void
  onOpenAbout: (listener: () => void) => () => void
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
