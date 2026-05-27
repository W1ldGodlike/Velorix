import type { AppSettings } from './settings-store'
import type { FfmpegExportSettingsPersisters } from '../../ipc/register-settings-ipc'
import type { AppUiLocale } from '../../../shared/app-ui-locale'
import type { EnginePathOverridesPatch } from '../engines/engine-service'

export type MainSettingsAccess = {
  get: () => AppSettings
  set: (next: AppSettings) => void
  save: () => void
}

export type SettingsIpcPersistHooks = {
  buildApplicationMenu: () => void
  syncDownloadsWindowLocale: (locale: AppUiLocale) => void
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
  persistMainWindowUiPanelsMerge: (raw: unknown) => AppSettings
}
