import { execFile } from 'node:child_process'
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { WORKFLOW_CLI_WATCH_FOLDER_TICK } from '../../../shared/workflow-cli-args'
import type { ScheduledTaskDocument } from '../../../shared/scheduled-task-contract'
import { isNativeMainMacos } from '../../../shared/native-main-platform'
import { logInfo } from '../../core/logger-service'

const execFileAsync = promisify(execFile)

export function macosLaunchAgentLabel(taskId: string): string {
  return `com.velorix.watch.${taskId}`
}

export function macosLaunchAgentPlistPath(label: string): string {
  return join(homedir(), 'Library', 'LaunchAgents', `${label}.plist`)
}

export function escapeLaunchdPlistXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildMacosLaunchAgentPlist(doc: ScheduledTaskDocument): string {
  const label = macosLaunchAgentLabel(doc.id)
  const interval = Math.max(15, Math.min(86_400, Math.round(doc.pollIntervalSec)))
  const exe = process.execPath
  const logDir = join(homedir(), 'Library', 'Logs', 'VELORIX')
  const outLog = join(logDir, `watch-${doc.id}.log`)
  const errLog = join(logDir, `watch-${doc.id}.err.log`)
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${escapeLaunchdPlistXml(label)}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${escapeLaunchdPlistXml(exe)}</string>
    <string>${WORKFLOW_CLI_WATCH_FOLDER_TICK}</string>
  </array>
  <key>StartInterval</key>
  <integer>${interval}</integer>
  <key>RunAtLoad</key>
  <false/>
  <key>StandardOutPath</key>
  <string>${escapeLaunchdPlistXml(outLog)}</string>
  <key>StandardErrorPath</key>
  <string>${escapeLaunchdPlistXml(errLog)}</string>
</dict>
</plist>
`
}

function launchAgentsDir(): string {
  return join(homedir(), 'Library', 'LaunchAgents')
}

function guiDomain(): string {
  const uid = process.getuid?.()
  return uid !== undefined ? `gui/${uid}` : 'gui/501'
}

async function runLaunchctl(args: string[]): Promise<void> {
  await execFileAsync('launchctl', args)
}

async function bootoutLaunchAgent(label: string): Promise<void> {
  try {
    await runLaunchctl(['bootout', `${guiDomain()}/${label}`])
    logInfo('workflow', `launchd bootout ${label}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('No such process') || msg.includes('Could not find')) {
      return
    }
    logInfo('workflow', `launchd bootout ${label}: ${msg}`)
  }
}

export async function deleteMacosLaunchdTask(taskId: string): Promise<void> {
  if (!isNativeMainMacos()) {
    return
  }
  const label = macosLaunchAgentLabel(taskId)
  await bootoutLaunchAgent(label)
  const path = macosLaunchAgentPlistPath(label)
  if (existsSync(path)) {
    unlinkSync(path)
    logInfo('workflow', `launchd plist removed ${path}`)
  }
}

export async function syncMacosLaunchdTask(
  doc: ScheduledTaskDocument
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isNativeMainMacos()) {
    return { ok: true }
  }
  const label = macosLaunchAgentLabel(doc.id)
  if (doc.backend !== 'macos-launchd' || !doc.enabled) {
    await deleteMacosLaunchdTask(doc.id)
    return { ok: true }
  }
  const interval = Math.max(15, Math.min(86_400, Math.round(doc.pollIntervalSec)))
  try {
    mkdirSync(launchAgentsDir(), { recursive: true })
    mkdirSync(join(homedir(), 'Library', 'Logs', 'VELORIX'), { recursive: true })
    const plistPath = macosLaunchAgentPlistPath(label)
    await bootoutLaunchAgent(label)
    writeFileSync(plistPath, buildMacosLaunchAgentPlist(doc), 'utf8')
    await runLaunchctl(['bootstrap', guiDomain(), plistPath])
    logInfo('workflow', `launchd synced ${label} every ${interval}s`)
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logInfo('workflow', `launchd sync failed ${label}: ${msg}`)
    return { ok: false, error: msg }
  }
}

export async function resyncAllMacosLaunchdTasks(
  tasks: readonly ScheduledTaskDocument[]
): Promise<void> {
  if (!isNativeMainMacos()) {
    return
  }
  for (const task of tasks) {
    if (task.backend === 'macos-launchd') {
      await syncMacosLaunchdTask(task)
    }
  }
}
