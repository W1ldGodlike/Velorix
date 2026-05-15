/**
 * §7.3 — открыть исходник строки пакетной очереди (файл / папка / редактор).
 */

import { existsSync, statSync } from 'node:fs'
import { normalize } from 'node:path'
import { shell } from 'electron'

import type { MainApplicationStrings } from '../shared/main-application-locale'
import { listFfmpegExportBatchInputPaths } from './ffmpeg-export-batch-queue'
import { grantMediaPath } from './media-protocol'

function batchInputPathKey(inputPath: string): string {
  return normalize(inputPath).toLowerCase()
}

function isKnownBatchQueueInputPath(inputPath: string): boolean {
  const key = batchInputPathKey(inputPath)
  return listFfmpegExportBatchInputPaths().some((p) => batchInputPathKey(p) === key)
}

export type OpenFfmpegExportBatchInputDeps = {
  openInMainHandler: (absoluteFile: string) => Promise<{ ok: true } | { ok: false; error: string }>
}

export async function openFfmpegExportBatchInputPath(
  rawPath: unknown,
  rawMode: unknown,
  S: MainApplicationStrings,
  deps: OpenFfmpegExportBatchInputDeps
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  if (
    typeof rawPath !== 'string' ||
    (rawMode !== 'file' && rawMode !== 'folder' && rawMode !== 'preview')
  ) {
    return { ok: false, error: S.exportOpenBadRequest }
  }
  const abs = normalize(rawPath.trim())
  if (!isKnownBatchQueueInputPath(abs)) {
    return { ok: false, error: S.batchExportInputNotInQueue }
  }
  if (!existsSync(abs)) {
    return { ok: false, error: S.batchExportInputNotFound }
  }
  try {
    if (!statSync(abs).isFile()) {
      return { ok: false, error: S.batchExportInputNotAFile }
    }
  } catch {
    return { ok: false, error: S.batchExportInputStatFailed }
  }
  if (!grantMediaPath(abs)) {
    return { ok: false, error: S.previewDialogGrantMediaFailed }
  }
  if (rawMode === 'preview') {
    const opened = await deps.openInMainHandler(abs)
    return opened.ok ? { ok: true, path: abs } : opened
  }
  if (rawMode === 'folder') {
    shell.showItemInFolder(abs)
    return { ok: true, path: abs }
  }
  const result = await shell.openPath(abs)
  return result ? { ok: false, error: result } : { ok: true, path: abs }
}
