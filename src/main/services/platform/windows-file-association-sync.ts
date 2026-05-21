import { basename } from 'node:path'
import { execFile } from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'

import {
  buildWindowsFileAssociationOpenCommand,
  WINDOWS_FILE_ASSOCIATION_PROG_ID,
  WINDOWS_FILE_ASSOCIATION_VIDEO_EXTENSIONS,
  windowsFileAssociationApplicationKey,
  windowsFileAssociationOpenWithProgidsKey,
  windowsFileAssociationProgIdKey
} from '../../../shared/windows-file-association'
import { isNativeMainWindows } from '../../../shared/native-main-platform'
import { logInfo } from '../../core/logger-service'

const execFileAsync = promisify(execFile)

function regExe(): string {
  return join(process.env['SystemRoot'] ?? 'C:\\Windows', 'System32', 'reg.exe')
}

async function runReg(args: string[]): Promise<void> {
  await execFileAsync(regExe(), args, { windowsHide: true })
}

async function regKeyExists(key: string): Promise<boolean> {
  try {
    await runReg(['query', `HKCU\\${key}`])
    return true
  } catch {
    return false
  }
}

export async function isWindowsFileAssociationRegistered(): Promise<boolean> {
  if (!isNativeMainWindows()) {
    return false
  }
  const openWith = windowsFileAssociationOpenWithProgidsKey('.mp4')
  if (!(await regKeyExists(openWith))) {
    return false
  }
  try {
    const { stdout } = await execFileAsync(regExe(), ['query', `HKCU\\${openWith}`], {
      windowsHide: true
    })
    return stdout.includes(WINDOWS_FILE_ASSOCIATION_PROG_ID)
  } catch {
    return false
  }
}

export async function registerWindowsFileAssociation(
  exePath: string,
  typeLabel: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isNativeMainWindows()) {
    return { ok: true }
  }
  const exeFileName = basename(exePath)
  const openCmd = buildWindowsFileAssociationOpenCommand(exePath)
  const progIdKey = windowsFileAssociationProgIdKey()
  const appKey = windowsFileAssociationApplicationKey(exeFileName)
  try {
    await runReg(['add', `HKCU\\${progIdKey}`, '/ve', '/d', typeLabel, '/f'])
    await runReg(['add', `HKCU\\${progIdKey}\\shell\\open\\command`, '/ve', '/d', openCmd, '/f'])
    await runReg(['add', `HKCU\\${appKey}\\shell\\open\\command`, '/ve', '/d', openCmd, '/f'])
    for (const ext of WINDOWS_FILE_ASSOCIATION_VIDEO_EXTENSIONS) {
      const openWithKey = `${windowsFileAssociationOpenWithProgidsKey(ext)}\\${WINDOWS_FILE_ASSOCIATION_PROG_ID}`
      await runReg(['add', `HKCU\\${openWithKey}`, '/ve', '/d', '', '/f'])
      await runReg(['add', `HKCU\\${appKey}\\SupportedTypes\\${ext}`, '/ve', '/d', '', '/f'])
    }
    logInfo('shell', 'file association OpenWith registered')
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logInfo('shell', `file association register failed: ${msg}`)
    return { ok: false, error: msg }
  }
}

export async function unregisterWindowsFileAssociation(exePath: string): Promise<void> {
  if (!isNativeMainWindows()) {
    return
  }
  const exeFileName = basename(exePath)
  const progIdKey = windowsFileAssociationProgIdKey()
  const appKey = windowsFileAssociationApplicationKey(exeFileName)
  for (const ext of WINDOWS_FILE_ASSOCIATION_VIDEO_EXTENSIONS) {
    const openWithValue = `${windowsFileAssociationOpenWithProgidsKey(ext)}\\${WINDOWS_FILE_ASSOCIATION_PROG_ID}`
    try {
      await runReg(['delete', `HKCU\\${openWithValue}`, '/f'])
    } catch {
      /* already removed */
    }
    try {
      await runReg(['delete', `HKCU\\${appKey}\\SupportedTypes\\${ext}`, '/f'])
    } catch {
      /* already removed */
    }
  }
  for (const key of [progIdKey, appKey]) {
    try {
      await runReg(['delete', `HKCU\\${key}`, '/f'])
    } catch {
      /* already removed */
    }
  }
  logInfo('shell', 'file association OpenWith unregistered')
}

export async function syncWindowsFileAssociationEnabled(
  enabled: boolean,
  typeLabel: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!enabled) {
    await unregisterWindowsFileAssociation(process.execPath)
    return { ok: true }
  }
  return registerWindowsFileAssociation(process.execPath, typeLabel)
}
