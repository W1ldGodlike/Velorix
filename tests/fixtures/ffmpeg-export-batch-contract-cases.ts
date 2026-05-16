import type { FfmpegExportBatchConcurrency } from '../../src/shared/ffmpeg-export-batch-contract'

export const FFMPEG_EXPORT_BATCH_CONCURRENCY_PARSE_CASES = [
  { raw: 1, expected: 1 as FfmpegExportBatchConcurrency },
  { raw: 2, expected: 2 as FfmpegExportBatchConcurrency },
  { raw: 4, expected: 4 as FfmpegExportBatchConcurrency },
  { raw: 'auto', expected: 'auto' as FfmpegExportBatchConcurrency },
  { raw: 'bad', expected: 'auto' as FfmpegExportBatchConcurrency }
] as const

export const FFMPEG_EXPORT_BATCH_CONCURRENCY_LIMIT_CASES = [
  { value: 2 as const, cpuCount: 8, expected: 2 },
  { value: 'auto' as const, cpuCount: 8, expected: 4 },
  { value: 'auto' as const, cpuCount: 2, expected: 1 }
] as const
