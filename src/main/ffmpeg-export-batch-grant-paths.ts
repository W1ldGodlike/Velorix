/**
 * §7.3 — фильтрация путей перед добавлением в пакетную очередь (exists + video ext).
 */

import { existsSync } from 'node:fs'

import { collectUniqueVideoPaths } from '../shared/ffmpeg-export-batch-collect-paths'

export function filterExistingVideoPathsForBatch(paths: string[]): string[] {
  return collectUniqueVideoPaths(paths).filter((p) => existsSync(p))
}
