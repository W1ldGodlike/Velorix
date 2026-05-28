import { BrowserWindow, app } from 'electron'
import { optimizer } from '@electron-toolkit/utils'

import { bootstrapMainApplicationHosts } from './main-application-bootstrap-hosts'
import { registerMainApplicationBootstrapIpc } from './main-application-bootstrap-ipc'
import { buildApplicationMenu } from '../menu/main-application-menu'
import { createMainApplicationWindow } from '../windows/main-window-runtime-state'

export function runMainApplicationBootstrap(): void {
  bootstrapMainApplicationHosts()
  registerMainApplicationBootstrapIpc()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('browser-window-focus', () => {
    buildApplicationMenu()
  })

  buildApplicationMenu()
  createMainApplicationWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainApplicationWindow()
    }
  })
}
