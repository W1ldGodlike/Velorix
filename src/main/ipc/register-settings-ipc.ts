import { BrowserWindow, ipcMain } from 'electron'
import type { IpcMainInvokeEvent } from 'electron'

import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import {
  cloneBuiltinExportPreset,
  exportUserPresetsWithDialog,
  importUserPresetsWithDialog
} from '../services/presets/presets-export-service'
import {
  exportSettingsBackupWithDialog,
  importSettingsBackupWithDialog,
  resetAppSettingsToDefaultsKeepingWindowBounds
} from '../services/settings/settings-backup-service'
import type { PresetsExportCloneBuiltinRequest } from '../../shared/presets-export-contract'
import type { AppSettings, AppSettingsView, AppTheme } from '../services/settings/settings-store'
import type { EnginePathOverridesPatch } from '../services/engines/engine-service'

let ipcRegistered = false

type PersistSetting = (raw: unknown) => AppSettings

export type FfmpegExportSettingsPersisters = {
  encodePreset: PersistSetting
  videoCodec: PersistSetting
  container: PersistSetting
  crf: PersistSetting
  audioBitrate: PersistSetting
  audioMode: PersistSetting
  videoBitrate: PersistSetting
  twoPass: PersistSetting
  economyMode: PersistSetting
  benchmarkLoadThreshold: PersistSetting
  hwDecode: PersistSetting
  extraArgsLine: PersistSetting
  batchOutputSuffix: PersistSetting
  batchOutputDirectory: PersistSetting
  editorUrlPasteBehavior: PersistSetting
  fps: PersistSetting
  scalePreset: PersistSetting
  videoTransform: PersistSetting
  cropPreset: PersistSetting
  audioGainDb: PersistSetting
  stripMetadata: PersistSetting
  stripChapters: PersistSetting
  subtitleMode: PersistSetting
  videoDenoise: PersistSetting
  videoDeband: PersistSetting
  videoHisteq: PersistSetting
  videoLut3d: PersistSetting
  videoSharpen: PersistSetting
  videoEqPreset: PersistSetting
  videoGrain: PersistSetting
  videoVignette: PersistSetting
  videoBlur: PersistSetting
  videoDeinterlace: PersistSetting
  videoHue: PersistSetting
  audioNormalize: PersistSetting
  snapshotFormat: PersistSetting
  userPresets: PersistSetting
  applySnapshot: PersistSetting
}

const FFMPEG_EXPORT_SETTING_CHANNELS: ReadonlyArray<{
  channel: string
  key: keyof FfmpegExportSettingsPersisters
}> = [
  { channel: mw.settingsSetFfmpegExportEncodePreset, key: 'encodePreset' },
  { channel: mw.settingsSetFfmpegExportVideoCodec, key: 'videoCodec' },
  { channel: mw.settingsSetFfmpegExportContainer, key: 'container' },
  { channel: mw.settingsSetFfmpegExportCrf, key: 'crf' },
  { channel: mw.settingsSetFfmpegExportAudioBitrate, key: 'audioBitrate' },
  { channel: mw.settingsSetFfmpegExportAudioMode, key: 'audioMode' },
  { channel: mw.settingsSetFfmpegExportVideoBitrate, key: 'videoBitrate' },
  { channel: mw.settingsSetFfmpegExportTwoPass, key: 'twoPass' },
  { channel: mw.settingsSetFfmpegExportEconomyMode, key: 'economyMode' },
  {
    channel: mw.settingsSetFfmpegExportBenchmarkLoadThreshold,
    key: 'benchmarkLoadThreshold'
  },
  { channel: mw.settingsSetFfmpegExportHwDecode, key: 'hwDecode' },
  { channel: mw.settingsSetFfmpegExportExtraArgsLine, key: 'extraArgsLine' },
  { channel: mw.settingsSetFfmpegExportBatchOutputSuffix, key: 'batchOutputSuffix' },
  { channel: mw.settingsSetFfmpegExportBatchOutputDirectory, key: 'batchOutputDirectory' },
  { channel: mw.settingsSetEditorUrlPasteBehavior, key: 'editorUrlPasteBehavior' },
  { channel: mw.settingsSetFfmpegExportFps, key: 'fps' },
  { channel: mw.settingsSetFfmpegExportScalePreset, key: 'scalePreset' },
  { channel: mw.settingsSetFfmpegExportVideoTransform, key: 'videoTransform' },
  { channel: mw.settingsSetFfmpegExportCropPreset, key: 'cropPreset' },
  { channel: mw.settingsSetFfmpegExportAudioGainDb, key: 'audioGainDb' },
  { channel: mw.settingsSetFfmpegExportStripMetadata, key: 'stripMetadata' },
  { channel: mw.settingsSetFfmpegExportStripChapters, key: 'stripChapters' },
  { channel: mw.settingsSetFfmpegExportSubtitleMode, key: 'subtitleMode' },
  { channel: mw.settingsSetFfmpegExportVideoDenoise, key: 'videoDenoise' },
  { channel: mw.settingsSetFfmpegExportVideoDeband, key: 'videoDeband' },
  { channel: mw.settingsSetFfmpegExportVideoHisteq, key: 'videoHisteq' },
  { channel: mw.settingsSetFfmpegExportVideoLut3d, key: 'videoLut3d' },
  { channel: mw.settingsSetFfmpegExportVideoSharpen, key: 'videoSharpen' },
  { channel: mw.settingsSetFfmpegExportVideoEqPreset, key: 'videoEqPreset' },
  { channel: mw.settingsSetFfmpegExportVideoGrain, key: 'videoGrain' },
  { channel: mw.settingsSetFfmpegExportVideoVignette, key: 'videoVignette' },
  { channel: mw.settingsSetFfmpegExportVideoBlur, key: 'videoBlur' },
  { channel: mw.settingsSetFfmpegExportVideoDeinterlace, key: 'videoDeinterlace' },
  { channel: mw.settingsSetFfmpegExportVideoHue, key: 'videoHue' },
  { channel: mw.settingsSetFfmpegExportAudioNormalize, key: 'audioNormalize' },
  { channel: mw.settingsSetFfmpegSnapshotFormat, key: 'snapshotFormat' },
  { channel: mw.settingsSetFfmpegExportUserPresets, key: 'userPresets' },
  { channel: mw.settingsApplyFfmpegExportSnapshot, key: 'applySnapshot' }
]

