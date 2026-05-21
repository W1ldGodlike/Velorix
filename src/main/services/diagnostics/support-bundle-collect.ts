import { existsSync, readdirSync, readFileSync, statSync, unlinkSync, type Stats } from 'fs'
import { basename, join } from 'path'

import type {
  DiagnosticsPruneOptions,
  DirectoryUsageStats,
  ZipEntryInput
} from './support-bundle-types'
import { MAX_BUNDLE_FILE_BYTES, MAX_CRASH_DUMP_FILES } from './support-bundle-types'

function readLimitedFile(path: string, stats: Stats): Buffer {
  const raw = readFileSync(path)
  if (stats.size <= MAX_BUNDLE_FILE_BYTES) {
    return raw
  }
  const note = Buffer.from(
    `[FluxAlloy] File was truncated to last ${MAX_BUNDLE_FILE_BYTES} bytes.\n\n`,
    'utf8'
  )
  return Buffer.concat([note, raw.subarray(raw.length - MAX_BUNDLE_FILE_BYTES)])
}

export function pushFile(entries: ZipEntryInput[], zipName: string, path: string | null): void {
  if (!path || !existsSync(path)) {
    return
  }
  try {
    const st = statSync(path)
    if (!st.isFile()) {
      return
    }
    entries.push({ name: zipName, data: readLimitedFile(path, st), mtime: st.mtime })
  } catch {
    /* Support ZIP не должен падать из-за одного недоступного файла. */
  }
}

export function pushCrashDumps(entries: ZipEntryInput[], crashDir: string | null): void {
  if (!crashDir || !existsSync(crashDir)) {
    return
  }
  try {
    const files = readdirSync(crashDir)
      .map((name) => {
        const path = join(crashDir, name)
        const st = statSync(path)
        return { name, path, st }
      })
      .filter((x) => x.st.isFile())
      .sort((a, b) => b.st.mtimeMs - a.st.mtimeMs)
      .slice(0, MAX_CRASH_DUMP_FILES)
    for (const file of files) {
      pushFile(entries, `crash-dumps/${basename(file.name)}`, file.path)
    }
  } catch {
    /* отсутствие crash dumps не критично */
  }
}

export function collectDirectoryUsage(path: string | null): DirectoryUsageStats | null {
  if (!path || !existsSync(path)) {
    return null
  }
  try {
    const root = statSync(path)
    if (!root.isDirectory()) {
      return null
    }
    const acc: DirectoryUsageStats = { files: 0, directories: 0, bytes: 0 }
    const stack = [path]
    while (stack.length > 0) {
      const dir = stack.pop()
      if (!dir) {
        continue
      }
      let entries: string[] = []
      try {
        entries = readdirSync(dir)
      } catch {
        continue
      }
      for (const entry of entries) {
        const child = join(dir, entry)
        let st: Stats
        try {
          st = statSync(child)
        } catch {
          continue
        }
        if (st.isDirectory()) {
          acc.directories += 1
          stack.push(child)
          continue
        }
        if (!st.isFile()) {
          continue
        }
        acc.files += 1
        acc.bytes += st.size
      }
    }
    return acc
  } catch {
    return null
  }
}

export function formatDirectoryUsageLine(label: string, usage: DirectoryUsageStats | null): string {
  if (!usage) {
    return `${label}: -`
  }
  return `${label}: ${usage.files} files, ${usage.directories} dirs, ${usage.bytes} bytes`
}

export function pruneOldDiagnosticFiles(options: DiagnosticsPruneOptions): number {
  const dir = options.directory
  if (!dir || !existsSync(dir)) {
    return 0
  }
  const keepNewest = Math.max(0, Math.floor(options.keepNewest))
  const cutoff = Date.now() - Math.max(0, options.maxAgeMs)
  try {
    const files = readdirSync(dir)
      .map((name) => {
        const path = join(dir, name)
        const st = statSync(path)
        return { name, path, st }
      })
      .filter((file) => file.st.isFile())
      .filter((file) => !options.fileNamePattern || options.fileNamePattern.test(file.name))
      .sort((a, b) => b.st.mtimeMs - a.st.mtimeMs)
    let removed = 0
    files.forEach((file, index) => {
      if (index < keepNewest || file.st.mtimeMs >= cutoff) {
        return
      }
      try {
        unlinkSync(file.path)
        removed += 1
      } catch {
        /* один заблокированный файл не должен отменять общий prune */
      }
    })
    return removed
  } catch {
    return 0
  }
}
