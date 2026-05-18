import { isWatchFolderMediaFileName } from './workflow-watch-folder-media'

export type WatchFolderMediaEntry = {
  fileName: string
  mtimeMs: number
  size: number
}

export type WatchFolderDirEntry = {
  name: string
  isFile: boolean
  mtimeMs: number
  size: number
}

/** Скан одного уровня каталога (без подпапок). */
export function collectWatchFolderMediaEntries(
  entries: readonly WatchFolderDirEntry[]
): WatchFolderMediaEntry[] {
  const out: WatchFolderMediaEntry[] = []
  for (const ent of entries) {
    if (!ent.isFile || !isWatchFolderMediaFileName(ent.name)) {
      continue
    }
    out.push({ fileName: ent.name, mtimeMs: ent.mtimeMs, size: ent.size })
  }
  return out.sort((a, b) => a.fileName.localeCompare(b.fileName))
}

export type WatchFolderNewFile = {
  fileName: string
  mtimeMs: number
  size: number
}

/**
 * Файлы, которых ещё нет в `seen` (ключ — имя файла в папке).
 * Первый проход: заполнить `seen` без возврата новых.
 */
export function detectNewWatchFolderFiles(
  media: readonly WatchFolderMediaEntry[],
  seen: Readonly<Record<string, { mtimeMs: number; size: number }>>
): { newFiles: WatchFolderNewFile[]; nextSeen: Record<string, { mtimeMs: number; size: number }> } {
  const isBaseline = Object.keys(seen).length === 0
  const nextSeen: Record<string, { mtimeMs: number; size: number }> = { ...seen }
  const newFiles: WatchFolderNewFile[] = []
  for (const file of media) {
    const prev = nextSeen[file.fileName]
    if (!prev) {
      nextSeen[file.fileName] = { mtimeMs: file.mtimeMs, size: file.size }
      if (!isBaseline) {
        newFiles.push(file)
      }
    } else if (prev.mtimeMs !== file.mtimeMs || prev.size !== file.size) {
      nextSeen[file.fileName] = { mtimeMs: file.mtimeMs, size: file.size }
      if (!isBaseline) {
        newFiles.push(file)
      }
    }
  }
  return { newFiles, nextSeen }
}
