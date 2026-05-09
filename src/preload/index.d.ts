import type { ElectronAPI } from '@electron-toolkit/preload'

import type { DiagnosticsFolderEntry, DiagnosticsFolderId } from '../main/diagnostics-paths'
import type { EngineDownloadProgress } from '../main/engine-download'
import type { FfmpegSnapshotFormatId } from '../main/ffmpeg-frame-snapshot-service'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportContainerId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportProgressPayload,
  MediaExportRequestPayload,
  MediaExportStartResult
} from '../shared/ffmpeg-export-contract'
import type { MediaProbeResult } from '../main/ffprobe-service'
import type {
  EngineId,
  EnginePathOverridesPatch,
  EnginesStatusSnapshot
} from '../main/engine-service'
import type { PreviewDialogResult } from '../main/preview-dialog'
import type { AppAboutInfo } from '../main/about-info'
import type { AppSettings, AppTheme } from '../main/settings-store'

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
    get: () => Promise<AppSettings>
    setTheme: (theme: AppTheme) => Promise<AppSettings>
    setEngineExecutablePaths: (patch: EnginePathOverridesPatch) => Promise<AppSettings>
    pickEngineExecutable: (engineId: EngineId) => Promise<string | null>
    setFfmpegExportEncodePreset: (preset: FfmpegExportEncodePresetId) => Promise<AppSettings>
    setFfmpegExportContainer: (container: FfmpegExportContainerId) => Promise<AppSettings>
    setFfmpegExportCrf: (crf: number | null) => Promise<AppSettings>
    setFfmpegExportVideoBitrate: (bitrate: string | null) => Promise<AppSettings>
    setFfmpegExportAudioMode: (mode: FfmpegExportAudioModeId) => Promise<AppSettings>
    setFfmpegExportAudioBitrate: (bitrate: string | null) => Promise<AppSettings>
    setFfmpegExportFps: (fps: number | null) => Promise<AppSettings>
    setFfmpegExportScalePreset: (scale: FfmpegExportScalePresetId) => Promise<AppSettings>
    setFfmpegSnapshotFormat: (format: FfmpegSnapshotFormatId) => Promise<AppSettings>
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
    restoreLastSource: () => Promise<PreviewOpenedPayload | null>
  }
  downloads: {
    openWindow: (initial?: string | { text?: string } | null) => Promise<void>
  }
  clipboard: {
    readText: () => Promise<string>
    writeText: (text: string) => Promise<{ ok: true } | { ok: false }>
  }
  about: {
    getInfo: () => Promise<AppAboutInfo>
  }
  diagnostics: {
    listFolders: () => Promise<DiagnosticsFolderEntry[]>
    openFolder: (
      id: DiagnosticsFolderId
    ) => Promise<{ ok: true; path: string } | { ok: false; error: string }>
  }
  log: {
    send: (entry: { level: 'info' | 'warn' | 'error'; scope?: string; message: string }) => void
  }
  engines: {
    getStatus: () => Promise<EnginesStatusSnapshot>
    shouldOfferDownload: () => Promise<boolean>
    download: () => Promise<{ ok: true } | { ok: false; error: string }>
    onDownloadProgress: (listener: (progress: EngineDownloadProgress) => void) => () => void
  }
  export: {
    start: (payload: MediaExportRequestPayload) => Promise<MediaExportStartResult>
    cancel: () => Promise<{ ok: true } | { ok: false; error: string }>
    openOutput: (
      path: string,
      mode: 'file' | 'folder' | 'preview'
    ) => Promise<{ ok: true; path: string } | { ok: false; error: string }>
    onProgress: (listener: (progress: FfmpegExportProgressPayload) => void) => () => void
  }
  onPreviewOpened: (listener: (payload: PreviewOpenedPayload) => void) => () => void
  onThemeChanged: (listener: (theme: AppTheme) => void) => () => void
  onOpenEnginePaths: (listener: () => void) => () => void
  onEnginePathsChanged: (listener: () => void) => () => void
  onOpenAbout: (listener: () => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    fluxalloy: FluxAlloyApi
  }
}
