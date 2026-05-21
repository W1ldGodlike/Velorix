import { existsSync } from 'node:fs'

import type { WindowsExplorerShellLaunchMode } from '../../../shared/windows-explorer-context-menu'
import { parseWindowsExplorerShellArgv } from '../../../shared/windows-explorer-context-menu'
import { logInfo } from '../../core/logger-service'

let pending: { mode: WindowsExplorerShellLaunchMode; filePath: string } | null = null

export function captureWindowsExplorerShellArgv(argv: readonly string[] = process.argv): void {
  const intent = parseWindowsExplorerShellArgv(argv)
  if (intent) {
    pending = intent
    logInfo('shell', `pending explorer launch mode=${intent.mode} file=${intent.filePath}`)
  }
}

export function consumePendingWindowsExplorerShellLaunch(): {
  mode: WindowsExplorerShellLaunchMode
  filePath: string
} | null {
  const next = pending
  pending = null
  return next
}

export function peekPendingWindowsExplorerShellLaunch(): {
  mode: WindowsExplorerShellLaunchMode
  filePath: string
} | null {
  if (!pending) {
    return null
  }
  if (!existsSync(pending.filePath)) {
    pending = null
    return null
  }
  return pending
}
