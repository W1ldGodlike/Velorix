import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import {
  collectWatchFolderMediaEntries,
  type WatchFolderDirEntry
} from '../shared/watch-folder-scan'

export function scanWatchFolderDirectory(folderPath: string): ReturnType<typeof collectWatchFolderMediaEntries> {
  let names: string[]
  try {
    names = readdirSync(folderPath)
  } catch {
    return []
  }
  const entries: WatchFolderDirEntry[] = []
  for (const name of names) {
    const full = join(folderPath, name)
    try {
      const st = statSync(full)
      if (!st.isFile()) {
        continue
      }
      entries.push({
        name,
        isFile: true,
        mtimeMs: st.mtimeMs,
        size: st.size
      })
    } catch {
      /* skip */
    }
  }
  return collectWatchFolderMediaEntries(entries)
}