export type SettingsIpcDeps = {
  getSettingsView: () => AppSettingsView
  copyCachedSettings: () => AppSettings
  persistUiLocale: (raw: unknown) => AppSettings
  persistThemePreference: (pref: AppTheme) => AppSettingsView
  persistEnginePathOverridesPatch: (patch: EnginePathOverridesPatch) => AppSettings
  persistMainWindowUiPanelsMerge: (raw: unknown) => AppSettings
  isMainWindowUiPanelSender: (event: IpcMainInvokeEvent) => boolean
  ffmpegExport: FfmpegExportSettingsPersisters
}

export function registerSettingsIpcHandlers(deps: SettingsIpcDeps): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  ipcMain.handle(mw.settingsGet, (): AppSettingsView => deps.getSettingsView())

  ipcMain.handle(
    mw.settingsSetUiLocale,
    (_, raw: unknown): AppSettings => deps.persistUiLocale(raw)
  )

  ipcMain.handle(mw.settingsSetTheme, (_, theme: unknown): AppSettingsView => {
    let next: AppTheme = 'dark'
    if (theme === 'light') {
      next = 'light'
    } else if (theme === 'system') {
      next = 'system'
    }
    return deps.persistThemePreference(next)
  })

  for (const { channel, key } of FFMPEG_EXPORT_SETTING_CHANNELS) {
    ipcMain.handle(channel, (_, raw: unknown): AppSettings => deps.ffmpegExport[key](raw))
  }

  ipcMain.handle(mw.settingsSetEnginePaths, (_, patch: unknown): AppSettings => {
    if (!patch || typeof patch !== 'object') {
      return deps.copyCachedSettings()
    }
    return deps.persistEnginePathOverridesPatch(patch as EnginePathOverridesPatch)
  })

  ipcMain.handle(mw.settingsMergeMainWindowUiPanels, (event, raw: unknown): AppSettings => {
    if (!deps.isMainWindowUiPanelSender(event)) {
      return deps.copyCachedSettings()
    }
    return deps.persistMainWindowUiPanelsMerge(raw)
  })

  ipcMain.handle(mw.settingsBackupExport, async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) ?? undefined
    return exportSettingsBackupWithDialog(win)
  })

  ipcMain.handle(mw.settingsBackupImport, async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) ?? undefined
    return importSettingsBackupWithDialog(win)
  })

  ipcMain.handle(mw.settingsResetToDefaults, (): AppSettings => {
    return resetAppSettingsToDefaultsKeepingWindowBounds()
  })

  ipcMain.handle(mw.presetsExportExport, async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) ?? undefined
    return exportUserPresetsWithDialog(win)
  })

  ipcMain.handle(mw.presetsExportImport, async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) ?? undefined
    return importUserPresetsWithDialog(win)
  })

  ipcMain.handle(mw.presetsExportCloneBuiltin, (_, raw: unknown) => {
    const req = raw as PresetsExportCloneBuiltinRequest
    const id =
      req && typeof req === 'object' && typeof req.builtinPresetId === 'string'
        ? req.builtinPresetId
        : ''
    return cloneBuiltinExportPreset(id, deps.copyCachedSettings())
  })
}
