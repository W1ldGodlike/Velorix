import { BrowserWindow, Menu } from 'electron'

import { configureMainApplicationMenu } from './main-application-menu-deps'

export { configureMainApplicationMenu }

/** UI ZERO / NEON: refs 1–27 без нативного menu bar (команды — Ctrl+K, контекст в shell). */
export function buildApplicationMenu(): void {
  Menu.setApplicationMenu(null)
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) {
      win.setMenuBarVisibility(false)
    }
  }
}
