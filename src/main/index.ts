import { app } from 'electron'

import { configurePortableAppDataPaths } from './app-data-root'
import { attachProcessErrorHandlers } from './logger-service'
import { runMainApplicationBootstrap } from './main-application-bootstrap'
import { runWorkflowHeadlessTickIfRequested } from './workflow-headless-bootstrap'
import { runWindowsExplorerShellHeadlessCliIfRequested } from './windows-explorer-shell-headless-cli'
import { captureWindowsExplorerShellArgv } from './windows-explorer-shell-launch'
import { tryFulfillPendingWindowsExplorerShellLaunch } from './windows-explorer-shell-launch-schedule'
import { registerFluxMediaPrivileges } from './media-protocol'
import { registerFluxHelpPrivileges } from './help-assets-protocol'
import { isNativeMainQuitOnLastWindowClosed } from './platform'

/** Все runtime-данные — в `<installRoot>/app-data`, не в %AppData%. */
configurePortableAppDataPaths()

attachProcessErrorHandlers()
registerFluxMediaPrivileges()
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
