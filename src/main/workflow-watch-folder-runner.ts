import { existsSync } from 'node:fs'
import { join } from 'node:path'

import type {
  ScheduledTaskBackend,
  ScheduledTaskDocument
} from '../shared/scheduled-task-contract'
import { detectNewWatchFolderFiles } from '../shared/watch-folder-scan'
import { logInfo } from './logger-service'
import { scanWatchFolderDirectory } from './watch-folder-scan-main'
import { broadcastWorkflowWatchFolderDetected } from './workflow-watch-folder-broadcast'
import {
  getWatchFolderSeenFiles,
  setWatchFolderSeenFiles
} from './workflow-watch-folder-state'
import { enqueueWorkflowScenarioRun } from './workflow-scenario-runner'
import {
  getScheduledTask,
  getWorkflowScenario,
  listScheduledTasks
} from './workflow-registry-service'

const RUNNER_TICK_MS = 5_000

type TaskTickState = {
  lastRunMs: number
}

let runnerTimer: ReturnType<typeof setInterval> | null = null
const taskTicks = new Map<string, TaskTickState>()

function shouldRunTask(task: ScheduledTaskDocument, nowMs: number): boolean {
  const tick = taskTicks.get(task.id)
  const last = tick?.lastRunMs ?? 0
  return nowMs - last >= task.pollIntervalSec * 1000
}

function runTaskTick(task: ScheduledTaskDocument): void {
  const folder = task.watchFolderPath.trim()
  if (folder.length === 0 || !existsSync(folder)) {
    return
  }
  const scenario = getWorkflowScenario(task.scenarioId)
  if (!scenario) {
    logInfo('workflow', `watch-folder skip task=${task.id}: scenario not found ${task.scenarioId}`)
    return
  }
  const media = scanWatchFolderDirectory(folder)
  const seen = getWatchFolderSeenFiles(task.id)
  const { newFiles, nextSeen } = detectNewWatchFolderFiles(media, seen)
  setWatchFolderSeenFiles(task.id, nextSeen)
  for (const file of newFiles) {
    const filePath = join(folder, file.fileName)
    const payload = {
      taskId: task.id,
      taskTitle: task.title,
      scenarioId: task.scenarioId,
      filePath,
      detectedAtUtc: new Date().toISOString()
    }
    logInfo(
      'workflow',
      `watch-folder detected task=${task.id} file=${file.fileName} scenario=${task.scenarioId} nodes=${scenario.nodes.length}`
    )
    broadcastWorkflowWatchFolderDetected(payload)
    enqueueWorkflowScenarioRun(payload, scenario, task.executeScenarioOnDetect)
  }
}

function listWatchFolderTasksForBackend(backend: ScheduledTaskBackend): ScheduledTaskDocument[] {
  const out: ScheduledTaskDocument[] = []
  for (const item of listScheduledTasks()) {
    if (!item.enabled || item.backend !== backend || item.trigger !== 'watch-folder') {
      continue
    }
    const full = getScheduledTask(item.id)
    if (full) {
      out.push(full)
    }
  }
  return out
}

function runnerTickForBackend(backend: ScheduledTaskBackend, respectPollInterval: boolean): void {
  const nowMs = Date.now()
  for (const full of listWatchFolderTasksForBackend(backend)) {
    if (respectPollInterval && !shouldRunTask(full, nowMs)) {
      continue
    }
    taskTicks.set(full.id, { lastRunMs: nowMs })
    runTaskTick(full)
  }
}

function runnerTick(): void {
  runnerTickForBackend('in-app', true)
}

/** §10 — один проход для Task Scheduler (приложение стартует с `--workflow-watch-folder-tick`). */
export function runWorkflowWatchFolderHeadlessTick(): void {
  runnerTickForBackend('windows-task-scheduler', false)
}

/** §10 — in-app мониторинг папок (poll по `pollIntervalSec`). */
export function startWorkflowWatchFolderRunner(): void {
  if (runnerTimer !== null) {
    return
  }
  runnerTimer = setInterval(() => {
    try {
      runnerTick()
    } catch (err) {
      logInfo('workflow', `watch-folder tick error: ${String(err)}`)
    }
  }, RUNNER_TICK_MS)
  logInfo('workflow', `watch-folder runner started (tick ${RUNNER_TICK_MS}ms)`)
}

export function stopWorkflowWatchFolderRunner(): void {
  if (runnerTimer !== null) {
    clearInterval(runnerTimer)
    runnerTimer = null
  }
}
