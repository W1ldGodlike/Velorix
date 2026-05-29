import type { AppSettings } from './settings-store'
import type { AppUiLocale } from '../../../shared/app-ui-locale'
import type { EnginePathOverridesPatch } from '../engines/engine-service'

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

export type MainSettingsAccess = {
  get: () => AppSettings
  set: (next: AppSettings) => void
  save: () => void
}

export type SettingsIpcPersistHooks = {
  syncAppWindowTitlesToLocale: (locale: AppUiLocale) => void
  refreshEnginePathOverridesSnapshot: () => void
}

export function commit(access: MainSettingsAccess, next: AppSettings): AppSettings {
  access.set(next)
  access.save()
  return { ...next }
}

export function snapshot(access: MainSettingsAccess): AppSettings {
  return { ...access.get() }
}

export type SettingsIpcPersistApi = {
  ffmpegExport: FfmpegExportSettingsPersisters
  persistUiLocale: (raw: unknown) => AppSettings
  persistConfirmCloseOnQuit: (raw: unknown) => AppSettings
  persistEnginePathOverridesPatch: (patch: EnginePathOverridesPatch) => AppSettings
}
