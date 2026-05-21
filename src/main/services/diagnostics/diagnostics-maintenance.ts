import { existsSync, readdirSync, rmSync, statSync, type Dirent, type Stats } from 'fs'
import { basename, join } from 'path'

import { resolveAppTempDirectory } from '../../core/app-data-root-paths'

import type { AppPaths } from '../../core/app-paths'
import { resolveYtdlpOutputDirectory } from '../ytdlp/ytdlp-download-output'
import type {
  DiagnosticsCleanMaintenanceRequest,
  DiagnosticsCleanMaintenanceResult,
  DiagnosticsMaintenanceSnapshot,
  DiagnosticsMaintenanceTarget,
  DiagnosticsMaintenanceTargetId
} from '../../../shared/diagnostics-contract'
import type { AppUiLocale } from '../../../shared/app-ui-locale'
import { getMainApplicationStrings } from '../../../shared/main-application-locale'

interface UsageStats {
  files: number
  directories: number
  bytes: number
}

interface CleanStats {
  removedFiles: number
  removedDirectories: number
  removedBytes: number
}

interface TargetSpec {
  id: DiagnosticsMaintenanceTargetId
  label: string
  path: string
  fileFilter?: (name: string) => boolean
  rootEntryFilter?: (entry: Dirent, fullPath: string, stats: Stats) => boolean
}

const emptyUsage: UsageStats = { files: 0, directories: 0, bytes: 0 }
const defaultTargets: DiagnosticsMaintenanceTargetId[] = [
  'previewCache',
  'ytdlpPartials',
  'ffmpegTemp'
]
const oldFfmpegTempMs = 6 * 60 * 60 * 1000

function newestMtimeInDirectory(root: string): number | null {
  let newest: number | null = null
  function visit(dir: string): void {
    let entries: Dirent[]
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const full = join(dir, entry.name)
      try {
        const stats = statSync(full)
        newest = newest === null ? stats.mtimeMs : Math.max(newest, stats.mtimeMs)
        if (entry.isDirectory()) {
          visit(full)
        }
      } catch {
        /* ignore vanished temp entries */
      }
    }
  }
  visit(root)
  return newest
}

function isOldFfmpegTempDirectory(entry: Dirent, fullPath: string, stats: Stats): boolean {
  if (!entry.isDirectory() || !entry.name.startsWith('fa-x264tw-')) {
    return false
  }
  const newestChild = newestMtimeInDirectory(fullPath)
  const ageSource = newestChild ?? stats.mtimeMs
  return Date.now() - ageSource >= oldFfmpegTempMs
}

function isYtdlpTransientFile(name: string): boolean {
  const lower = name.toLowerCase()
  const base = basename(lower)
  return (
    lower.endsWith('.part') ||
    lower.endsWith('.ytdl') ||
    lower.endsWith('.temp') ||
    lower.endsWith('.tmp') ||
    lower.endsWith('.frag') ||
    lower.endsWith('.crdownload') ||
    lower.endsWith('.aria2') ||
    base === 'archive.part'
  )
}

function targetSpecs(paths: AppPaths): TargetSpec[] {
  return [
    {
      id: 'previewCache',
      label: 'Preview cache',
      path: join(paths.userData, 'preview-cache')
    },
    {
      id: 'ytdlpPartials',
      label: 'yt-dlp partial files',
      path: resolveYtdlpOutputDirectory(paths.userData),
      fileFilter: isYtdlpTransientFile
    },
    {
      id: 'ffmpegTemp',
      label: 'Old ffmpeg temp dirs',
      path: resolveAppTempDirectory(paths.userData),
      rootEntryFilter: isOldFfmpegTempDirectory
    }
  ]
}

