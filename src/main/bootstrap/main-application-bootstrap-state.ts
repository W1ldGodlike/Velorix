import type { SettingsIpcPersistApi } from '../services/settings/settings-ipc-persist'

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
