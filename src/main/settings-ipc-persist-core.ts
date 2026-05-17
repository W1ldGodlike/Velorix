import type { AppSettings, AppSettingsView, AppTheme, ResolvedAppTheme } from './settings-store'
import type { FfmpegExportSettingsPersisters } from './ipc/register-settings-ipc'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import type { EnginePathOverridesPatch } from './engine-service'

export type MainSettingsAccess = {
  get: () => AppSettings
  set: (next: AppSettings) => void
  save: () => void
}

export type SettingsIpcPersistHooks = {
  resolveEffectiveTheme: (pref: AppTheme) => ResolvedAppTheme
  buildApplicationMenu: () => void
  syncDownloadsPopoutHtmlToLocale: (locale: DownloadsWindowUiLocale) => void
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
  persistThemePreference: (pref: AppTheme) => AppSettingsView
  persistEnginePathOverridesPatch: (patch: EnginePathOverridesPatch) => AppSettings
  persistMainWindowUiPanelsMerge: (raw: unknown) => AppSettings
}
