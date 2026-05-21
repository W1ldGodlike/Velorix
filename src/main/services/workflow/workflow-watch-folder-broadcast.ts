import { BrowserWindow } from 'electron'

import { mainWindowIpc as mw } from '../../../shared/ipc-channels'
import type {
  WorkflowWatchFolderDetectedPayload,
  WorkflowWatchFolderRunFinishedPayload
} from '../../../shared/workflow-watch-folder-contract'

export function broadcastWorkflowWatchFolderDetected(
  payload: WorkflowWatchFolderDetectedPayload
): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (win.isDestroyed()) {
      continue
    }
    win.webContents.send(mw.workflowWatchFolderDetected, payload)
  }
}

export function broadcastWorkflowWatchFolderRunFinished(
  payload: WorkflowWatchFolderRunFinishedPayload
): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (win.isDestroyed()) {
      continue
    }
    win.webContents.send(mw.workflowWatchFolderRunFinished, payload)
  }
}
