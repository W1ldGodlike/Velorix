import {
  parseFfmpegExportUserPresetSnapshot,
  parseFfmpegExportUserPresetsList
} from './ffmpeg-export-service'
import { mergeFfmpegExportSnapshotIntoAppSettings } from './ffmpeg-export-app-settings-merge'
import type { AppSettings } from './settings-store'
import type { FfmpegExportSettingsPersisters } from './ipc/register-settings-ipc'
import { commit, snapshot, type MainSettingsAccess } from './settings-ipc-persist-core'

export function createFfmpegExportSettingsPersistersPresets(
  access: MainSettingsAccess
): Pick<FfmpegExportSettingsPersisters, 'userPresets' | 'applySnapshot'> {
  /** §7.2 — заменить список пользовательских пресетов экспорта (валидированный массив). */
  function persistFfmpegExportUserPresets(raw: unknown): AppSettings {
    const list = parseFfmpegExportUserPresetsList(raw)
    const next = { ...access.get() }
    if (list.length === 0) {
      delete next.ffmpegExportUserPresets
    } else {
      next.ffmpegExportUserPresets = list
    }
    return commit(access, next)
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
