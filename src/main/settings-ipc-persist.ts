export type {
  MainSettingsAccess,
  SettingsIpcPersistApi,
  SettingsIpcPersistHooks
} from './settings-ipc-persist-core'
export { commit, snapshot } from './settings-ipc-persist-core'

import type { MainSettingsAccess, SettingsIpcPersistApi, SettingsIpcPersistHooks } from './settings-ipc-persist-core'
import { createFfmpegExportSettingsPersisters } from './settings-ipc-persist-ffmpeg'
import { createSettingsShellPersist } from './settings-ipc-persist-shell'

export function createSettingsIpcPersist(
  access: MainSettingsAccess,
  hooks: SettingsIpcPersistHooks
): SettingsIpcPersistApi {
  return {
    ...createSettingsShellPersist(access, hooks),
    ffmpegExport: createFfmpegExportSettingsPersisters(access)
  }
}
