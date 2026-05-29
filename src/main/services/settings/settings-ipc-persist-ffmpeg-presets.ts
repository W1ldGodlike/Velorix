import { parseFfmpegExportUserPresetSnapshot } from '../ffmpeg/ffmpeg-export-service'
import { mergeFfmpegExportSnapshotIntoAppSettings } from '../ffmpeg/ffmpeg-export-app-settings-merge'
import { persistExportUserPresetsList } from '../presets/presets-export-service'
import type { AppSettings } from './settings-store'
import type { FfmpegExportSettingsPersisters } from './settings-ipc-persist-core'
import { commit, snapshot, type MainSettingsAccess } from './settings-ipc-persist-core'

export function createFfmpegExportSettingsPersistersPresets(
  access: MainSettingsAccess
): Pick<FfmpegExportSettingsPersisters, 'userPresets' | 'applySnapshot'> {
  /** §20 — пользовательские пресеты в `Presets/export`, merged — в runtime settings. */
  function persistFfmpegExportUserPresets(raw: unknown): AppSettings {
    return commit(access, persistExportUserPresetsList(raw, access.get()))
  }

  /** §7.2 — применить снимок пресета к полям экспорта в settings одним сохранением. */
  function persistFfmpegExportApplySnapshot(raw: unknown): AppSettings {
    const presetSnapshot = parseFfmpegExportUserPresetSnapshot(raw)
    if (!presetSnapshot) {
      return snapshot(access)
    }
    return commit(access, mergeFfmpegExportSnapshotIntoAppSettings(access.get(), presetSnapshot))
  }
  return {
    userPresets: persistFfmpegExportUserPresets,
    applySnapshot: persistFfmpegExportApplySnapshot
  }
}
