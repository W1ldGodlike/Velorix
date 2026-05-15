import { describe, expect, it } from 'vitest'

import {
  parseFfmpegExportBatchConcurrency,
  resolveFfmpegExportBatchConcurrencyLimit
} from '../../src/shared/ffmpeg-export-batch-contract'

describe('ffmpeg-export-batch-contract', () => {
  it('parseFfmpegExportBatchConcurrency', () => {
    expect(parseFfmpegExportBatchConcurrency(1)).toBe(1)
    expect(parseFfmpegExportBatchConcurrency(2)).toBe(2)
    expect(parseFfmpegExportBatchConcurrency(4)).toBe(4)
    expect(parseFfmpegExportBatchConcurrency('auto')).toBe('auto')
    expect(parseFfmpegExportBatchConcurrency('bad')).toBe('auto')
  })

  it('resolveFfmpegExportBatchConcurrencyLimit', () => {
    expect(resolveFfmpegExportBatchConcurrencyLimit(2, 8)).toBe(2)
    expect(resolveFfmpegExportBatchConcurrencyLimit('auto', 8)).toBe(4)
    expect(resolveFfmpegExportBatchConcurrencyLimit('auto', 2)).toBe(1)
  })
})
