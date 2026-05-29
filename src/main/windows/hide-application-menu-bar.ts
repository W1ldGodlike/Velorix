import { BrowserWindow, Menu } from 'electron'

/** UI ZERO: без нативного menu bar (команды — в NEON shell после rebuild). */
export function hideApplicationMenuBar(): void {
  Menu.setApplicationMenu(null)
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) {
      win.setMenuBarVisibility(false)
    }
  }
}
