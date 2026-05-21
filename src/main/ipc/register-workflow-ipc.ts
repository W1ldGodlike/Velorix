import { BrowserWindow, dialog, ipcMain } from 'electron'

import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import type { WorkflowScenarioDocument } from '../../shared/workflow-scenario-contract'
import { parseWorkflowScenarioDocument } from '../../shared/workflow-scenario-parse'
import { parseScheduledTaskDocument } from '../../shared/scheduled-task-parse'
import { runWorkflowScenarioOnFile } from '../services/workflow/workflow-run-scenario-on-file'
import { runWorkflowScenarioOnUrl } from '../services/workflow/workflow-run-scenario-on-url'
import { clearWatchFolderTaskState } from '../services/workflow/workflow-watch-folder-state'
import {
  isNativeMainLinux,
  isNativeMainMacos,
  isNativeMainWindows
} from '../../shared/native-main-platform'
import {
  deleteScheduledTask,
  deleteWorkflowScenario,
  getScheduledTask,
  getWorkflowScenario,
  listScheduledTasks,
  listWorkflowScenarios,
  saveScheduledTask,
  saveWorkflowScenario,
  setScheduledTaskEnabled
} from '../services/workflow/workflow-registry-service'
import {
  deleteScheduledTaskOsSchedulers,
  syncScheduledTaskOsScheduler
} from '../services/platform/scheduled-task-os-sync'

let ipcRegistered = false

function resolveDialogParent(): BrowserWindow | undefined {
  const focused = BrowserWindow.getFocusedWindow()
  if (focused && !focused.isDestroyed()) {
    return focused
  }
  const wins = BrowserWindow.getAllWindows()
  return wins.find((w) => !w.isDestroyed())
}

export function registerWorkflowIpcHandlers(): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  ipcMain.handle(mw.workflowScenariosList, () => {
    return { ok: true as const, items: listWorkflowScenarios() }
  })

  ipcMain.handle(mw.workflowScenariosGet, (_event, rawId: unknown) => {
    const id = typeof rawId === 'string' ? rawId.trim() : ''
    if (!id) {
      return { ok: false as const, error: 'bad-id' }
    }
    const doc = getWorkflowScenario(id)
    if (!doc) {
      return { ok: false as const, error: 'not-found' }
    }
    return { ok: true as const, scenario: doc }
  })

  ipcMain.handle(mw.workflowScenariosSave, (_event, raw: unknown) => {
    const doc = parseWorkflowScenarioDocument(raw)
    if (!doc) {
      return { ok: false as const, error: 'invalid-scenario' }
    }
    saveWorkflowScenario(doc)
    return { ok: true as const, scenario: doc }
  })

  ipcMain.handle(mw.workflowScenariosDelete, (_event, rawId: unknown) => {
    const id = typeof rawId === 'string' ? rawId.trim() : ''
    if (!id) {
      return { ok: false as const, error: 'bad-id' }
    }
    const removed = deleteWorkflowScenario(id)
    return removed ? { ok: true as const } : { ok: false as const, error: 'not-found' }
  })

  ipcMain.handle(mw.workflowCapabilities, () => {
    return {
      ok: true as const,
      windowsTaskScheduler: isNativeMainWindows(),
      macosLaunchd: isNativeMainMacos(),
      linuxSystemdUserTimer: isNativeMainLinux()
    }
  })

  ipcMain.handle(mw.scheduledTasksList, () => {
    return { ok: true as const, items: listScheduledTasks() }
  })

  ipcMain.handle(mw.scheduledTasksSave, async (_event, raw: unknown) => {
    const doc = parseScheduledTaskDocument(raw)
    if (!doc) {
      return { ok: false as const, error: 'invalid-task' }
    }
    if (doc.trigger !== 'watch-folder') {
      return { ok: false as const, error: 'unsupported-trigger' }
    }
    if (!getWorkflowScenario(doc.scenarioId)) {
      return { ok: false as const, error: 'scenario-not-found' }
    }
    saveScheduledTask(doc)
    const sync = await syncScheduledTaskOsScheduler(doc)
    return {
      ok: true as const,
      task: doc,
      ...(sync.ok ? {} : { osSchedulerWarning: sync.error })
    }
  })

  ipcMain.handle(mw.scheduledTasksDelete, async (_event, rawId: unknown) => {
    const id = typeof rawId === 'string' ? rawId.trim() : ''
    if (!id) {
      return { ok: false as const, error: 'bad-id' }
    }
    const removed = deleteScheduledTask(id)
    if (removed) {
      clearWatchFolderTaskState(id)
      await deleteScheduledTaskOsSchedulers(id)
    }
    return removed ? { ok: true as const } : { ok: false as const, error: 'not-found' }
  })

  ipcMain.handle(
    mw.scheduledTasksSetEnabled,
    async (_event, rawId: unknown, rawEnabled: unknown) => {
      const id = typeof rawId === 'string' ? rawId.trim() : ''
      if (!id || typeof rawEnabled !== 'boolean') {
        return { ok: false as const, error: 'bad-args' }
      }
      const updated = setScheduledTaskEnabled(id, rawEnabled)
      if (!updated) {
        return { ok: false as const, error: 'not-found' }
      }
      const task = getScheduledTask(id)
      if (task) {
        const sync = await syncScheduledTaskOsScheduler(task)
        return sync.ok
          ? { ok: true as const }
          : { ok: true as const, osSchedulerWarning: sync.error }
      }
      return { ok: true as const }
    }
  )

  ipcMain.handle(
    mw.workflowRunScenarioOnFile,
    (_event, rawScenarioId: unknown, rawFilePath: unknown, rawTaskTitle: unknown) => {
      return runWorkflowScenarioOnFile(rawScenarioId, rawFilePath, rawTaskTitle)
    }
  )

  ipcMain.handle(
    mw.workflowRunScenarioOnUrl,
    (_event, rawScenarioId: unknown, rawTaskTitle: unknown) => {
      return runWorkflowScenarioOnUrl(rawScenarioId, rawTaskTitle)
    }
  )

  ipcMain.handle(mw.workflowPickWatchFolder, async () => {
    const parent = resolveDialogParent()
    const { canceled, filePaths } = parent
      ? await dialog.showOpenDialog(parent, { properties: ['openDirectory'] })
      : await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (canceled || !filePaths[0]) {
      return { ok: false as const, error: 'canceled' }
    }
    return { ok: true as const, path: filePaths[0] }
  })
}

export type WorkflowScenariosSavePayload = WorkflowScenarioDocument
