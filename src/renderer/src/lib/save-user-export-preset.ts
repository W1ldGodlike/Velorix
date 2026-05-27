import {
  FFMPEG_EXPORT_USER_ADDED_PRESETS_MAX,
  type FfmpegExportUserPreset
} from '../../../shared/ffmpeg-export-contract'
import { isBuiltinExportUserPresetId } from '../../../shared/builtin-ffmpeg-export-user-presets'

import { exportSettingsToPresetSnapshot } from './export-settings-to-preset-snapshot'

export type SaveUserExportPresetResult = { ok: true } | { ok: false; error: string }

/** ref.18 — сохранить текущие настройки FFmpeg как пользовательский пресет. */
export async function saveUserExportPreset(label: string): Promise<SaveUserExportPresetResult> {
  const trimmed = label.trim()
  if (trimmed.length === 0) {
    return { ok: false, error: 'Введите имя пресета' }
  }
  const get = window.velorix?.settings?.get
  const setPresets = window.velorix?.settings?.setFfmpegExportUserPresets
  if (get == null || setPresets == null) {
    return { ok: false, error: 'settings.get / setFfmpegExportUserPresets недоступен' }
  }
  const view = await get()
  const merged = view.ffmpegExportUserPresets ?? []
  const users = merged.filter((preset) => !isBuiltinExportUserPresetId(preset.id))
  if (users.length >= FFMPEG_EXPORT_USER_ADDED_PRESETS_MAX) {
    return {
      ok: false,
      error: `Не более ${String(FFMPEG_EXPORT_USER_ADDED_PRESETS_MAX)} пользовательских пресетов`
    }
  }
  const id = `user-${Date.now().toString(36)}`
  const nextUser: FfmpegExportUserPreset = {
    id,
    label: trimmed.slice(0, 64),
    snapshot: exportSettingsToPresetSnapshot(view)
  }
  await setPresets([...users, nextUser])
  return { ok: true }
}
