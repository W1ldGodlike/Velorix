import { BrowserWindow } from 'electron'

import type { AppUiLocale } from '../../shared/app-ui-locale'
import {
  getDownloadsPopoutWindowTitle,
  getInspectorWindowTitle,
  getMainWindowTitle
} from '../../shared/app-ui-locale'
import { isDownloadsWindow } from './downloads-window-runtime'
import { isInspectorWindow } from './inspector-window'

/** §2.2 — обновить заголовки всех окон после смены `uiLocale` (без reload). */
export function syncBrowserWindowTitlesToLocale(locale: AppUiLocale): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (win.isDestroyed()) {
      continue
    }
    if (isInspectorWindow(win)) {
      win.setTitle(getInspectorWindowTitle(locale))
    } else if (isDownloadsWindow(win)) {
      win.setTitle(getDownloadsPopoutWindowTitle(locale))
    } else {
      win.setTitle(getMainWindowTitle(locale))
    }
  }
}
