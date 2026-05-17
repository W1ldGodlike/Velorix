import { mkdirSync } from 'fs'
import { shell } from 'electron'

import { resolveAppPaths } from './app-paths'
import { getActiveDownloadsRunnerRowId } from './downloads-queue-runner'
import { getDownloadsQueueSnapshot } from './downloads-queue'
import { getActiveYtdlpPauseState } from './ytdlp-download-service'
import {
  resolveAllowedYtdlpDownloadOutputFile,
  resolveYtdlpFolderRevealTarget
} from './ytdlp-download-output'
import type { DownloadsWindowIpcStrings } from '../shared/downloads-window-ipc-locale'
import { getDownloadsBoundsHooks } from './downloads-window-runtime-hooks'

type DownloadOutputOpenMode = 'file' | 'folder'

export function isDownloadOutputOpenMode(raw: unknown): raw is DownloadOutputOpenMode {
  return raw === 'file' || raw === 'folder'
}

export function resolveAllowedDownloadOutputPath(raw: unknown): string | null {
  const paths = resolveAppPaths()
  return resolveAllowedYtdlpDownloadOutputFile(raw, paths.userData)
}

export async function openDownloadOutputPath(
  rawPath: unknown,
  mode: DownloadOutputOpenMode,
  ipc: DownloadsWindowIpcStrings
): Promise<{ ok: true } | { ok: false; error: string }> {
  const paths = resolveAppPaths()
  if (mode === 'folder') {
    const target = resolveYtdlpFolderRevealTarget(rawPath, paths.userData)
    if (!target) {
      return { ok: false, error: ipc.fileOutsideDownloadDir }
    }
    try {
      if (target.kind === 'file') {
        shell.showItemInFolder(target.path)
        return { ok: true }
      }
      mkdirSync(target.path, { recursive: true })
      const err = await shell.openPath(target.path)
      return err ? { ok: false, error: err } : { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) }
    }
  }
  const file = resolveAllowedYtdlpDownloadOutputFile(rawPath, paths.userData)
  if (!file) {
    return { ok: false, error: ipc.fileOutsideDownloadDir }
  }
  try {
    const err = await shell.openPath(file)
    return err ? { ok: false, error: err } : { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

export async function openDownloadOutputInHandler(
  rawPath: unknown,
  ipc: DownloadsWindowIpcStrings
): Promise<{ ok: true } | { ok: false; error: string }> {
  const file = resolveAllowedDownloadOutputPath(rawPath)
  if (!file) {
    return { ok: false, error: ipc.fileOutsideDownloadDir }
  }
  const fn = getDownloadsBoundsHooks().openDownloadedFileInHandler
  if (!fn) {
    return { ok: false, error: ipc.handlerNotConnected }
  }
  return fn(file)
}

export function getDownloadsQueueSnapshotForRenderer(): Array<Record<string, unknown>> {
  const activeId = getActiveDownloadsRunnerRowId()
  const ps = getActiveYtdlpPauseState()
  return getDownloadsQueueSnapshot().map((r) => {
    const isActive = r.id === activeId
    const row: Record<string, unknown> = { ...r, isActiveRunner: isActive }
    if (isActive) {
      row['ytdlpPauseSupported'] = ps.supported
      row['ytdlpPauseChildActive'] = ps.active
      row['ytdlpPaused'] = ps.paused
    }
    return row
  })
}
