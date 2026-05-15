/**
 * §7.3 — счётчики добавления путей в пакетную очередь (main + renderer).
 */

export interface FfmpegExportBatchAddCounts {
  added: number
  skipped: number
}

export function emptyFfmpegExportBatchAddCounts(): FfmpegExportBatchAddCounts {
  return { added: 0, skipped: 0 }
}

export function sumFfmpegExportBatchAddCounts(
  ...parts: FfmpegExportBatchAddCounts[]
): FfmpegExportBatchAddCounts {
  let added = 0
  let skipped = 0
  for (const p of parts) {
    added += p.added
    skipped += p.skipped
  }
  return { added, skipped }
}
