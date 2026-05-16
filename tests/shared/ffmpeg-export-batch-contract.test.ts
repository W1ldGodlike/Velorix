import { describe, expect, it } from 'vitest'

import {
  FFMPEG_EXPORT_BATCH_CONCURRENCY_LIMIT_CASES,
  FFMPEG_EXPORT_BATCH_CONCURRENCY_PARSE_CASES
} from '../fixtures/ffmpeg-export-batch-contract-cases'
import {
  parseFfmpegExportBatchConcurrency,
  resolveFfmpegExportBatchConcurrencyLimit
} from '../../src/shared/ffmpeg-export-batch-contract'

describe('ffmpeg-export-batch-contract', () => {
  it.each(FFMPEG_EXPORT_BATCH_CONCURRENCY_PARSE_CASES)(
    'parseFfmpegExportBatchConcurrency $raw → $expected',
    ({ raw, expected }) => {
      expect(parseFfmpegExportBatchConcurrency(raw)).toBe(expected)
    }
  )

  it.each(FFMPEG_EXPORT_BATCH_CONCURRENCY_LIMIT_CASES)(
    'resolveFfmpegExportBatchConcurrencyLimit $value cpu=$cpuCount',
    ({ value, cpuCount, expected }) => {
      expect(resolveFfmpegExportBatchConcurrencyLimit(value, cpuCount)).toBe(expected)
    }
  )
})
