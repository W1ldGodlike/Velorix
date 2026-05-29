import type { FfmpegExportSettingsPersisters } from './settings-ipc-persist-core'
import type { MainSettingsAccess } from './settings-ipc-persist-core'
import { createFfmpegExportSettingsPersistersCore } from './settings-ipc-persist-ffmpeg-core'
import { createFfmpegExportSettingsPersistersOutput } from './settings-ipc-persist-ffmpeg-output'
import { createFfmpegExportSettingsPersistersPresets } from './settings-ipc-persist-ffmpeg-presets'

export function createFfmpegExportSettingsPersisters(
  access: MainSettingsAccess
): FfmpegExportSettingsPersisters {
  return {
    ...createFfmpegExportSettingsPersistersCore(access),
    ...createFfmpegExportSettingsPersistersOutput(access),
    ...createFfmpegExportSettingsPersistersPresets(access)
  }
}
