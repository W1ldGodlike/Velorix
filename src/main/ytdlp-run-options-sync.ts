import {
  buildYtdlpRunOptionsSnapshot,
  type YtdlpRunOptionsSnapshot
} from './ytdlp-download-options'
import type { AppSettings } from './settings-store'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'

/** Копия опций yt-dlp для runner без доступа к `cachedSettings` в index §6.2. */
let snapshot: YtdlpRunOptionsSnapshot = buildYtdlpRunOptionsSnapshot({ theme: 'dark' })

export function refreshYtdlpRunOptionsSnapshot(
  settings: AppSettings,
  uiLocale: DownloadsWindowUiLocale = 'ru'
): void {
  snapshot = buildYtdlpRunOptionsSnapshot(settings, uiLocale)
}

export function getYtdlpRunOptionsSnapshot(): YtdlpRunOptionsSnapshot {
  return snapshot
}
