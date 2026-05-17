import { BrowserWindow, Menu } from 'electron'

import {
  configureMainApplicationMenu,
  requireMainApplicationMenuDeps
} from './main-application-menu-deps'
import { buildApplicationMenuTemplate } from './main-application-menu-template'

export type { MainApplicationMenuDeps } from './main-application-menu-types'
export { configureMainApplicationMenu }

export function buildApplicationMenu(): void {
  const d = requireMainApplicationMenuDeps()
  const win = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0] ?? undefined
  const menu = Menu.buildFromTemplate(buildApplicationMenuTemplate(d))
  Menu.setApplicationMenu(menu)
  if (win && !win.isDestroyed()) {
    win.setMenuBarVisibility(true)
  }
}
