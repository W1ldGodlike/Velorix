import type { ScheduledTaskDocument } from '../../../shared/scheduled-task-contract'
import {
  deleteLinuxSystemdUserTimer,
  resyncAllLinuxSystemdUserTimers,
  syncLinuxSystemdUserTimer
} from './linux-systemd-user-timer-sync'
import {
  deleteMacosLaunchdTask,
  resyncAllMacosLaunchdTasks,
  syncMacosLaunchdTask
} from './macos-launchd-sync'
import {
  deleteWindowsScheduledTask,
  resyncAllWindowsScheduledTasks,
  syncWindowsScheduledTask
} from './windows-task-scheduler-sync'

/** §10 — синхронизация OS-планировщика для текущей платформы. */
export async function syncScheduledTaskOsScheduler(
  doc: ScheduledTaskDocument
): Promise<{ ok: true } | { ok: false; error: string }> {
  const win = await syncWindowsScheduledTask(doc)
  if (!win.ok) {
    return win
  }
  const mac = await syncMacosLaunchdTask(doc)
  if (!mac.ok) {
    return mac
  }
  return syncLinuxSystemdUserTimer(doc)
}

export async function deleteScheduledTaskOsSchedulers(taskId: string): Promise<void> {
  await deleteWindowsScheduledTask(taskId)
  await deleteMacosLaunchdTask(taskId)
  await deleteLinuxSystemdUserTimer(taskId)
}

export async function resyncAllScheduledTaskOsSchedulers(
  tasks: readonly ScheduledTaskDocument[]
): Promise<void> {
  await resyncAllWindowsScheduledTasks(tasks)
  await resyncAllMacosLaunchdTasks(tasks)
  await resyncAllLinuxSystemdUserTimers(tasks)
}
