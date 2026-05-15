import { readdirSync } from 'node:fs'
import { join, normalize } from 'node:path'

import { isFfmpegExportBatchVideoPath } from '../shared/ffmpeg-export-batch-video-ext'

const MAX_BATCH_FOLDER_FILES = 500
const MAX_BATCH_FOLDER_DEPTH = 12

/** Рекурсивный обход папки; только обычные видеофайлы из whitelist §7.3. */
export function scanFolderForFfmpegExportBatchVideos(
  rootDir: string,
  maxFiles = MAX_BATCH_FOLDER_FILES
): string[] {
  const root = normalize(rootDir)
  const found: string[] = []

  const walk = (dir: string, depth: number): void => {
    if (found.length >= maxFiles || depth > MAX_BATCH_FOLDER_DEPTH) {
      return
    }
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      if (found.length >= maxFiles) {
        break
      }
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full, depth + 1)
      } else if (entry.isFile() && isFfmpegExportBatchVideoPath(full)) {
        found.push(normalize(full))
      }
    }
  }

  walk(root, 0)
  return found.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
}
