import { shell } from 'electron'

import { WINDOWS_DEFAULT_APPS_SETTINGS_URI } from '../../../shared/windows-default-apps-settings'
import { isNativeMainWindows } from '../../../shared/native-main-platform'

/** Открыть «Параметры → Приложения по умолчанию» (только Windows). */
export async function openWindowsDefaultAppsSettings(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  if (!isNativeMainWindows()) {
    return { ok: false, error: 'unsupported-platform' }
  }
  try {
    await shell.openExternal(WINDOWS_DEFAULT_APPS_SETTINGS_URI)
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, error: msg }
  }
}
