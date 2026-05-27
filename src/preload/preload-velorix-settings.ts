import { ipcRenderer } from 'electron'

import type { FfmpegSnapshotFormatId } from '../shared/ffmpeg-snapshot-contract'
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
  FfmpegExportVideoTransformId
} from '../shared/ffmpeg-export-contract'
import type { AppUiLocale } from '../shared/app-ui-locale'
import type { EngineId, EnginePathOverridesPatch } from '../shared/engine-contract'
import type {
  PresetsExportCloneBuiltinRequest,
  PresetsExportCloneBuiltinResult,
  PresetsExportDialogResult
} from '../shared/presets-export-contract'
import type { AppSettings, AppSettingsView } from '../shared/settings-contract'
import { mainWindowIpc as mw } from '../shared/ipc-channels'

/** settings.* — IPC setters ffmpeg/ytdlp/theme (main preload). */
export const velorixSettings = {
  get: (): Promise<AppSettingsView> => ipcRenderer.invoke(mw.settingsGet),
  setUiLocale: (locale: AppUiLocale): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetUiLocale, locale),
  setEngineExecutablePaths: (patch: EnginePathOverridesPatch): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetEnginePaths, patch),
  pickEngineExecutable: (engineId: EngineId): Promise<string | null> =>
    ipcRenderer.invoke(mw.pickEngineExecutable, engineId),
  setFfmpegExportEncodePreset: (preset: FfmpegExportEncodePresetId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportEncodePreset, preset),
  setFfmpegExportVideoCodec: (codec: FfmpegExportVideoCodecId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoCodec, codec),
  setFfmpegExportContainer: (container: FfmpegExportContainerId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportContainer, container),
  setFfmpegExportCrf: (crf: number | null): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportCrf, crf),
  setFfmpegExportVideoBitrate: (bitrate: string | null): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoBitrate, bitrate),
  setFfmpegExportTwoPass: (enabled: boolean): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportTwoPass, enabled),
  setFfmpegExportEconomyMode: (enabled: boolean): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportEconomyMode, enabled),
  setFfmpegExportBenchmarkLoadThreshold: (percent: number): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportBenchmarkLoadThreshold, percent),
  setFfmpegExportHwDecode: (enabled: boolean): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportHwDecode, enabled),
  setFfmpegExportExtraArgsLine: (line: string): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportExtraArgsLine, line),
  setFfmpegExportBatchOutputSuffix: (suffix: string): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportBatchOutputSuffix, suffix),
  setFfmpegExportBatchOutputDirectory: (dir: string | null): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportBatchOutputDirectory, dir),
  setEditorUrlPasteBehavior: (
    behavior: 'downloads_window' | 'download_open_editor'
  ): Promise<AppSettings> => ipcRenderer.invoke(mw.settingsSetEditorUrlPasteBehavior, behavior),
  setConfirmCloseOnQuit: (enabled: boolean): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetConfirmCloseOnQuit, enabled),
  setFfmpegExportAudioMode: (mode: FfmpegExportAudioModeId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportAudioMode, mode),
  setFfmpegExportAudioBitrate: (bitrate: string | null): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportAudioBitrate, bitrate),
  setFfmpegExportFps: (fps: number | null): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportFps, fps),
  setFfmpegExportScalePreset: (scale: FfmpegExportScalePresetId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportScalePreset, scale),
  setFfmpegExportVideoTransform: (transform: FfmpegExportVideoTransformId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoTransform, transform),
  setFfmpegExportCropPreset: (crop: FfmpegExportCropPresetId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportCropPreset, crop),
  setFfmpegExportAudioGainDb: (gainDb: number | null): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportAudioGainDb, gainDb),
  setFfmpegExportStripMetadata: (enabled: boolean): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportStripMetadata, enabled),
  setFfmpegExportStripChapters: (enabled: boolean): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportStripChapters, enabled),
  setFfmpegExportSubtitleMode: (mode: FfmpegExportSubtitleModeId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportSubtitleMode, mode),
  setFfmpegExportVideoDenoise: (preset: FfmpegExportVideoDenoiseId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoDenoise, preset),
  setFfmpegExportVideoDeband: (preset: FfmpegExportVideoDebandId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoDeband, preset),
  setFfmpegExportVideoHisteq: (preset: FfmpegExportVideoHisteqId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoHisteq, preset),
  setFfmpegExportVideoLut3d: (preset: FfmpegExportVideoLut3dId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoLut3d, preset),
  setFfmpegExportVideoSharpen: (preset: FfmpegExportVideoSharpenId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoSharpen, preset),
  setFfmpegExportVideoEqPreset: (preset: FfmpegExportVideoEqPresetId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoEqPreset, preset),
  setFfmpegExportVideoHue: (preset: FfmpegExportVideoHueId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoHue, preset),
  setFfmpegExportVideoGrain: (preset: FfmpegExportVideoGrainId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoGrain, preset),
  setFfmpegExportVideoVignette: (preset: FfmpegExportVideoVignetteId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoVignette, preset),
  setFfmpegExportVideoBlur: (preset: FfmpegExportVideoBlurId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoBlur, preset),
  setFfmpegExportVideoDeinterlace: (preset: FfmpegExportVideoDeinterlaceId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportVideoDeinterlace, preset),
  setFfmpegExportAudioNormalize: (preset: FfmpegExportAudioNormalizeId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportAudioNormalize, preset),
  setFfmpegExportUserPresets: (presets: FfmpegExportUserPreset[]): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegExportUserPresets, presets),
  applyFfmpegExportSnapshot: (snapshot: FfmpegExportUserPresetSnapshot): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsApplyFfmpegExportSnapshot, snapshot),
  setFfmpegSnapshotFormat: (format: FfmpegSnapshotFormatId): Promise<AppSettings> =>
    ipcRenderer.invoke(mw.settingsSetFfmpegSnapshotFormat, format),
  exportBackup: (): Promise<
    { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
  > => ipcRenderer.invoke(mw.settingsBackupExport),
  importBackup: (): Promise<
    { ok: true } | { ok: false; cancelled: true } | { ok: false; error: string }
  > => ipcRenderer.invoke(mw.settingsBackupImport),
  exportPresets: (): Promise<PresetsExportDialogResult> =>
    ipcRenderer.invoke(mw.presetsExportExport),
  importPresets: (): Promise<PresetsExportDialogResult> =>
    ipcRenderer.invoke(mw.presetsExportImport),
  cloneBuiltinExportPreset: (
    request: PresetsExportCloneBuiltinRequest
  ): Promise<PresetsExportCloneBuiltinResult> =>
    ipcRenderer.invoke(mw.presetsExportCloneBuiltin, request),
  resetToDefaults: (): Promise<AppSettings> => ipcRenderer.invoke(mw.settingsResetToDefaults),
  windowsExplorerContextMenuStatus: (): Promise<{
    supported: boolean
    enabledInSettings: boolean
    registered: boolean
  }> => ipcRenderer.invoke(mw.windowsExplorerContextMenuStatus),
  setWindowsExplorerContextMenuEnabled: (
    enabled: boolean
  ): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.windowsExplorerContextMenuSetEnabled, enabled),
  registerWindowsExplorerContextMenuNow: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.windowsExplorerContextMenuRegisterNow),
  unregisterWindowsExplorerContextMenu: (): Promise<{ ok: true }> =>
    ipcRenderer.invoke(mw.windowsExplorerContextMenuUnregister),
  windowsFileAssociationStatus: (): Promise<{
    supported: boolean
    enabledInSettings: boolean
    registered: boolean
  }> => ipcRenderer.invoke(mw.windowsFileAssociationStatus),
  setWindowsFileAssociationEnabled: (
    enabled: boolean
  ): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.windowsFileAssociationSetEnabled, enabled),
  registerWindowsFileAssociationNow: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.windowsFileAssociationRegisterNow),
  unregisterWindowsFileAssociation: (): Promise<{ ok: true }> =>
    ipcRenderer.invoke(mw.windowsFileAssociationUnregister),
  openWindowsDefaultAppsSettings: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.openWindowsDefaultAppsSettings)
}
