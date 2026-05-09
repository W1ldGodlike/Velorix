import {
  buildYtdlpRunOptionsSnapshot,
  type YtdlpRunOptionsSnapshot
} from './ytdlp-download-options'
import type { AppSettings } from './settings-store'

/** Копия опций yt-dlp для runner без доступа к `cachedSettings` в index §6.2. */
let snapshot: YtdlpRunOptionsSnapshot = buildYtdlpRunOptionsSnapshot({ theme: 'dark' })

export function refreshYtdlpRunOptionsSnapshot(settings: AppSettings): void {
  snapshot = buildYtdlpRunOptionsSnapshot(settings)
}

export function getYtdlpRunOptionsSnapshot(): YtdlpRunOptionsSnapshot {
  return snapshot
}
