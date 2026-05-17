import { app } from 'electron'

import { resolveAppPaths } from './app-paths'
import { setDownloadsLogSink } from './downloads-log-ipc'
import {
  broadcastDownloadsLogPayload,
  broadcastDownloadsSnapshot
} from './downloads-window-runtime'
import { setDownloadsRunnerNotifier } from './downloads-queue-runner'
import { registerDownloadsBridgeIpcHandlers } from './register-downloads-bridge-ipc'
import { registerDownloadsOptionsIpcHandlers } from './register-downloads-options-ipc'
import { registerDownloadsQueueIpcHandlers } from './register-downloads-queue-ipc'
import { registerDownloadsRunnerIpcHandlers } from './register-downloads-runner-ipc'
import { registerDownloadsSnapshotIpcHandlers } from './register-downloads-snapshot-ipc'
import {
  attachDownloadsQueuePersistOnQuitOnce,
  hydrateDownloadsQueueFromDisk
} from './ytdlp-download-queue-persist'

let ipcRegistered = false

export function registerDownloadsWindowIpcHandlers(): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  const pathsBoot = resolveAppPaths()
  hydrateDownloadsQueueFromDisk(pathsBoot.userData)
  attachDownloadsQueuePersistOnQuitOnce(app)

  setDownloadsRunnerNotifier(() => {
    broadcastDownloadsSnapshot()
  })
  setDownloadsLogSink(broadcastDownloadsLogPayload)

  registerDownloadsSnapshotIpcHandlers()
  registerDownloadsOptionsIpcHandlers()
  registerDownloadsQueueIpcHandlers()
  registerDownloadsRunnerIpcHandlers()
  registerDownloadsBridgeIpcHandlers()
}
