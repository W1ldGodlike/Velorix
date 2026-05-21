import type { BrowserWindow } from 'electron'

let getMainWindow: () => BrowserWindow | null = () => null

/** Wired from `main-window-runtime-state` when the main window is created. */
export function setMainWindowFocusAccessor(accessor: () => BrowserWindow | null): void {
  getMainWindow = accessor
}

/** §4.3 — restore/focus main window from Mini Player. */
export function focusMainBrowserWindow(): void {
  const win = getMainWindow()
  if (!win || win.isDestroyed()) {
    return
  }
  if (!win.isVisible()) {
    win.show()
  }
  if (win.isMinimized()) {
    win.restore()
  }
  win.focus()
}
