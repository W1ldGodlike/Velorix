import { app } from 'electron'

import { configurePortableAppDataPaths } from './core/app-data-root'
import { attachProcessErrorHandlers } from './core/logger-service'
import { runMainApplicationBootstrap } from './bootstrap/main-application-bootstrap'
import { runWorkflowHeadlessTickIfRequested } from './services/workflow/workflow-headless-bootstrap'
import { runWindowsExplorerShellHeadlessCliIfRequested } from './services/platform/windows-explorer-shell-headless-cli'
import { captureWindowsExplorerShellArgv } from './services/platform/windows-explorer-shell-launch'
import { tryFulfillPendingWindowsExplorerShellLaunch } from './services/platform/windows-explorer-shell-launch-schedule'
import { registervelorixmediaPrivileges } from './core/media-protocol'
import { registerFluxHelpPrivileges } from './core/help-assets-protocol'
import { isNativeMainQuitOnLastWindowClosed } from './platform/index'

/** Все runtime-данные — в `<installRoot>/app-data`, не в %AppData%. */
configurePortableAppDataPaths()

attachProcessErrorHandlers()
registervelorixmediaPrivileges()
registerFluxHelpPrivileges()

const gotSingleInstanceLock = app.requestSingleInstanceLock()

if (!gotSingleInstanceLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, argv) => {
    captureWindowsExplorerShellArgv(argv)
    void tryFulfillPendingWindowsExplorerShellLaunch()
  })

  captureWindowsExplorerShellArgv(process.argv)

  void runWorkflowHeadlessTickIfRequested().then((handled) => {
    if (handled) {
      return
    }
    void runWindowsExplorerShellHeadlessCliIfRequested().then((handledShell) => {
      if (handledShell) {
        return
      }
      app.whenReady().then(() => {
        runMainApplicationBootstrap()
      })
    })
  })
}

app.on('window-all-closed', () => {
  if (isNativeMainQuitOnLastWindowClosed()) {
    app.quit()
  }
})
