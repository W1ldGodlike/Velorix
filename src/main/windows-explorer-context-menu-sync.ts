import { execFile } from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'

import {
  buildWindowsExplorerContextMenuCommand,
  WINDOWS_EXPLORER_CONTEXT_MENU_SHELL_OPEN,
  WINDOWS_EXPLORER_CONTEXT_MENU_SHELL_QUICK_MP4,
  WINDOWS_EXPLORER_VIDEO_EXTENSIONS,
  windowsExplorerContextMenuAssociationBase
} from '../shared/windows-explorer-context-menu'
import { isNativeMainWindows } from '../shared/native-main-platform'
import { logInfo } from './logger-service'

const execFileAsync = promisify(execFile)

function regExe(): string {
  return join(process.env['SystemRoot'] ?? 'C:\\Windows', 'System32', 'reg.exe')
}

async function runReg(args: string[]): Promise<void> {
  await execFileAsync(regExe(), args, { windowsHide: true })
}

function shellKey(ext: string, shellName: string): string {
  return `${windowsExplorerContextMenuAssociationBase(ext)}\\${shellName}`
}

async function regKeyExists(key: string): Promise<boolean> {
  try {
    await runReg(['query', `HKCU\\${key}`])
    return true
  } catch {
    return false
  }
}

export async function isWindowsExplorerContextMenuRegistered(): Promise<boolean> {
  if (!isNativeMainWindows()) {
    return false
  }
  return regKeyExists(shellKey('.mp4', WINDOWS_EXPLORER_CONTEXT_MENU_SHELL_OPEN))
}

export async function registerWindowsExplorerContextMenu(
  exePath: string,
  labels: { open: string; quickMp4: string }
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isNativeMainWindows()) {
    return { ok: true }
  }
  try {
    for (const ext of WINDOWS_EXPLORER_VIDEO_EXTENSIONS) {
      const openKey = shellKey(ext, WINDOWS_EXPLORER_CONTEXT_MENU_SHELL_OPEN)
      const quickKey = shellKey(ext, WINDOWS_EXPLORER_CONTEXT_MENU_SHELL_QUICK_MP4)
      await runReg(['add', `HKCU\\${openKey}`, '/ve', '/d', labels.open, '/f'])
      await runReg([
        'add',
        `HKCU\\${openKey}\\command`,
        '/ve',
        '/d',
        buildWindowsExplorerContextMenuCommand(exePath, 'open'),
        '/f'
      ])
      await runReg(['add', `HKCU\\${quickKey}`, '/ve', '/d', labels.quickMp4, '/f'])
      await runReg([
        'add',
        `HKCU\\${quickKey}\\command`,
        '/ve',
        '/d',
        buildWindowsExplorerContextMenuCommand(exePath, 'quick-mp4'),
        '/f'
      ])
    }
    logInfo('shell', 'explorer context menu registered')
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logInfo('shell', `explorer context menu register failed: ${msg}`)
    return { ok: false, error: msg }
  }
}

export async function unregisterWindowsExplorerContextMenu(): Promise<void> {
  if (!isNativeMainWindows()) {
    return
  }
  for (const ext of WINDOWS_EXPLORER_VIDEO_EXTENSIONS) {
    for (const shellName of [
      WINDOWS_EXPLORER_CONTEXT_MENU_SHELL_OPEN,
      WINDOWS_EXPLORER_CONTEXT_MENU_SHELL_QUICK_MP4
    ]) {
      const key = shellKey(ext, shellName)
      try {
        await runReg(['delete', `HKCU\\${key}`, '/f'])
      } catch {
        /* already removed */
      }
    }
  }
  logInfo('shell', 'explorer context menu unregistered')
}

export async function syncWindowsExplorerContextMenuEnabled(
  enabled: boolean,
  labels: { open: string; quickMp4: string }
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!enabled) {
    await unregisterWindowsExplorerContextMenu()
    return { ok: true }
  }
  return registerWindowsExplorerContextMenu(process.execPath, labels)
}
