import { execFile } from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { WORKFLOW_CLI_WATCH_FOLDER_TICK } from '../../../shared/workflow-cli-args'
import type { ScheduledTaskDocument } from '../../../shared/scheduled-task-contract'
import { isNativeMainWindows } from '../../../shared/native-main-platform'
import { logInfo } from '../../core/logger-service'

const execFileAsync = promisify(execFile)

const SCHTASKS_FOLDER = '\\FluxAlloy'

export function windowsScheduledTaskName(taskId: string): string {
  return `${SCHTASKS_FOLDER}\\watch-${taskId}`
}

function schtasksExe(): string {
  return join(process.env['SystemRoot'] ?? 'C:\\Windows', 'System32', 'schtasks.exe')
}

function pollIntervalMinutes(pollIntervalSec: number): number {
  return Math.max(1, Math.round(pollIntervalSec / 60))
}

function buildTaskRunLine(): string {
  const exe = process.execPath
  return `"${exe}" ${WORKFLOW_CLI_WATCH_FOLDER_TICK}`
}

async function runSchtasks(args: string[]): Promise<void> {
  await execFileAsync(schtasksExe(), args, { windowsHide: true })
}

export async function deleteWindowsScheduledTask(taskId: string): Promise<void> {
  if (!isNativeMainWindows()) {
    return
  }
  const tn = windowsScheduledTaskName(taskId)
  try {
    await runSchtasks(['/Delete', '/F', '/TN', tn])
    logInfo('workflow', `schtasks deleted ${tn}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('cannot find') || msg.includes('не удается найти')) {
      return
    }
    logInfo('workflow', `schtasks delete failed ${tn}: ${msg}`)
  }
}

export async function syncWindowsScheduledTask(
  doc: ScheduledTaskDocument
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isNativeMainWindows()) {
    return { ok: true }
  }
  const tn = windowsScheduledTaskName(doc.id)
  if (doc.backend !== 'windows-task-scheduler' || !doc.enabled) {
    await deleteWindowsScheduledTask(doc.id)
    return { ok: true }
  }
  const mo = pollIntervalMinutes(doc.pollIntervalSec)
  try {
    await runSchtasks([
      '/Create',
      '/F',
      '/TN',
      tn,
      '/TR',
      buildTaskRunLine(),
      '/SC',
      'MINUTE',
      '/MO',
      String(mo)
    ])
    logInfo('workflow', `schtasks synced ${tn} every ${mo} min`)
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logInfo('workflow', `schtasks create failed ${tn}: ${msg}`)
    return { ok: false, error: msg }
  }
}

export async function resyncAllWindowsScheduledTasks(
  tasks: readonly ScheduledTaskDocument[]
): Promise<void> {
  if (!isNativeMainWindows()) {
    return
  }
  for (const task of tasks) {
    if (task.backend === 'windows-task-scheduler') {
      await syncWindowsScheduledTask(task)
    }
  }
}
