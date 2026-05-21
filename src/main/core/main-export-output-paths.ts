import { existsSync, statSync } from 'fs'
import { dirname, join, normalize, resolve } from 'path'

import { shell } from 'electron'

export type ExportOutputOpenMode = 'file' | 'folder' | 'preview'

export type MainExportOutputPathsAccess = {
  mainAppStr: () => {
    exportOutputPathMissing: string
    exportOutputBadMode: string
    exportOutputNotGranted: string
    exportOutputFileNotFound: string
    exportOutputNotAFile: string
    exportOutputStatFailed: string
  }
  getFfmpegExportDirectory: () => string | undefined
  getFfmpegSnapshotDirectory: () => string | undefined
  persistFfmpegExportDirectory: (dir: string) => void
  persistFfmpegSnapshotDirectory: (dir: string) => void
  openDownloadedFileInMainHandler: (
    absoluteFile: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>
}

let access: MainExportOutputPathsAccess | null = null

const grantedExportOutputPaths = new Set<string>()
const MAX_GRANTED_EXPORT_OUTPUT_PATHS = 20

export function configureMainExportOutputPaths(next: MainExportOutputPathsAccess): void {
  access = next
}

function requireAccess(): MainExportOutputPathsAccess {
  if (!access) {
    throw new Error('main-export-output-paths: configureMainExportOutputPaths not called')
  }
  return access
}

export function isExportOutputOpenMode(raw: unknown): raw is ExportOutputOpenMode {
  return raw === 'file' || raw === 'folder' || raw === 'preview'
}

export function rememberExportOutputPath(filePath: string): void {
  const abs = resolve(normalize(filePath))
  grantedExportOutputPaths.delete(abs)
  grantedExportOutputPaths.add(abs)
  while (grantedExportOutputPaths.size > MAX_GRANTED_EXPORT_OUTPUT_PATHS) {
    const oldest = grantedExportOutputPaths.values().next().value as string | undefined
    if (oldest === undefined) {
      break
    }
    grantedExportOutputPaths.delete(oldest)
  }
}

export async function openExportOutputPath(
  rawPath: unknown,
  rawMode: unknown
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const S = requireAccess().mainAppStr()
  if (typeof rawPath !== 'string' || rawPath.trim().length === 0) {
    return { ok: false, error: S.exportOutputPathMissing }
  }
  if (!isExportOutputOpenMode(rawMode)) {
    return { ok: false, error: S.exportOutputBadMode }
  }
  const abs = resolve(normalize(rawPath.trim()))
  if (!grantedExportOutputPaths.has(abs)) {
    return { ok: false, error: S.exportOutputNotGranted }
  }
  if (!existsSync(abs)) {
    return { ok: false, error: S.exportOutputFileNotFound }
  }
  try {
    if (!statSync(abs).isFile()) {
      return { ok: false, error: S.exportOutputNotAFile }
    }
  } catch {
    return { ok: false, error: S.exportOutputStatFailed }
  }
  if (rawMode === 'folder') {
    shell.showItemInFolder(abs)
    return { ok: true, path: abs }
  }
  if (rawMode === 'preview') {
    const opened = await requireAccess().openDownloadedFileInMainHandler(abs)
    return opened.ok ? { ok: true, path: abs } : opened
  }
  const result = await shell.openPath(abs)
  return result ? { ok: false, error: result } : { ok: true, path: abs }
}

export function rememberedExportDefaultPath(fileName: string): string {
  const raw = requireAccess().getFfmpegExportDirectory()
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return fileName
  }
  const dir = resolve(normalize(raw.trim()))
  try {
    if (existsSync(dir) && statSync(dir).isDirectory()) {
      return join(dir, fileName)
    }
  } catch {
    // Если папку удалили или доступ пропал, диалог всё равно откроется со стандартным именем.
  }
  return fileName
}

export function rememberFfmpegExportDirectory(outputPath: string): void {
  const dir = dirname(resolve(normalize(outputPath)))
  requireAccess().persistFfmpegExportDirectory(dir)
}

export function rememberedSnapshotDefaultPath(fileName: string): string {
  const raw = requireAccess().getFfmpegSnapshotDirectory()
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return fileName
  }
  const dir = resolve(normalize(raw.trim()))
  try {
    if (existsSync(dir) && statSync(dir).isDirectory()) {
      return join(dir, fileName)
    }
  } catch {
    // Удалённая/недоступная папка не должна мешать сохранению нового кадра.
  }
  return fileName
}

export function rememberFfmpegSnapshotDirectory(outputPath: string): void {
  const dir = dirname(resolve(normalize(outputPath)))
  requireAccess().persistFfmpegSnapshotDirectory(dir)
}
