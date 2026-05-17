import type { SettingsIpcPersistApi } from './settings-ipc-persist'
import type { AppSettingsView, AppTheme } from './settings-store'

let settingsIpcPersist: SettingsIpcPersistApi | undefined

export function setMainApplicationSettingsIpcPersist(api: SettingsIpcPersistApi): void {
  settingsIpcPersist = api
}

export function getMainApplicationSettingsIpcPersist(): SettingsIpcPersistApi {
  if (settingsIpcPersist === undefined) {
    throw new Error('main application bootstrap: settings IPC persist not initialized')
  }
  return settingsIpcPersist
}

export function persistMainApplicationThemePreference(pref: AppTheme): AppSettingsView {
  return getMainApplicationSettingsIpcPersist().persistThemePreference(pref)
}
