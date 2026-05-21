import {
  buildYtdlpRunOptionsSnapshot,
  type YtdlpRunOptionsSnapshot
} from './ytdlp-download-options'
import type { AppSettings } from '../settings/settings-store'
import type { AppUiLocale } from '../../../shared/app-ui-locale'

/** Копия опций yt-dlp для runner без доступа к `cachedSettings` в index §6.2. */
let snapshot: YtdlpRunOptionsSnapshot = buildYtdlpRunOptionsSnapshot({ theme: 'dark' })

export function refreshYtdlpRunOptionsSnapshot(
  settings: AppSettings,
  uiLocale: AppUiLocale = 'ru'
): void {
  snapshot = buildYtdlpRunOptionsSnapshot(settings, uiLocale)
}

export function getYtdlpRunOptionsSnapshot(): YtdlpRunOptionsSnapshot {
  return snapshot
}
