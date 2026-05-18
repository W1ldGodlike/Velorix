import { BrowserWindow, app } from 'electron'
import { optimizer } from '@electron-toolkit/utils'

import { bootstrapMainApplicationHosts } from './main-application-bootstrap-hosts'
import { registerMainApplicationBootstrapIpc } from './main-application-bootstrap-ipc'
import { buildApplicationMenu } from './main-application-menu'
import { createMainApplicationWindow } from './main-window-runtime-state'
import { onProcessingHistoryChanged } from './processing-history'
import { broadcastProcessingHistoryChanged } from './processing-history-broadcast'

export function runMainApplicationBootstrap(): void {
  bootstrapMainApplicationHosts()
  onProcessingHistoryChanged(() => {
    broadcastProcessingHistoryChanged()
  })
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
