/**
 * Типизированный контракт preload -> renderer (фрагмент VelorixApi).
 * IPC-каналы: `src/shared/ipc-channels.ts`; синхрон с `src/preload/index.ts`.
 */
import type { AppUiLocale } from '../shared/app-ui-locale'
import type { EngineId, EnginePathOverridesPatch } from '../shared/engine-contract'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportUserPreset,
  FfmpegExportUserPresetSnapshot,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoCodecId,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDeinterlaceId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoTransformId,
  FfmpegExportVideoVignetteId
} from '../shared/ffmpeg-export-contract'
import type { FfmpegSnapshotFormatId } from '../shared/ffmpeg-snapshot-contract'
import type { MediaProbeResult } from '../shared/ffprobe-contract'
import type { PreviewDialogResult, RestoredSourceInfo } from '../shared/preview-dialog-contract'
import type {
  PresetsExportCloneBuiltinRequest,
  PresetsExportCloneBuiltinResult,
  PresetsExportDialogResult
} from '../shared/presets-export-contract'
import type { AppSettings, AppSettingsView } from '../shared/settings-contract'
export type VelorixApiSettingsBlock = {
  settings: {
    get: () => Promise<AppSettingsView>
    setUiLocale: (locale: AppUiLocale) => Promise<AppSettings>
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
    setConfirmCloseOnQuit: (enabled: boolean) => Promise<AppSettings>
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
    exportBackup: () => Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    >
    importBackup: () => Promise<
      { ok: true } | { ok: false; cancelled: true } | { ok: false; error: string }
    >
    exportPresets: () => Promise<PresetsExportDialogResult>
    importPresets: () => Promise<PresetsExportDialogResult>
    cloneBuiltinExportPreset: (
      request: PresetsExportCloneBuiltinRequest
    ) => Promise<PresetsExportCloneBuiltinResult>
    resetToDefaults: () => Promise<AppSettings>
    windowsExplorerContextMenuStatus: () => Promise<{
      supported: boolean
      enabledInSettings: boolean
      registered: boolean
    }>
    setWindowsExplorerContextMenuEnabled: (
      enabled: boolean
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    registerWindowsExplorerContextMenuNow: () => Promise<
      { ok: true } | { ok: false; error: string }
    >
    unregisterWindowsExplorerContextMenu: () => Promise<{ ok: true }>
    windowsFileAssociationStatus: () => Promise<{
      supported: boolean
      enabledInSettings: boolean
      registered: boolean
    }>
    setWindowsFileAssociationEnabled: (
      enabled: boolean
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    registerWindowsFileAssociationNow: () => Promise<{ ok: true } | { ok: false; error: string }>
    unregisterWindowsFileAssociation: () => Promise<{ ok: true }>
    openWindowsDefaultAppsSettings: () => Promise<{ ok: true } | { ok: false; error: string }>
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
}