function collectUsage(spec: TargetSpec): UsageStats {
  const root = spec.path
  if (!existsSync(root)) {
    return emptyUsage
  }
  const acc: UsageStats = { ...emptyUsage }
  function shouldVisitRootEntry(entry: Dirent, full: string): boolean {
    if (!spec.rootEntryFilter) {
      return true
    }
    try {
      return spec.rootEntryFilter(entry, full, statSync(full))
    } catch {
      return false
    }
  }
  function visit(dir: string, isRoot: boolean): void {
    let entries: Dirent[]
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const full = join(dir, entry.name)
      if (isRoot && !shouldVisitRootEntry(entry, full)) {
        continue
      }
      if (entry.isDirectory()) {
        acc.directories += 1
        visit(full, false)
        continue
      }
      if (!entry.isFile() || (spec.fileFilter && !spec.fileFilter(entry.name))) {
        continue
      }
      try {
        acc.files += 1
        acc.bytes += statSync(full).size
      } catch {
        /* vanished between readdir/stat */
      }
    }
  }
  visit(root, true)
  return acc
}

function cleanTarget(spec: TargetSpec): CleanStats {
  const stats: CleanStats = { removedFiles: 0, removedDirectories: 0, removedBytes: 0 }
  if (!existsSync(spec.path)) {
    return stats
  }
  function shouldVisitRootEntry(entry: Dirent, full: string): boolean {
    if (!spec.rootEntryFilter) {
      return true
    }
    try {
      return spec.rootEntryFilter(entry, full, statSync(full))
    } catch {
      return false
    }
  }
  function visit(dir: string, isRoot: boolean): boolean {
    let entries: Dirent[]
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return false
    }

    for (const entry of entries) {
      const full = join(dir, entry.name)
      if (isRoot && !shouldVisitRootEntry(entry, full)) {
        continue
      }
      if (entry.isDirectory()) {
        const emptyAfterClean = visit(full, false)
        if (emptyAfterClean) {
          try {
            rmSync(full, { recursive: true, force: true })
            stats.removedDirectories += 1
          } catch {
            /* non-empty or locked directory */
          }
        }
        continue
      }
      if (!entry.isFile() || (spec.fileFilter && !spec.fileFilter(entry.name))) {
        continue
      }
      try {
        const size = statSync(full).size
        rmSync(full, { force: true })
        stats.removedFiles += 1
        stats.removedBytes += size
      } catch {
        /* one locked file must not abort cleanup */
      }
    }

    try {
      return readdirSync(dir).length === 0
    } catch {
      return false
    }
  }

  visit(spec.path, true)
  return stats
}

function toTarget(spec: TargetSpec): DiagnosticsMaintenanceTarget {
  const usage = collectUsage(spec)
  return {
    id: spec.id,
    label: spec.label,
    path: spec.path,
    exists: existsSync(spec.path),
    cleanable: true,
    files: usage.files,
    directories: usage.directories,
    bytes: usage.bytes
  }
}

export function getDiagnosticsMaintenanceSnapshot(paths: AppPaths): DiagnosticsMaintenanceSnapshot {
  const targets = targetSpecs(paths).map(toTarget)
  const totalBytes = targets.reduce((sum, target) => sum + target.bytes, 0)
  const cleanableBytes = targets
    .filter((target) => target.cleanable)
    .reduce((sum, target) => sum + target.bytes, 0)
  return { targets, totalBytes, cleanableBytes }
}

export function cleanDiagnosticsMaintenance(
  paths: AppPaths,
  request?: DiagnosticsCleanMaintenanceRequest,
  locale: AppUiLocale = 'ru'
): DiagnosticsCleanMaintenanceResult {
  const requested = new Set<DiagnosticsMaintenanceTargetId>(
    request?.targets !== undefined ? request.targets : defaultTargets
  )
  const specs = targetSpecs(paths).filter((spec) => requested.has(spec.id))
  if (specs.length === 0) {
    return {
      ok: false,
      error: getMainApplicationStrings(locale).diagnosticsMaintenanceNoTargets
    }
  }

  const totals: CleanStats = { removedFiles: 0, removedDirectories: 0, removedBytes: 0 }
  for (const spec of specs) {
    const next = cleanTarget(spec)
    totals.removedFiles += next.removedFiles
    totals.removedDirectories += next.removedDirectories
    totals.removedBytes += next.removedBytes
  }

  return {
    ok: true,
    ...totals,
    targets: targetSpecs(paths).map(toTarget)
  }
}
