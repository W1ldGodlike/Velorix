import { BrowserWindow } from 'electron'

import type { AppUiLocale } from '../../shared/app-ui-locale'
import { getMainWindowTitle } from '../../shared/app-ui-locale'

/** §2.2 — обновить заголовки всех окон после смены `uiLocale` (без reload). */
export function syncBrowserWindowTitlesToLocale(locale: AppUiLocale): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (win.isDestroyed()) {
      continue
    }
    win.setTitle(getMainWindowTitle(locale))
  }
}
