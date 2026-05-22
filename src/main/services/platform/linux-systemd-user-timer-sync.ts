import { execFile } from 'node:child_process'
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { WORKFLOW_CLI_WATCH_FOLDER_TICK } from '../../../shared/workflow-cli-args'
import type { ScheduledTaskDocument } from '../../../shared/scheduled-task-contract'
import { isNativeMainLinux } from '../../../shared/native-main-platform'
import { logInfo } from '../../core/logger-service'

const execFileAsync = promisify(execFile)

export function linuxSystemdWatchUnitBase(taskId: string): string {
  return `VELORIX-watch-${taskId}`
}

export function linuxSystemdUserUnitDir(): string {
  return join(homedir(), '.config', 'systemd', 'user')
}

export function linuxSystemdServiceUnitPath(taskId: string): string {
  return join(linuxSystemdUserUnitDir(), `${linuxSystemdWatchUnitBase(taskId)}.service`)
}

export function linuxSystemdTimerUnitPath(taskId: string): string {
  return join(linuxSystemdUserUnitDir(), `${linuxSystemdWatchUnitBase(taskId)}.timer`)
}

function quoteSystemdPath(path: string): string {
  if (!/[ "'\\]/.test(path)) {
    return path
  }
  return `"${path.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

export function buildLinuxSystemdServiceUnit(doc: ScheduledTaskDocument): string {
  const exe = quoteSystemdPath(process.execPath)
  return `[Unit]
Description=Velorix watch-folder tick (${doc.id})

[Service]
Type=oneshot
ExecStart=${exe} ${WORKFLOW_CLI_WATCH_FOLDER_TICK}

[Install]
WantedBy=default.target
`
}

export function buildLinuxSystemdTimerUnit(doc: ScheduledTaskDocument): string {
  const base = linuxSystemdWatchUnitBase(doc.id)
  const interval = Math.max(15, Math.min(86_400, Math.round(doc.pollIntervalSec)))
  return `[Unit]
Description=Velorix watch-folder timer (${doc.id})

[Timer]
OnBootSec=30
OnUnitActiveSec=${interval}s
AccuracySec=1s
Unit=${base}.service

[Install]
WantedBy=timers.target
`
}

async function runSystemctlUser(args: string[]): Promise<void> {
  await execFileAsync('systemctl', ['--user', ...args])
}

async function stopLinuxSystemdWatchTimer(taskId: string): Promise<void> {
  const base = linuxSystemdWatchUnitBase(taskId)
  try {
    await runSystemctlUser(['stop', `${base}.timer`])
  } catch {
    // timer may not exist
  }
  try {
    await runSystemctlUser(['disable', `${base}.timer`])
  } catch {
    // ignore
  }
}

export async function deleteLinuxSystemdUserTimer(taskId: string): Promise<void> {
  if (!isNativeMainLinux()) {
    return
  }
  await stopLinuxSystemdWatchTimer(taskId)
  const servicePath = linuxSystemdServiceUnitPath(taskId)
  const timerPath = linuxSystemdTimerUnitPath(taskId)
  if (existsSync(servicePath)) {
    unlinkSync(servicePath)
  }
  if (existsSync(timerPath)) {
    unlinkSync(timerPath)
  }
  try {
    await runSystemctlUser(['daemon-reload'])
    logInfo('workflow', `systemd user units removed for ${taskId}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logInfo('workflow', `systemd daemon-reload after delete ${taskId}: ${msg}`)
  }
}

export async function syncLinuxSystemdUserTimer(
  doc: ScheduledTaskDocument
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isNativeMainLinux()) {
    return { ok: true }
  }
  if (doc.backend !== 'linux-systemd-user-timer' || !doc.enabled) {
    await deleteLinuxSystemdUserTimer(doc.id)
    return { ok: true }
  }
  const base = linuxSystemdWatchUnitBase(doc.id)
  const interval = Math.max(15, Math.min(86_400, Math.round(doc.pollIntervalSec)))
  try {
    mkdirSync(linuxSystemdUserUnitDir(), { recursive: true })
    await stopLinuxSystemdWatchTimer(doc.id)
    writeFileSync(linuxSystemdServiceUnitPath(doc.id), buildLinuxSystemdServiceUnit(doc), 'utf8')
    writeFileSync(linuxSystemdTimerUnitPath(doc.id), buildLinuxSystemdTimerUnit(doc), 'utf8')
    await runSystemctlUser(['daemon-reload'])
    await runSystemctlUser(['enable', '--now', `${base}.timer`])
    logInfo('workflow', `systemd user timer synced ${base}.timer every ${interval}s`)
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logInfo('workflow', `systemd sync failed ${base}: ${msg}`)
    return { ok: false, error: msg }
  }
}

export async function resyncAllLinuxSystemdUserTimers(
  tasks: readonly ScheduledTaskDocument[]
): Promise<void> {
  if (!isNativeMainLinux()) {
    return
  }
  for (const task of tasks) {
    if (task.backend === 'linux-systemd-user-timer') {
      await syncLinuxSystemdUserTimer(task)
    }
  }
}
