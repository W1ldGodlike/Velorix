import { appendUrlsFromMultilineBlock } from '../services/downloads/downloads-queue'
import type { AppUiLocale } from '../../shared/app-ui-locale'
import { syncBrowserWindowTitlesToLocale } from './window-title-locale'
import { broadcastDownloadsSnapshot } from './downloads-window-runtime'
import { mainWindowRef } from './main-window-runtime-state'
import { mainWindowIpc as mw } from '../../shared/ipc-channels'
export {
  configureDownloadsWindowBoundsHooks,
  broadcastDownloadsSnapshot,
  broadcastDownloadsCliOptionsChanged,
  broadcastDownloadsOutputDirectorySnapshot,
  DOWNLOADS_QUEUE_SNAPSHOT_CHANNEL
} from './downloads-window-runtime'
export { registerDownloadsWindowIpcHandlers } from '../ipc/downloads/register-downloads-window-ipc'

/** Синхронизировать locale для downloads UI: renderer слушает `uiLocaleChanged`. */
export function syncDownloadsWindowLocale(resolvedLocale: AppUiLocale): void {
  syncBrowserWindowTitlesToLocale(resolvedLocale)
}

/**
 * Variant A: route `Загрузки` — единственная целевая поверхность.
 * Непустой `mergeText` добавляет распознанные URL-строки в очередь и затем фокусирует main shell.
 */
export function focusOrCreateDownloadsWindow(
  mergeText?: string | null,
  uiLocale?: AppUiLocale
): void {
  const chunk = mergeText?.trim() ?? ''
  if (chunk.length > 0) {
    appendUrlsFromMultilineBlock(chunk)
  }
  if (uiLocale !== undefined) {
    syncDownloadsWindowLocale(uiLocale)
  }
  const target = mainWindowRef && !mainWindowRef.isDestroyed() ? mainWindowRef : null
  if (!target) {
    return
  }
  target.show()
  target.focus()
  target.webContents.send(mw.openDownloadsRoute)
  broadcastDownloadsSnapshot()
}
