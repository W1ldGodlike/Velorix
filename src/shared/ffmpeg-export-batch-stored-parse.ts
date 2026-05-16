import type { FfmpegExportBatchConcurrency } from './ffmpeg-export-batch-contract'

/** §7.3 — whitelist параллелизма пакетной очереди (1 / 2 / 4 / auto). */
export function parseFfmpegExportBatchConcurrency(raw: unknown): FfmpegExportBatchConcurrency {
  if (raw === 1 || raw === 2 || raw === 4) {
    return raw
  }
  return 'auto'
}
